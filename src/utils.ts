import { loading } from './ui'

export function removeFromArray<T>(arr: T[], item: T) {
  const index = arr.indexOf(item)
  if (index > -1) {
    arr.splice(index, 1)
    return true
  }
  return false
}

export type Envelope = (readonly [number, number] | readonly [number, number, number])[]

export class EnvelopeSampler {
  envelope: Envelope
  logarithmic?: boolean
  i!: number

  constructor (envelope: Envelope, logarithmic?: boolean) {
    this.envelope = envelope
    this.logarithmic = logarithmic
    this.reset()
  }

  reset () {
    this.i = 0
  }

  sample (position: number) {
    while (this.i < this.envelope.length - 1) {
      let [t1, v1, curve = 1] = this.envelope[this.i]
      let [t2, v2] = this.envelope[this.i + 1]
      if (t1 <= position && position < t2) {
        let t = (position - t1) / (t2 - t1)
        if (curve > 1) {
          t = t ** curve
        } else {
          t = 1 - (1 - t) ** (1 / curve)
        }
        return this.logarithmic ? v1 * (v2 / v1) ** t : v1 + t * (v2 - v1)
      }
      this.i++
    }
    return this.envelope[this.envelope.length - 1][1]
  }
}

export function ensureEnvelope(envelopeOrValue: number | Envelope) {
  if (typeof envelopeOrValue === 'number') {
    return [[0, envelopeOrValue], [1, envelopeOrValue]] as Envelope
  }
  return envelopeOrValue
}

/**
 * Waiting for the next frame is useful for preventing the browser to hang
 * while the assets are being generated
 */
export const updateInitProgress = () => new Promise(resolve => {
  loading.textContent += '.'
  requestAnimationFrame(resolve)
})

export function debug(...things: any[]) {
  let debugDiv = document.querySelector('.debug') as HTMLElement
  if (!debugDiv) {
    debugDiv = document.createElement('div')
    debugDiv.className = 'debug'
    debugDiv.style.position = 'fixed'
    debugDiv.style.bottom = '0'
    debugDiv.style.left = '0'
    debugDiv.style.fontSize = '16px'
    debugDiv.style.pointerEvents = 'none'
    document.body.append(debugDiv)
  }
  const row = document.createElement('div')
  row.textContent = things.join(';')
  debugDiv.appendChild(row)
}
