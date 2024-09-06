import { audioContext, audioDestination } from '../engine.js'
import { ReverbIR } from '../assets/audio/reverbIR.js'
import { createBiquadFilter } from '../audio/context.js'

const eq = createBiquadFilter('peaking', 192, 2, -4)
eq.connect(audioDestination)

let reverbDestination
export function setReverbDestination() {
  const reverb = audioContext.createConvolver()
  reverb.buffer = ReverbIR
  reverbDestination = audioContext.createGain()
  reverbDestination.gain.value = 0.7
  reverbDestination.connect(reverb)
  reverb.connect(eq)
}

export function playSample(sample, reverb = true) {
  if (!reverbDestination) return

  let source = audioContext.createBufferSource()
  source.buffer = sample
  if (reverb) {
    source.connect(reverbDestination)
  }
  source.connect(eq)
  source.start()
}
