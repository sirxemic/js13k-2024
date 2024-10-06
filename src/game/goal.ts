import { VertexBuffer } from '../engine/graphics/VertexBuffer'
import { strandMaterial } from '../assets/materials/strandMaterial'
import { mat4 } from '../math/mat4'
import { HANDLE_SIZE, strand } from './shared'
import { canvas, gl, useMaterial, VIEW_WIDTH } from '../engine'
import { endMaterial } from '../assets/materials/endMaterial'
import { quad } from '../assets/geometries/quad'
import { type Vec3, vec3 } from '../math/vec3'
import type { Entity } from './types'

export class Goal implements Entity {
  pos: Vec3
  vertexBuffer: VertexBuffer
  renderAlpha: number

  constructor(y: number) {
    this.pos = vec3([VIEW_WIDTH - HANDLE_SIZE, y, 0])
    this.vertexBuffer = new VertexBuffer()
    this.vertexBuffer.vertexLayout()
    this.vertexBuffer.vertexData(
      new Float32Array([
        VIEW_WIDTH,
        y,
        0,
        VIEW_WIDTH + 500,
        y,
        0
      ])
    )

    this.renderAlpha = 1
  }

  update() {}

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
