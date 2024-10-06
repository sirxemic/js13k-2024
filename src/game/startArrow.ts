import { arrowLeft } from '../assets/geometries/arrow'
import { shapeMaterial } from '../assets/materials/shapeMaterial'
import { mat4 } from '../math/mat4'
import { deltaTime, useMaterial, VIEW_HEIGHT, VIEW_WIDTH } from '../engine'
import { levelState, STATE_PLAYING } from './shared'
import { saturate } from '../math/math'
import type { Entity } from './types'

export class StartArrow implements Entity {
  time = 0
  state = 0

  handleDrag() {
    this.state = 1
  }

  handleFinish() {
    this.state = 2
  }

  update() {
    if (levelState !== STATE_PLAYING) return
    this.time += deltaTime
  }

  render() {
    if (this.state === 2) {
      return
    }

    const size = saturate(this.time * 5) * 16

    const offset = Math.sin(this.time * 9) * 4
    let model
    if (this.state === 0) {
      model = mat4([
        size, 0, 0, 0,
        0, size, 0, 0,
        0, 0, 1, 0,
        50 + offset, VIEW_HEIGHT / 2 + 70, 0, 1
      ])
    }
    else {
      model = mat4([
        -size, 0, 0, 0,
        0, size, 0, 0,
        0, 0, 1, 0,
        VIEW_WIDTH - 50 + offset, VIEW_HEIGHT / 2 + 70, 0, 1
      ])
    }
    useMaterial(shapeMaterial)
      .setModel(model)
      .set1f('uniformBrightness', 1)
    arrowLeft.draw()
  }
}
