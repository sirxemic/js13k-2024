import { audioContext, audioDestination } from '../engine.js'
import { ReverbIR } from '../assets/audio/reverbIR.js'

let reverbDestination
export function setReverbDestination() {
  const reverb = audioContext.createConvolver()
  reverb.buffer = ReverbIR
  reverbDestination = audioContext.createGain()
  reverbDestination.gain.value = 0.7
  reverbDestination.connect(reverb)
  reverb.connect(audioDestination)
}

export function playSample(sample) {
  if (!reverbDestination) return

  let source = audioContext.createBufferSource()
  source.buffer = sample
  source.connect(reverbDestination)
  source.connect(audioDestination)
  source.start()
}
