import { canvas, gl } from '../engine.js'
import { currentLevel } from './currentLevel.js'
import { updateMusicTime } from './shared.js'
import { setReverbDestination } from './audio.js'
import { RenderTexture } from '../engine/graphics/RenderTexture.js'
import { quad } from '../assets/geometries/quad.js'
import { blitMaterial } from '../assets/materials/blitMaterial.js'
import { renderFluid, splat, updateSim } from './fluidSim.js'
import { vec3 } from '../math/vec3.js'

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
  updateSim()

  if (!window.TEST) {
    window.TEST = 1
    splat(
      vec3([50, 0.5, 0]),
      vec3([0.5, 0.5, 0])
    )
  }
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

  gl.blendFunc(gl.ONE, gl.ONE)
  renderFluid()

  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.viewport(0, 0, canvas.width, canvas.height)
  blitMaterial.shader.bind()
    .set1f('uniformAbberationSize', 2 / canvas.width)
  rt.bind(0)
  quad.draw()
}
