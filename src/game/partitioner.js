import { VertexBuffer } from '../engine/graphics/VertexBuffer.js'
import { vec3 } from '../math/vec3.js'
import { IndexBuffer } from '../engine/graphics/IndexBuffer.js'
import { triangulate } from './triangulate.js'
import {
  PARTITION_COLORS,
  elements,
  fillEffectRadius,
  goal,
  partitions,
  setPartitions,
  showingEquationsTime,
  strand
} from './shared.js'
import { useMaterial, VIEW_HEIGHT, VIEW_MARGIN_X, VIEW_MARGIN_Y, VIEW_WIDTH } from '../engine.js'
import { getPolygonIntersections } from './getPolygonIntersections.js'
import { partitionMaterial } from '../assets/materials/partitionMaterial.js'
import { smoothstep } from '../math/math.js'

export class Partitioner {
  createPartitions() {
    function getPartition(perimeterVertices, color, reverse) {
      const vertexBuffer = new VertexBuffer()
      const points = [
        ...strand.strandPositions.slice(2),
        vec3([
          goal.position[0] + 500,
          goal.position[1],
          goal.position[2]
        ]),
        ...perimeterVertices
      ]
      if (reverse) {
        points.reverse()
      }
      vertexBuffer.vertexLayout([3])
      const vertexData = new Float32Array(points.flatMap(x => [...x]))
      vertexBuffer.vertexData(vertexData)

      const indexBuffer1 = new IndexBuffer()
      const indices1 = triangulate(points)
      indexBuffer1.setData(new Uint16Array(indices1))

      vertexBuffer.setIndexBuffer(indexBuffer1)
      return {
        color,
        points,
        vertexBuffer
      }
    }

    setPartitions([
      getPartition([
        vec3([
          VIEW_WIDTH + VIEW_MARGIN_X,
          -VIEW_MARGIN_Y,
          0
        ]),
        vec3([
          -VIEW_MARGIN_X,
          -VIEW_MARGIN_Y,
          0
        ]),
        vec3([-VIEW_MARGIN_X, strand.startPosition[1], 0])
      ], PARTITION_COLORS[0]),

      getPartition([
        vec3([
          VIEW_WIDTH + VIEW_MARGIN_X,
          VIEW_HEIGHT + VIEW_MARGIN_Y,
          0
        ]),
        vec3([
          -VIEW_MARGIN_X,
          VIEW_HEIGHT + VIEW_MARGIN_Y,
          0
        ]),
        vec3([-VIEW_MARGIN_X, strand.startPosition[1], 0])
      ], PARTITION_COLORS[1], true)
    ])

    for (const element of elements) {
      element.partition = this.getElementPartition(element.position)
      element.color = this.getElementPartitionColor(element.partition)
    }
  }

  getElementPartition(position) {
    for (let i = 0; i < partitions.length; i++) {
      const intersectionCount = getPolygonIntersections(position, vec3([Math.random(), 1, 0]), partitions[i].points)
      if (intersectionCount % 2 === 1) {
        return i
      }
    }
    return -1
  }

  getElementPartitionColor(partitionIndex) {
    if (partitionIndex === -1) {
      alert('uhm?')
      return vec3([0.5, 0.5, 0.5])
    }
    else {
      return PARTITION_COLORS[(partitionIndex + 1) % partitions.length]
    }
  }

  render() {
    if (partitions) {
      useMaterial(partitionMaterial)
        .set1f('uniformNegRadius', fillEffectRadius)
        .set1f('uniformFade', 1 - smoothstep(0, 1, showingEquationsTime))
      partitions.forEach(partition => {
        partitionMaterial.shader.set3fv('uniformColor', partition.color)
        partition.vertexBuffer.draw()
      })
    }
  }
}
