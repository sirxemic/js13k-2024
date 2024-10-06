import {
  digitTextures,
  minusTexture,
  plusTexture
} from '../assets/textures/textTextures'
import { textMaterial } from '../assets/materials/textMaterial'
import { type Vec3, add, vec3 } from '../math/vec3'
import { mat4 } from '../math/mat4'
import { quad } from '../assets/geometries/quad'
import { fillEffectRadius } from './shared'
import { canvas, deltaTime, gl, useMaterial } from '../engine'
import { saturate, smoothstep } from '../math/math'
import { debugMaterial } from '../assets/materials/debugMaterial'
import { RandomMovement, randomMovement } from './randomMovement'
import type { Entity } from './types'
import type { Texture } from '../engine/graphics/Texture'

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

export class SymbolElement implements Entity {
  renderOffset: Vec3
  texture!: Texture
  width!: number
  height!: number
  value: string | number

  useCase?: string

  pos: Vec3
  rotation: number
  size: number

  originalPosition: Vec3
  originalRotation: number
  originalSize: number

  targetPosition?: Vec3
  targetSize?: number

  initAnimationT: number
  animationPositionFrom?: Vec3
  randomMovement: RandomMovement
  colorMerge: number
  renderAlpha?: number
  color?: Vec3

  partition?: number
  doMerge?: boolean

  constructor(value: string | number, size: number, position: Vec3, rotation = 0) {
    this.renderOffset = vec3()
    this.rotation = rotation
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
        case 'f':
          value = '-'
          this.rotation = Math.PI / 2
          this.texture = minusTexture
          this.width = size * 0.8
          this.height = size * 0.8
          break
        case '-':
          this.texture = minusTexture
          this.width = size * 0.8
          this.height = size * 0.8
          break
      }
    }

    this.originalRotation = this.rotation
    this.value = value
    this.pos = position
    this.size = size
    this.originalSize = size
    this.originalPosition = vec3(position)
    this.initAnimationT = -size / 50
    this.randomMovement = randomMovement()
    this.colorMerge = 1
  }

  update() {
    this.initAnimationT += deltaTime * 2
    this.randomMovement.update(this.size * 0.1)
  }

  render() {
    const initScale = smoothstep(0, 1, saturate(this.initAnimationT))
    const sin = Math.sin(this.rotation) * this.size * initScale
    const cos = Math.cos(this.rotation) * this.size * initScale
    useMaterial(textMaterial)
      .set1f('uniformNegRadius', fillEffectRadius)
      .set3fv('uniformColor1', vec3([1,1,1]))
      .set3fv('uniformColor2', this.color || vec3([0,0,0]))
      .set1f('uniformAlpha', this.renderAlpha ?? 1)
      .set1f('uniformColorMerge', this.colorMerge)
      .set1f('uniformAspectRatio', canvas.width / canvas.height)
      .setModel(mat4([
        cos, sin, 0, 0,
        -sin, cos, 0, 0,
        0, 0, 1, 0,
        ...add(vec3(), add(vec3(), this.pos, this.renderOffset), this.randomMovement.offset), 1
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
    //     ...this.pos, 1
    //   ]))
    // quad.draw(gl.LINE_STRIP)
    // </dev-only>
  }
}
