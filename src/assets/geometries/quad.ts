import { VertexBuffer } from '../../engine/graphics/VertexBuffer'

export const quad = new VertexBuffer()
quad.vertexLayout()
quad.vertexData(new Float32Array([
  -1,  1, 0,
  -1, -1, 0,
  1, -1, 0,

  1,  1, 0,
  -1, 1, 0,
  1, -1, 0
]))
