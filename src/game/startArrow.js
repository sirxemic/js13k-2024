import { arrowLeft } from '../assets/geometries/arrow.js'
import { shapeMaterial } from '../assets/materials/shapeMaterial.js'
import { mat4 } from '../math/mat4.js'
import { deltaTime, VIEW_HEIGHT, VIEW_WIDTH } from '../engine.js'

export function startArrow() {
  let time = 0
  let state = 0

  return {
    tag: 'startArrow',
    handleDrag() {
      state = 1
    },
    handleFinish() {
      state = 2
    },
    update() {
      time += deltaTime
    },
    render() {
      if (state === 2) {
        return
      }

      const offset = Math.sin(time * 9) * 4
      shapeMaterial.shader.bind()
      shapeMaterial.updateCameraUniforms()

      if (state === 0) {
        shapeMaterial.setModel(mat4([
          16, 0, 0, 0,
          0, 16, 0, 0,
          0, 0, 1, 0,
          50 + offset, VIEW_HEIGHT / 2 + 70, 0, 1
        ]))
      }
      else {
        shapeMaterial.setModel(mat4([
          -16, 0, 0, 0,
          0, 16, 0, 0,
          0, 0, 1, 0,
          VIEW_WIDTH - 50 + offset, VIEW_HEIGHT / 2 + 70, 0, 1
        ]))
      }
      arrowLeft.draw()
    }
  }
}
