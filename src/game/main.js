import { canvas, gl } from '../engine.js'
import { currentLevel } from './currentLevel.js'
import { updateMusicTime } from './shared.js'
import { setReverbDestination } from './audio.js'

export function onResize() {

}

export function init() {
  setReverbDestination()
}

export function update() {
  currentLevel.update()
  updateMusicTime()
}

gl.lineWidth(5)

export function render() {
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.enable(gl.BLEND)
  gl.depthMask(false)
  gl.disable(gl.DEPTH_TEST)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  currentLevel.render()
}
