import { textMaterial } from '../assets/materials/textMaterial.js'
import { vec3 } from '../math/vec3.js'
import { mat4 } from '../math/mat4.js'
import { quad } from '../assets/geometries/quad.js'
import { titleTexture } from '../assets/textures/textTextures.js'
import { deltaTime, useMaterial, VIEW_HEIGHT, VIEW_WIDTH } from '../engine.js'
import { saturate, smoothstep } from '../math/math.js'

export class Title {
  time = 0
  render() {
    this.time = saturate(this.time + deltaTime)
    const scale = smoothstep(0, 0.5, this.time)
    useMaterial(textMaterial)
    textMaterial.shader.set1f('uniformNegRadius', 0)
    textMaterial.shader.set3fv('uniformColor1', vec3([1,1,1]))
    textMaterial.shader.set3fv('uniformColor2', vec3([0,0,0]))
    textMaterial.shader.set1f('uniformAlpha', 1)
    titleTexture.bind()
    textMaterial.setModel(mat4([
      150 * scale, 0, 0, 0,
      0, 150 * scale, 0, 0,
      0, 0, 1, 0,
      VIEW_WIDTH / 2, VIEW_HEIGHT / 2, 0, 1
    ]))
    quad.draw()
  }
}
