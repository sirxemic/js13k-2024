import { EnvelopeSampler } from '../utils.js'
import { audioContext, contextSampleRate } from '../engine.js'

export function decibelsToAmplitude (db) {
  return 10 ** (db / 20)
}

export function amplitudeToDecibels (amplitude) {
  return 20 * Math.log10(amplitude)
}

export function sampleSine (position) {
  return Math.sin(2 * Math.PI * position)
}

export function sampleSawtooth (position) {
  return (position % 1) * 2 - 1
}

export function sampleTriangle (position) {
  return Math.abs((position % 1) * 2 - 1) * 2 - 1
}

export function sampleSquare (position) {
  return samplePulse(position, 0.5)
}

export function samplePulse (position, length) {
  return (position % 1 < length) * 2 - 1
}

export function sampleSkewedSine (p, skew) {
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

export function detune (freq, cents) {
  return freq * 2 ** (cents / 1200)
}

export function mixBuffers (buffers, scalars) {
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

export function generateSound (length, sampleFunction) {
  const buffer = new Float32Array(length * contextSampleRate)

  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = sampleFunction(i / buffer.length, i / contextSampleRate)
  }

  return buffer
}

export function applyEnvelope (buffer, envelope) {
  const sampler = new EnvelopeSampler(envelope)
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] *= sampler.sample(i / buffer.length)
  }

  return buffer
}

export function getFrequencyDelta (freq) {
  return freq / contextSampleRate
}

export function createAudioBuffer (array) {
  if (!Array.isArray(array)) {
    array = [array]
  }
  const result = audioContext.createBuffer(array.length, array[0].length, contextSampleRate)
  for (let i = 0; i < array.length; i++) {
    result.getChannelData(i).set(array[i])
  }

  return result
}

function coefficients(b0, b1, b2, a0, a1, a2) {
  return [
    b0 / a0,
    b1 / a0,
    b2 / a0,
    a1 / a0,
    a2 / a0
  ]
}

function getBandPassCoefficients(frequency, Q) {
  let n = 1 / Math.tan(Math.PI * frequency / contextSampleRate)
  let nSquared = n * n
  let invQ = 1 / Q
  let c1 = 1 / (1 + invQ * n + nSquared)

  return coefficients(
    c1 * n * invQ, 0,
    -c1 * n * invQ, 1,
    c1 * 2 * (1 - nSquared),
    c1 * (1 - invQ * n + nSquared)
  )
}

function ensureEnvelope(envelopeOrValue) {
  if (typeof envelopeOrValue === 'number') {
    return [[0, envelopeOrValue], [1, envelopeOrValue]]
  }
  return envelopeOrValue
}

export function bandPassFilter(buffer, frequencies, Q = Math.SQRT1_2) {
  const freqSampler = new EnvelopeSampler(ensureEnvelope(frequencies), true)
  const qSampler = new EnvelopeSampler(ensureEnvelope(Q))

  return filter(buffer, x => getBandPassCoefficients(freqSampler.sample(x), qSampler.sample(x)))
}

function filter(buffer, coeffFunction) {
  let lv1 = 0
  let lv2 = 0

  for (let i = 0; i < buffer.length; ++i) {
    let coeffs = coeffFunction(i / (buffer.length - 1))

    let inV = buffer[i]
    let outV = (inV * coeffs[0]) + lv1
    buffer[i] = outV

    lv1 = (inV * coeffs[1]) - (outV * coeffs[3]) + lv2
    lv2 = (inV * coeffs[2]) - (outV * coeffs[4])
  }

  return buffer
}
