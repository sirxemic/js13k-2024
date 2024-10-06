import type { Quat } from './quat'

export type Vec3 = Float32Array

export function vec3 (args?: number[] | Vec3): Vec3 {
  // @ts-ignore
  return new Float32Array(args || 3)
}

export function dot (v1: Vec3, v2: Vec3): number {
  return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]
}

export function length (v: Vec3) {
  return Math.hypot(...v)
}

export function add (target: Vec3, v1: Vec3, v2: Vec3): Vec3 {
  target[0] = v1[0] + v2[0]
  target[1] = v1[1] + v2[1]
  target[2] = v1[2] + v2[2]
  return target
}

export function subtract (target: Vec3, v1: Vec3, v2: Vec3): Vec3 {
  target[0] = v1[0] - v2[0]
  target[1] = v1[1] - v2[1]
  target[2] = v1[2] - v2[2]
  return target
}

export function scale (target: Vec3, v: Vec3, scale: number): Vec3 {
  target[0] = v[0] * scale
  target[1] = v[1] * scale
  target[2] = v[2] * scale
  return target
}

export function addScaled (target: Vec3, v1: Vec3, v2: Vec3, scale: number): Vec3 {
  target[0] = v1[0] + v2[0] * scale
  target[1] = v1[1] + v2[1] * scale
  target[2] = v1[2] + v2[2] * scale
  return target
}

export function vec3Lerp (target: Vec3, v1: Vec3, v2: Vec3, x: number): Vec3 {
  target[0] = v1[0] + (v2[0] - v1[0]) * x
  target[1] = v1[1] + (v2[1] - v1[1]) * x
  target[2] = v1[2] + (v2[2] - v1[2]) * x
  return target
}

export function distance(v1: Vec3, v2: Vec3): number {
  return Math.hypot(v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2])
}

export function vec3Normalize (target: Vec3, vec = target): Vec3 {
  const m = Math.hypot(vec[0], vec[1], vec[2])
  target[0] = vec[0] / m
  target[1] = vec[1] / m
  target[2] = vec[2] / m
  return target
}

export function cross (target: Vec3, v1: Vec3, v2: Vec3): Vec3 {
  target[0] = v1[1] * v2[2] - v1[2] * v2[1]
  target[1] = v1[2] * v2[0] - v1[0] * v2[2]
  target[2] = v1[0] * v2[1] - v1[1] * v2[0]
  return target
}

export function applyQuat (target: Vec3, vec: Vec3, quat: Quat): Vec3 {
  const x = vec[0], y = vec[1], z = vec[2]
  const qx = quat[0], qy = quat[1], qz = quat[2], qw = quat[3]

  const ix = qw * x + qy * z - qz * y
  const iy = qw * y + qz * x - qx * z
  const iz = qw * z + qx * y - qy * x
  const iw = -qx * x - qy * y - qz * z

  target.set([
    ix * qw + iw * -qx + iy * -qz - iz * -qy,
    iy * qw + iw * -qy + iz * -qx - ix * -qz,
    iz * qw + iw * -qz + ix * -qy - iy * -qx
  ])

  return target
}

export function project (target: Vec3, toProject: Vec3, toProjectOnto: Vec3): Vec3 {
  return scale(target, toProjectOnto, dot(toProject, toProjectOnto) / dot(toProjectOnto, toProjectOnto))
}

export function fromXYZ (obj: { x: number, y: number, z: number }): Vec3 {
  return vec3([obj['x'], obj['y'], obj['z']])
}
