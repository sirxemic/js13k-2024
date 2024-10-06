import { textMaterial } from '../assets/materials/textMaterial'
import { vec3 } from '../math/vec3'
import { mat4 } from '../math/mat4'
import { quad } from '../assets/geometries/quad'
import { titleTexture } from '../assets/textures/textTextures'
import { deltaTime, useMaterial, VIEW_HEIGHT, VIEW_MIDDLE, VIEW_WIDTH } from '../engine'
import { saturate, smoothstep } from '../math/math'
import type { Entity } from './types'

export class Title implements Entity {
  time = 0
  render() {
    this.time = saturate(this.time + deltaTime)
    const scale = smoothstep(0, 0.5, this.time)
    useMaterial(textMaterial)
      .set1f('uniformNegRadius', 0)
      .set3fv('uniformColor1', vec3([1,1,1]))
      .set3fv('uniformColor2', vec3([0,0,0]))
      .set1f('uniformAlpha', 1)
      .setModel(mat4([
        150 * scale, 0, 0, 0,
        0, 150 * scale, 0, 0,
        0, 0, 1, 0,
        ...VIEW_MIDDLE, 1
      ]))
    titleTexture.bind()
    quad.draw()
  }
}
