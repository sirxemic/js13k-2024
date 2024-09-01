import { applyEnvelope, bandPassFilter, createAudioBuffer, generateSound, sampleNoise } from '../../audio/utils.js'

export let ReverbIR

export function generateReverbIR () {
  function createNoisyEnvelope () {
    let t = 0
    let result = []
    do {
      result.push([t, Math.random()])

      t += 0.01
    } while (t <= 1)

    return result
  }
  const volumeEnvelope1 = createNoisyEnvelope()
  const volumeEnvelope2 = createNoisyEnvelope()

  const globalEnvelope = [
    [0, 0, 0.5],
    [0.05, 1, 0.5],
    [1, 0]
  ]

  ReverbIR = createAudioBuffer([
    applyEnvelope(
      applyEnvelope(
        bandPassFilter(generateSound(2, sampleNoise), 500, 1),
        volumeEnvelope1
      ),
      globalEnvelope
    ),
    applyEnvelope(
      applyEnvelope(
        bandPassFilter(generateSound(2, sampleNoise), 500, 1),
        volumeEnvelope2
      ),
      globalEnvelope
    )
  ])
}
