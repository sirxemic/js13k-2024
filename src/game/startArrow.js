import { arrowLeft } from '../assets/geometries/arrow.js'
import { shapeMaterial } from '../assets/materials/shapeMaterial.js'
import { mat4 } from '../math/mat4.js'
import { deltaTime, VIEW_HEIGHT, VIEW_WIDTH } from '../engine.js'

let time = 0
let state = 0

export function startArrowHandleDrag() {
  state = 1
}

export function startArrowHandleFinish() {
  state = 2
}

export function startArrowRender() {
  if (state === 2) {
    return
  }

  time += deltaTime
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
