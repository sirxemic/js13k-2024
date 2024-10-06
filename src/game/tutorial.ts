import { VertexBuffer } from '../engine/graphics/VertexBuffer'
import { canvas, gl, useMaterial, VIEW_MIDDLE } from '../engine'
import { strandMaterial } from '../assets/materials/strandMaterial'
import { mat4 } from '../math/mat4'
import { fillEffectRadius, strand } from './shared'
import { distance } from '../math/vec3'
import type { Entity } from './types'

export class Tutorial implements Entity {
  vertexBuffer: VertexBuffer
  show: boolean

  constructor() {
    this.vertexBuffer = new VertexBuffer()
    this.vertexBuffer.vertexLayout()
    this.vertexBuffer.vertexData(
      new Float32Array([
        229,124,0,
        233,131,0,
        235,139,0,
        236,147,0,
        237,155,0,
        238,163,0,
        238,171,0,
        237,179,0,
        236,187,0,
        236,195,0,
        236,203,0,
        236,211,0,
        237,219,0,
        238,227,0,
        239,234,0,
        243,242,0
      ])
    )
    this.show = false
  }

  render() {
    if (!this.show || strand.strandPositions.some(pos => {
      return distance(pos, VIEW_MIDDLE) < 20
    })) {
      return
    }

    useMaterial(strandMaterial)
      .setModel(mat4())
      .set1f('uniformNegRadius', fillEffectRadius)
      .set1f('uniformAspectRatio', canvas.width / canvas.height)
    this.vertexBuffer.draw(gl.LINES)
  }
}
