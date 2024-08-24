import { canvas, gl, VIEW_HEIGHT, VIEW_WIDTH } from '../engine.js'
import { vec3 } from '../math/vec3.js'
import { getLevel } from './level.js'

const level = getLevel({
  startPosition: vec3([10, VIEW_HEIGHT / 2, 0]),
  endPosition: vec3([VIEW_WIDTH, VIEW_HEIGHT / 2, 0]),
})

export function update() {
  level.update()
}

export function render() {
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.enable(gl.BLEND)
  gl.depthMask(false)
  gl.disable(gl.DEPTH_TEST)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  level.render()
}
