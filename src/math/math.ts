export function clamp (x: number, min: number, max: number) {
  return Math.min(Math.max(x, min), max)
}

export function saturate (x: number) {
  return clamp(x, 0, 1)
}

export function smoothstep(edge0: number, edge1: number, x: number) {
  x = saturate((x - edge0) / (edge1 - edge0))
  return x * x * (3.0 - 2.0 * x)
}

export const DEG2RAD = 0.017453292519943295
export const RAD2DEG = 57.29577951308232
