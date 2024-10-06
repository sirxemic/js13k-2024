import { VertexBuffer } from '../../engine/graphics/VertexBuffer'

export const arrowLeft = new VertexBuffer()
arrowLeft.vertexLayout()
arrowLeft.vertexData(new Float32Array([
  -1, 0, 0,
  0, -1, 0,
  0, 1, 0,

  0, -0.5, 0,
  1, -0.5, 0,
  0, 0.5, 0,

  0, 0.5, 0,
  1, -0.5, 0,
  1, 0.5, 0
]))
