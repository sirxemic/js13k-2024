import { VertexBuffer } from '../../engine/graphics/VertexBuffer.js'

const outerPoints = Array.from({ length: 5 }, (_, index) => {
  const angle = -Math.PI / 2 + index / 5 * Math.PI * 2
  return [Math.cos(angle), Math.sin(angle), 0]
})
const innerPoints = Array.from({ length: 5 }, (_, index) => {
  const angle = -Math.PI / 2 + (index + 0.5) / 5 * Math.PI * 2
  const innerRadius = 0.5
  return [innerRadius * Math.cos(angle), innerRadius * Math.sin(angle), 0]
})

export const star = new VertexBuffer()
star.vertexLayout([3])
star.vertexData(new Float32Array([
  ...outerPoints[0],
  ...innerPoints[0],
  ...innerPoints[4],

  ...outerPoints[1],
  ...innerPoints[1],
  ...innerPoints[0],

  ...outerPoints[2],
  ...innerPoints[2],
  ...innerPoints[1],

  ...outerPoints[3],
  ...innerPoints[3],
  ...innerPoints[2],

  ...outerPoints[4],
  ...innerPoints[4],
  ...innerPoints[3],

  ...innerPoints[0],
  ...innerPoints[1],
  ...innerPoints[2],

  ...innerPoints[0],
  ...innerPoints[2],
  ...innerPoints[4],

  ...innerPoints[2],
  ...innerPoints[4],
  ...innerPoints[3],
]))
