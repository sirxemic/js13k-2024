import { VertexBuffer } from '../engine/graphics/VertexBuffer.js'
import { vec3 } from '../math/vec3.js'

const handleSize = 16

const strand = new VertexBuffer()
strand.vertexLayout([3])
strand.vertexData(new Float32Array(3 * 10 * 1024))

const endStrand = new VertexBuffer()
endStrand.vertexLayout([3])
endStrand.vertexData(new Float32Array(3 * 2))

export function Strand(startPosition, endPosition) {
  strand.updateVertexData(
    new Float32Array([
      -1000, startPosition[1], 0,
      ...startPosition
    ]),
    0
  )

  endStrand.updateVertexData(
    new Float32Array([
      ...endPosition,
      endPosition[0] + 500,
      endPosition[1],
      endPosition[2]
    ])
  )

  const strandPositions = [
    vec3(startPosition)
  ]

  function update() {

  }

  function render() {

  }

  return { update, render }
}
