import {
  digitTextures,
  equals13Texture,
  minusTexture, multiplyTexture,
  plusTexture
} from '../assets/textures/textTextures.js'
import { textMaterial } from '../assets/materials/textMaterial.js'
import { add, vec3, vec3Lerp } from '../math/vec3.js'
import { mat4 } from '../math/mat4.js'
import { quad } from '../assets/geometries/quad.js'
import { fillEffectRadius } from './shared.js'
import { deltaTime, gl, useMaterial } from '../engine.js'
import { saturate, smoothstep } from '../math/math.js'
// <dev-only>
import { debugMaterial } from '../assets/materials/debugMaterial.js'
// </dev-only>

const digitConfig = [
  [0.65, 0], // 0
  [0.55, 0.02], // 1
  [0.65, 0.05], // 2
  [0.67, 0.05], // 3
  [0.65, 0], // 4
  [0.65, 0], // 5
  [0.65, 0], // 6
  [0.65, 0], // 7
  [0.64, 0], // 8
  [0.65, 0], // 9
]

export class SymbolElement {
  constructor(value, size, position) {
    this.renderOffset = vec3()
    if (typeof value === 'number') {
      this.texture = digitTextures[value]
      this.width = size * digitConfig[value][0]
      this.height = size
      this.renderOffset[0] = digitConfig[value][1] * size
    }
    else {
      switch (value) {
        case '+':
          this.texture = plusTexture
          this.width = size * 0.8
          this.height = size * 0.8
          break
        case '-':
          this.texture = minusTexture
          this.width = size * 0.8
          this.height = size * 0.15
          break
        case '*':
          this.texture = multiplyTexture
          this.width = size * 0.65
          this.height = size * 0.65
          break
        case '13':
          this.texture = equals13Texture
          break
      }
    }

    this.rotation = 0
    this.value = value
    this.position = position
    this.size = size
    this.originalSize = size
    this.originalPosition = vec3(position)
    this.initAnimationT = -size / 50
    this.offset = vec3()
    this.offsetFrom = vec3()
    this.offsetTo = vec3([3 * (Math.random() - 0.5), 3 * (Math.random() - 0.5), 0])
    this.offsetTime = 0
    this.offsetTimeVel = Math.random() + 1
    this.colorMerge = 1
  }

  update() {
    this.initAnimationT += deltaTime * 2
    this.offsetTime += deltaTime * this.offsetTimeVel
    vec3Lerp(this.offset, this.offsetFrom, this.offsetTo, smoothstep(0, 1, this.offsetTime))
    if (this.offsetTime >= 1) {
      this.offsetTime -= 1
      this.offsetFrom.set(this.offset)
      this.offsetTo = vec3([this.size * 0.1 * (Math.random() - 0.5), this.size * 0.1 * (Math.random() - 0.5), 0])
      this.offsetTimeVel = Math.random() + 1
    }
  }

  render() {
    const initScale = smoothstep(0, 1, saturate(this.initAnimationT))
    const sin = Math.sin(this.rotation) * this.size * initScale
    const cos = Math.cos(this.rotation) * this.size * initScale
    useMaterial(textMaterial)
      .set1f('uniformNegRadius', fillEffectRadius)
      .set3fv('uniformColor1', vec3([1,1,1]))
      .set3fv('uniformColor2', this.color || vec3([0,0,0]))
      .set1f('uniformAlpha', this.alpha ?? 1)
      .set1f('uniformColorMerge', this.colorMerge)
      .setModel(mat4([
        cos, sin, 0, 0,
        -sin, cos, 0, 0,
        0, 0, 1, 0,
        ...add(vec3(), add(vec3(), this.position, this.renderOffset), this.offset), 1
      ]))
    this.texture.bind()
    quad.draw()

    // Debugging
    // <dev-only>
    // useMaterial(debugMaterial)
    //   .setModel(mat4([
    //     this.width, 0, 0, 0,
    //     0, this.height, 0, 0,
    //     0, 0, 1, 0,
    //     ...this.position, 1
    //   ]))
    // quad.draw(gl.LINE_STRIP)
    // </dev-only>
  }
}
