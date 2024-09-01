import { VertexBuffer } from '../engine/graphics/VertexBuffer.js'
import { gl, useMaterial, VIEW_HEIGHT, VIEW_WIDTH } from '../engine.js'
import { strandMaterial } from '../assets/materials/strandMaterial.js'
import { mat4 } from '../math/mat4.js'
import { fillEffectRadius, strand } from './shared.js'
import { distance, vec3 } from '../math/vec3.js'

export class Tutorial {
  constructor() {
    this.vertexBuffer = new VertexBuffer()
    this.vertexBuffer.vertexLayout([3])
    this.vertexBuffer.vertexData(
      new Float32Array([
        191,122,0,
        198,120,0,
        206,118,0,
        214,118,0,
        222,120,0,
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
        243,242,0,
        248,247,0,
        255,252,0,
        262,255,0,
        270,256,0,
        278,256,0,
        286,256,0
      ])
    )
    this.show = false
  }

  render() {
    if (!this.show || strand.strandPositions.some(pos => {
      return distance(pos, vec3([VIEW_WIDTH / 2, VIEW_HEIGHT / 2, 0])) < 20
    })) {
      return
    }

    useMaterial(strandMaterial)
    strandMaterial.setModel(mat4())
    strandMaterial.shader.set1f('uniformNegRadius', fillEffectRadius)
    this.vertexBuffer.draw(gl.LINES)
  }
}
