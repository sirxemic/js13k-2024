import { type Vec3, vec3 } from '../math/vec3'

export class Spline {
  points: Vec3[]
  xs: readonly [number[], number[], number[], number[]]
  ys: readonly [number[], number[], number[], number[]]

  constructor(points: Vec3[]) {
    this.points = points
    this.xs = this.cubicSplineCoefficients(points.map(p => p[0]))
    this.ys = this.cubicSplineCoefficients(points.map(p => p[1]))
  }

  evaluate(t: number) {
    if (t === 1) {
      return this.points.at(-1)!
    }
    t *= this.points.length - 1
    const i = Math.floor(t)
    const dx = t - i
    return vec3([
      this.xs[0][i] + this.xs[1][i] * dx + this.xs[2][i] * dx ** 2 + this.xs[3][i] * dx ** 3,
      this.ys[0][i] + this.ys[1][i] * dx + this.ys[2][i] * dx ** 2 + this.ys[3][i] * dx ** 3,
      0
    ])
  }

  cubicSplineCoefficients(values: number[]) {
    const n = values.length - 1
    const a: number[] = values.slice()
    const h: number[] = Array(n)
    const alpha: number[] = Array(n)
    const l: number[] = Array(n + 1).fill(1)
    const mu: number[] = Array(n).fill(0)
    const z: number[] = Array(n + 1).fill(0)
    const b: number[] = Array(n)
    const c: number[] = Array(n + 1).fill(0)
    const d: number[] = Array(n)

    for (let i = 0; i < n; i++) {
      h[i] = 1
    }

    for (let i = 1; i < n; i++) {
      alpha[i] = (3 / h[i]) * (a[i + 1] - a[i]) - (3 / h[i - 1]) * (a[i] - a[i - 1])
    }

    for (let i = 1; i < n; i++) {
      l[i] = 2 * (h[i] + h[i - 1]) - h[i - 1] * mu[i - 1]
      mu[i] = h[i] / l[i]
      z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i]
    }

    for (let j = n - 1; j >= 0; j--) {
      c[j] = z[j] - mu[j] * c[j + 1]
      b[j] = (a[j + 1] - a[j]) / h[j] - h[j] * (c[j + 1] + 2 * c[j]) / 3
      d[j] = (c[j + 1] - c[j]) / (3 * h[j])
    }

    return [a, b, c, d] as const
  }
}
