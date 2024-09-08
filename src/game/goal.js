import { VertexBuffer } from '../engine/graphics/VertexBuffer.js'
import { strandMaterial } from '../assets/materials/strandMaterial.js'
import { mat4 } from '../math/mat4.js'
import { fillEffectRadius, HANDLE_SIZE, strand } from './shared.js'
import { gl, useMaterial } from '../engine.js'
import { endMaterial } from '../assets/materials/endMaterial.js'
import { quad } from '../assets/geometries/quad.js'

export class Goal {
  constructor(position) {
    this.position = position
    this.vertexBuffer = new VertexBuffer()
    this.vertexBuffer.vertexLayout([3])
    this.vertexBuffer.vertexData(
      new Float32Array([
        ...position,
        position[0] + 500,
        position[1],
        position[2]
      ])
    )
  }

  update() {

  }

  render() {
    useMaterial(strandMaterial)
      .setModel(mat4())
      .set1f('uniformNegRadius', fillEffectRadius)
    this.vertexBuffer.draw(gl.LINE_STRIP)

    if (strand.handlePosition[0] <= this.position[0]) {
      useMaterial(endMaterial)
        .setModel(mat4([
          HANDLE_SIZE, 0, 0, 0,
          0, HANDLE_SIZE, 0, 0,
          0, 0, 1, 0,
          ...this.position, 1
        ]))
      quad.draw()
    }
  }
}
