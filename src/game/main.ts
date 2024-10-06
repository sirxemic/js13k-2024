import { canvas, gl } from '../engine'
import { currentLevel } from './currentLevel'
import { updateMusicTime } from './shared'
import { setReverbDestination } from './audio'
import { RenderTexture } from '../engine/graphics/RenderTexture'
import { quad } from '../assets/geometries/quad'
import { blitMaterial } from '../assets/materials/blitMaterial'

const rt = new RenderTexture({
  width: canvas.width,
  height: canvas.height
})

export function onResize() {
  rt.resize(canvas.width, canvas.height)
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
  rt.use()
  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.enable(gl.BLEND)
  gl.depthMask(false)
  gl.disable(gl.DEPTH_TEST)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  currentLevel.render()

  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.viewport(0, 0, canvas.width, canvas.height)
  blitMaterial.shader.bind()
    .set1f('uniformAbberationSize', 2 / canvas.width)
  rt.bind(0)
  quad.draw()
}
