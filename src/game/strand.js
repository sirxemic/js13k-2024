import { VertexBuffer } from '../engine/graphics/VertexBuffer.js'
import { distance, vec3 } from '../math/vec3.js'
import { gl, lastPointerPosition, pointerPosition, useMaterial, VIEW_HEIGHT } from '../engine.js'
import { strandMaterial } from '../assets/materials/strandMaterial.js'
import { mat4 } from '../math/mat4.js'
import { fillEffectRadius, HANDLE_SIZE, musicTime } from './shared.js'
import { handleMaterial } from '../assets/materials/handleMaterial.js'
import { quad } from '../assets/geometries/quad.js'
import { PLUCK_SOUNDS_COUNT, PluckSounds } from '../assets/audio/Pluck.js'
import { playSample } from './audio.js'

const MIN_Y = HANDLE_SIZE
const MAX_Y = VIEW_HEIGHT - HANDLE_SIZE
const BAND_HEIGHT = (MAX_Y - MIN_Y) / PLUCK_SOUNDS_COUNT

const pauses = [
  0.1,
  0.1,
  0.2
]

export class Strand {
  constructor(startPosition) {
    this.vertexBuffer = new VertexBuffer()
    this.vertexBuffer.vertexLayout([3])
    this.vertexBuffer.vertexData(new Float32Array(3 * 10 * 1024))

    this.startPosition = startPosition
    this.strandPositions = [vec3(startPosition)]

    this.handlePosition = vec3(startPosition)
    this.handleTarget = vec3(startPosition)

    this.dragStart = undefined
    this.handleAtDragStart = undefined
    this.undoUntil = undefined

    this.vertexBuffer.updateVertexData(
      new Float32Array([
        -1000, startPosition[1], 0,
        ...startPosition
      ]),
      0
    )

    this.lastBand = this.getBand()
    this.lastSoundTime = 0
    this.lastSoundTimePauseIndex = 0
  }

  getBand() {
    return Math.floor((this.handlePosition[1] - MIN_Y) / BAND_HEIGHT)
  }

  startDrag() {
    this.dragStart = vec3(pointerPosition)
    this.handleAtDragStart = vec3(this.handleTarget)
  }

  stopDrag() {
    if (distance(this.dragStart, lastPointerPosition) < 2) {
      this.checkUndo()
    }
    this.dragStart = undefined
  }

  checkUndo() {
    for (let i = 1; i < this.strandPositions.length - 1; i++) {
      if (distance(this.strandPositions[i], lastPointerPosition) < HANDLE_SIZE) {
        this.strandPositions.length = i + 1
        this.handlePosition.set(this.strandPositions.at(-1))
        this.handleTarget.set(this.strandPositions.at(-1))
      }
    }
  }

  setFinished(endPosition) {
    this.handleTarget.set(endPosition)
    this.strandPositions.push(endPosition)
    this.vertexBuffer.updateVertexData(
      endPosition,
      this.strandPositions.length * 3 * 4
    )
  }

  update() {
    const pause = pauses[this.lastSoundTimePauseIndex]
    if (musicTime - this.lastSoundTime > pause) {
      const band = this.getBand()
      if (band !== this.lastBand) {
        playSample(PluckSounds[band])
        this.lastBand = band
      }
      while (musicTime - this.lastSoundTime > pause) {
        this.lastSoundTime += pause
        this.lastSoundTimePauseIndex = (this.lastSoundTimePauseIndex + 1) % pauses.length
      }
    }
  }

  render() {
    useMaterial(strandMaterial)
    strandMaterial.setModel(mat4())
    strandMaterial.shader.set1f('uniformNegRadius', fillEffectRadius)
    this.vertexBuffer.vertexCount = this.strandPositions.length + 1
    this.vertexBuffer.draw(gl.LINE_STRIP)

    useMaterial(handleMaterial)
    handleMaterial.setModel(mat4([
      HANDLE_SIZE, 0, 0, 0,
      0, HANDLE_SIZE, 0, 0,
      0, 0, 1, 0,
      ...this.handlePosition, 1
    ]))
    quad.draw()
  }
}
