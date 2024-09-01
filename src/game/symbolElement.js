import { oneTexture, plusTexture, threeTexture, twoTexture } from '../assets/textures/textTextures.js'
import { textMaterial } from '../assets/materials/textMaterial.js'
import { add, vec3, vec3Lerp } from '../math/vec3.js'
import { mat4 } from '../math/mat4.js'
import { quad } from '../assets/geometries/quad.js'
import { fillEffectRadius } from './shared.js'
import { deltaTime, useMaterial } from '../engine.js'
import { saturate, smoothstep } from '../math/math.js'

export class SymbolElement {
  constructor(value, size, position) {
    switch (value) {
      case 1:
        this.texture = oneTexture
        break
      case 2:
        this.texture = twoTexture
        break
      case 3:
        this.texture = threeTexture
        break
      case '+':
        this.texture = plusTexture
        break
    }
    this.value = value
    this.width = size / 5 * 3
    this.height = size
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
  }

  update() {
    this.initAnimationT += deltaTime * 2
    this.offsetTime += deltaTime * this.offsetTimeVel
    vec3Lerp(this.offset, this.offsetFrom, this.offsetTo, smoothstep(0, 1, this.offsetTime))
    if (this.offsetTime >= 1) {
      this.offsetTime -= 1
      this.offsetFrom.set(this.offset)
      this.offsetTo = vec3([3 * (Math.random() - 0.5), 3 * (Math.random() - 0.5), 0])
      this.offsetTimeVel = Math.random() + 1
    }
  }

  render() {
    const initScale = smoothstep(0, 1, saturate(this.initAnimationT))
    useMaterial(textMaterial)
    textMaterial.shader.set1f('uniformNegRadius', fillEffectRadius)
    textMaterial.shader.set3fv('uniformColor1', vec3([1,1,1]))
    textMaterial.shader.set3fv('uniformColor2', this.color || vec3([0,0,0]))
    textMaterial.shader.set1f('uniformAlpha', this.alpha || 1)
    this.texture.bind()
    textMaterial.setModel(mat4([
      this.size * initScale, 0, 0, 0,
      0, this.size * initScale, 0, 0,
      0, 0, 1, 0,
      ...add(vec3(), this.position, this.offset), 1
    ]))
    quad.draw()

    // Debugging
    // useMaterial(debugMaterial)
    // debugMaterial.setModel(mat4([
    //   this.width, 0, 0, 0,
    //   0, this.height, 0, 0,
    //   0, 0, 1, 0,
    //   ...this.position, 1
    // ]))
    // quad.draw(gl.LINE_STRIP)
  }
}
