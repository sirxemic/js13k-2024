import { HANDLE_SIZE } from './shared'
import { audioContext, VIEW_HEIGHT } from '../engine'
import { PluckSounds } from '../assets/audio/Pluck'
import { type Vec3, distance, vec3 } from '../math/vec3'
import { playSample } from './audio'
import { PadSounds } from '../assets/audio/Pads'

function getBand(position: Vec3) {
  return Math.floor((position[1] - MIN_Y) / BAND_HEIGHT)
}

let position: Vec3 | undefined
let lastSoundPosition: Vec3
let lastBand: number
export function setPosition(pos: Vec3 | undefined) {
  if (!position && pos) {
    lastSoundPosition = vec3(pos)
    lastBand = getBand(pos)
  }
  position = pos ? vec3(pos) : undefined
}

const padNotes = [
  4, 1, 2, 0, 4, 1, 2, 3
]

const bassNotes = [
  4, 9, 1, 6, 2, 7, 0, 5, 4, 9, 1, 6, 2, 7, 3, 8
]

const notes1 = [
  21,20,19,17,16,15,14,12,11,10
]

const notes2 = [
  21,20,19,18,16,15,14,13,11,10
]

const MIN_Y = HANDLE_SIZE
const MAX_Y = VIEW_HEIGHT - HANDLE_SIZE
const BAND_HEIGHT = (MAX_Y - MIN_Y) / notes1.length

export let tick = 0
let paused = false
let started = false

export function startMusic() {
  if (started) {
    return
  }
  started = true
  setInterval(() => {
    if (paused || audioContext.state !== 'running') return

    if (tick % 256 >= 128 && tick % 16 === 0) {
      const index = Math.floor(tick / 16) % padNotes.length
      playSample(PadSounds[padNotes[index]])
    }
    if (tick % 8 === 0) {
      const bassIndex = Math.floor(tick / 8) % bassNotes.length
      playSample(PluckSounds[bassNotes[bassIndex]])
    }

    const notes = tick % 128 >= 128 * 7 / 8 ? notes2 : notes1

    if (position && (tick % 16) % 3 !== 2) {
      const band = getBand(position)

      const random = distance(lastSoundPosition, position) > 25 && Math.random() < 0.9
      if (band !== lastBand || random) {
        if (random) {
          let offset = Math.floor(Math.random() * 3) - 1
          if (band + offset >= notes.length || band + offset < 0) {
            offset = -offset
          }
          playSample(PluckSounds[notes[band + offset]])
          lastSoundPosition = vec3(position)
        }
        else {
          playSample(PluckSounds[notes[band]])
          lastSoundPosition = vec3(position)
        }
        lastBand = band
      }
    }

    tick++
  }, 100)
}

export function pause() {
  paused = true
}

export function resume() {
  paused = false
}
