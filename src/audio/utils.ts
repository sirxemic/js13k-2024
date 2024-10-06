import { type Envelope, EnvelopeSampler } from '../utils'
import { audioContext, contextSampleRate } from '../engine'

export function decibelsToAmplitude (db: number) {
  return 10 ** (db / 20)
}

export function amplitudeToDecibels (amplitude: number) {
  return 20 * Math.log10(amplitude)
}

export function sampleSine (position: number) {
  return Math.sin(2 * Math.PI * position)
}

export function sampleSawtooth (position: number) {
  return (position % 1) * 2 - 1
}

export function sampleTriangle (position: number) {
  return Math.abs((position % 1) * 2 - 1) * 2 - 1
}

export function sampleSquare (position: number) {
  return samplePulse(position, 0.5)
}

export function samplePulse (position: number, length: number) {
  return ((position % 1 < length) as unknown as number) * 2 - 1
}

export function sampleSkewedSine (p: number, skew: number) {
  p %= 1
  if (p < 0.25 * skew) {
    p = p / skew
  } else  if (p < 0.5) {
    p = 0.25 + 0.25 * (p - 0.25 * skew) / (0.5 - 0.25 * skew)
  } else if (p < 1 - 0.25 * skew) {
    p = 0.5 + 0.25 * (p - 0.5) / (1 - 0.25 * skew - 0.5)
  } else {
    p = 0.75 + 0.25 * (p - (1 - 0.25 * skew)) / (0.25 * skew)
  }
  return Math.sin(2 * Math.PI * p)
}

export function sampleNoise () {
  return Math.random() * 2 - 1
}

export function detune (freq: number, cents: number) {
  return freq * 2 ** (cents / 1200)
}

export function mixBuffers (buffers: Float32Array[], scalars: number[]) {
  let maxLength = 0
  buffers.forEach(buffer => { maxLength = Math.max(maxLength, buffer.length) })

  const outputBuffer = new Float32Array(maxLength)

  buffers.forEach((buffer, j) => {
    for (let i = 0; i < buffer.length; i++) {
      outputBuffer[i] += scalars[j] * buffer[i] / buffers.length
    }
  })

  return outputBuffer
}

export function generateSound (length: number, sampleFunction: (perc: number, t: number) => number) {
  const buffer = new Float32Array(length * contextSampleRate)

  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = sampleFunction(i / buffer.length, i / contextSampleRate)
  }

  return buffer
}

export function applyEnvelope (buffer: Float32Array, envelope: Envelope) {
  const sampler = new EnvelopeSampler(envelope)
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] *= sampler.sample(i / buffer.length)
  }

  return buffer
}

export function getFrequencyDelta (freq: number) {
  return freq / contextSampleRate
}

export function createAudioBuffer (array: Float32Array | Float32Array[]) {
  if (!Array.isArray(array)) {
    array = [array]
  }
  const result = audioContext.createBuffer(array.length, array[0].length, contextSampleRate)
  for (let i = 0; i < array.length; i++) {
    result.getChannelData(i).set(array[i])
  }

  return result
}






