import { canvas, gl, VIEW_HEIGHT, VIEW_MARGIN_X, VIEW_MARGIN_Y, VIEW_WIDTH } from '../engine.js'
import { RenderTexture } from '../engine/graphics/RenderTexture.js'
import { currentLevel } from './currentLevel.js'

const lowresRT = new RenderTexture({
  width: 2 * VIEW_MARGIN_X + VIEW_WIDTH,
  height: 2 * VIEW_MARGIN_Y + VIEW_HEIGHT
})

export function onResize() {
  lowresRT.resize(2 * VIEW_MARGIN_X + VIEW_WIDTH, 2 * VIEW_MARGIN_Y + VIEW_HEIGHT)
}

export function update() {
  currentLevel.update()
}

gl.lineWidth(5)

export function render() {
  // lowresRT.use()
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.viewport(0, 0, canvas.width, canvas.height)
  // gl.viewport(0, 0, 2 * VIEW_MARGIN_X + VIEW_WIDTH, 2 * VIEW_MARGIN_Y + VIEW_HEIGHT)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.enable(gl.BLEND)
  gl.depthMask(false)
  gl.disable(gl.DEPTH_TEST)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  currentLevel.render()
}
