export type Vec2 = Float32Array

export function rotate(target: Vec2, vec: Vec2, theta: number): Vec2 {
  target[0] = vec[0] * Math.cos(theta) - vec[1] * Math.sin(theta)
  target[1] = vec[0] * Math.sin(theta) + vec[1] * Math.cos(theta)
  return target
}
