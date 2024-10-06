import type { Vec3 } from '../math/vec3'
import type { VertexBuffer } from '../engine/graphics/VertexBuffer'

export interface Entity {
  update?: () => void
  render: () => void
}

export interface Partition {
  color: Vec3
  points: Vec3[]
  vertexBuffer: VertexBuffer
}
