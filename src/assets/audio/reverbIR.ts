import { applyEnvelope, createAudioBuffer, generateSound, sampleNoise } from '../../audio/utils'
import { bandPassFilter } from '../../audio/filters'
import type { Envelope } from '../../utils'

export let ReverbIR: AudioBuffer

export function generateReverbIR () {
  function createNoisyEnvelope (): Envelope {
    let t = 0
    let result: Envelope = []
    do {
      result.push([t, Math.random()] as const)

      t += 0.01
    } while (t <= 1)

    return result
  }
  const volumeEnvelope1 = createNoisyEnvelope()
  const volumeEnvelope2 = createNoisyEnvelope()

  const globalEnvelope: Envelope = [
    [0, 0, 0.5],
    [0.05, 1, 0.2],
    [1, 0]
  ]

  ReverbIR = createAudioBuffer([
    applyEnvelope(
      applyEnvelope(
        bandPassFilter(generateSound(3, sampleNoise), [[0, 1000], [0.5, 420], [0.7, 1500]], 1),
        volumeEnvelope1
      ),
      globalEnvelope
    ),
    applyEnvelope(
      applyEnvelope(
        bandPassFilter(generateSound(3, sampleNoise), [[0, 1000], [0.5, 420], [0.7, 1500]], 1),
        volumeEnvelope2
      ),
      globalEnvelope
    )
  ])
}
