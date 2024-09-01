import {
  generateSound,
  applyEnvelope,
  getFrequencyDelta,
  sampleTriangle,
  createAudioBuffer, bandPassFilter
} from '../../audio/utils.js'
import { updateInitProgress } from '../../utils.js'

const freqs = [
  550 / 2,
  660 / 2,
  733.33 / 2,

  440,
  495,
  550,
  660,
  733.33,

  880,
  990,
  1100,
  1320,
  1466.67
].reverse()

export let PluckSounds = []
export const PLUCK_SOUNDS_COUNT = freqs.length

let volumeEnvelope = [
  [0, 0, 2],
  [0.01, 0.5, 0.5],
  [0.03, 0.4, 0.02],
  [1, 0]
]
function generatePluckSound(frequency) {
  let p = 0
  function getSample (t) {
    p += getFrequencyDelta(frequency)
    return sampleTriangle(p)
  }

  return createAudioBuffer(
    bandPassFilter(
      applyEnvelope(
        generateSound(2, getSample),
        volumeEnvelope
      ),
      [[0, 1000], [0.1, frequency / 4]]
    )
  )
}

export async function generatePluckSounds() {
  let progress = 0
  for (const freq of freqs) {
    PluckSounds.push(await generatePluckSound(freq))
    if (progress++ % 5 === 0) {
      await updateInitProgress()
    }
  }
}
