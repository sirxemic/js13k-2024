import { VertexBuffer } from '../engine/graphics/VertexBuffer.js'
import { strandMaterial } from '../assets/materials/strandMaterial.js'
import { mat4 } from '../math/mat4.js'
import { fillEffectRadius, HANDLE_SIZE, strand } from './shared.js'
import { canvas, gl, useMaterial } from '../engine.js'
import { endMaterial } from '../assets/materials/endMaterial.js'
import { quad } from '../assets/geometries/quad.js'

export class Goal {
  constructor(position) {
    this.pos = position
    this.vertexBuffer = new VertexBuffer()
    this.vertexBuffer.vertexLayout([3])
    this.vertexBuffer.vertexData(
      new Float32Array([
        position[0] + HANDLE_SIZE,
        position[1],
        position[2],
        position[0] + 500,
        position[1],
        position[2]
      ])
    )

    this.renderAlpha = 1
  }

  update() {

  }

  render() {
    useMaterial(strandMaterial)
      .setModel(mat4())
      .set1f('uniformAlpha', this.renderAlpha)
      .set1f('uniformAspectRatio', canvas.width / canvas.height)
    this.vertexBuffer.draw(gl.LINE_STRIP)

    if (strand.handlePosition[0] <= this.pos[0]) {
      useMaterial(endMaterial)
        .setModel(mat4([
          HANDLE_SIZE, 0, 0, 0,
          0, HANDLE_SIZE, 0, 0,
          0, 0, 1, 0,
          ...this.pos, 1
        ]))
      quad.draw()
    }
  }
}
