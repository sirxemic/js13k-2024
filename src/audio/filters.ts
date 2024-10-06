import { ensureEnvelope, type Envelope, EnvelopeSampler } from '../utils'
import { contextSampleRate } from '../engine'

export function bandPassFilter(buffer: Float32Array, frequencies: number | Envelope, Q: number | Envelope = Math.SQRT1_2) {
  const freqSampler = new EnvelopeSampler(ensureEnvelope(frequencies), true)
  const qSampler = new EnvelopeSampler(ensureEnvelope(Q))

  return filter(buffer, x => getBandPassCoefficients(freqSampler.sample(x), qSampler.sample(x)))
}

export function lowPassFilter (buffer: Float32Array, frequencies: number | Envelope, Q: number | Envelope = Math.SQRT1_2) {
  const freqSampler = new EnvelopeSampler(ensureEnvelope(frequencies), true)
  const qSampler = new EnvelopeSampler(ensureEnvelope(Q))

  return filter(buffer, x => getLowPassCoefficients(freqSampler.sample(x), qSampler.sample(x)))
}

function coefficients(b0: number, b1: number, b2: number, a0: number, a1: number, a2: number) {
  return [
    b0 / a0,
    b1 / a0,
    b2 / a0,
    a1 / a0,
    a2 / a0
  ]
}

function getBandPassCoefficients(frequency: number, Q: number) {
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

function filter(buffer: Float32Array, coeffFunction: (x: number) => number[]) {
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

function getLowPassCoefficients (frequency: number, Q: number) {
  let n = 1 / Math.tan(Math.PI * frequency / contextSampleRate)
  let nSquared = n * n
  let invQ = 1 / Q
  let c1 = 1 / (1 + invQ * n + nSquared)

  return coefficients(
    c1, c1 * 2,
    c1, 1,
    c1 * 2 * (1 - nSquared),
    c1 * (1 - invQ * n + nSquared)
  )
}
