import {
  generateSound,
  applyEnvelope,
  getFrequencyDelta,
  createAudioBuffer,
  sampleSawtooth
} from '../../audio/utils'
import { lowPassFilter } from '../../audio/filters'
import type { Envelope } from '../../utils'

export let ErrorSound: AudioBuffer

let volumeEnvelope: Envelope = [
  [0, 0, 2],
  [0.01, 0.15, 0.5],
  [0.8, 0.1, 0.02],
  [1, 0]
]
export function generateErrorSound() {
  let p = 0
  function getSample (t: number) {
    p += getFrequencyDelta(t < 0.4 ? 55: 30)
    return sampleSawtooth(p)
  }

  ErrorSound = createAudioBuffer(
    lowPassFilter(
      applyEnvelope(
        generateSound(0.95, getSample),
        volumeEnvelope
      ),
      [
        [0, 20],
        [0.125, 17000],
        [0.4, 3000, 0.1],
        [0.625, 283, 2],
        [1, 20]
      ] as Envelope
    )
  )
}
