import { addScaled, scale, vec3 } from '../math/vec3.js'
import { deltaTime, useMaterial, VIEW_HEIGHT, VIEW_MARGIN_X, VIEW_WIDTH } from '../engine.js'
import { shapeMaterial } from '../assets/materials/shapeMaterial.js'
import { mat4 } from '../math/mat4.js'
import { star } from '../assets/geometries/star.js'
import { goal } from './shared.js'

const STAR_COUNT = 13

export class Stars {
  constructor() {
    this.positions = Array.from({ length: STAR_COUNT }, () => {
      return vec3([
        VIEW_WIDTH + VIEW_MARGIN_X,
        goal.position[1],
        0
      ])
    })
    this.velocities = Array.from({ length: STAR_COUNT }, (_, index) => {
      const angle = Math.PI / 2 + index / STAR_COUNT * Math.PI * 2
      return vec3([Math.cos(angle), Math.sin(angle), 0])
    })
    this.size = 16
    this.time = 0
  }

  update() {
    for (let i = 0; i < STAR_COUNT; i++) {
      addScaled(this.positions[i], this.positions[i], this.velocities[i], 400 * deltaTime)
      if (this.time > 0.25) {
        scale(this.velocities[i], this.velocities[i], Math.exp(-9 * deltaTime))
      }
    }
    if (this.time > 0.5) {
      this.size *= Math.exp(-9 * deltaTime)
    }
    this.time += deltaTime
  }

  render() {
    useMaterial(shapeMaterial)

    if (this.size < 1) return
    for (let i = 0; i < STAR_COUNT; i++) {
      shapeMaterial.shader.setModel(mat4([
        this.size, 0, 0, 0,
        0, this.size, 0, 0,
        0, 0, 1, 0,
        ...this.positions[i], 1
      ]))
      star.draw()
    }
  }
}
