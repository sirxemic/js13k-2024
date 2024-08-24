import { canvas, gl, VIEW_HEIGHT, VIEW_MARGIN_X, VIEW_MARGIN_Y, VIEW_WIDTH } from '../engine.js'
import { vec3 } from '../math/vec3.js'
import { getLevel } from './level.js'
import { RenderTexture } from '../engine/graphics/RenderTexture.js'
import { quad } from '../assets/geometries/quad.js'
import { pixelartMaterial } from '../assets/materials/pixelartMaterial.js'
import { oneTextures, threeTextures, titleTexture } from '../assets/textures/textTextures.js'

const level = getLevel({
  startPosition: vec3([10, VIEW_HEIGHT / 2 + 70, 0]),
  endPosition: vec3([VIEW_WIDTH, VIEW_HEIGHT / 2 + 70, 0]),
  elements: [
    {
      texture: oneTextures[0],
      size: 50,
      position: vec3([VIEW_WIDTH / 2 - 40, 180, 0])
    },
    {
      texture: threeTextures[0],
      size: 50,
      position: vec3([VIEW_WIDTH / 2 + 40, 180, 0])
    },
    {
      texture: titleTexture,
      size: 150,
      position: vec3([VIEW_WIDTH / 2, VIEW_HEIGHT / 2, 0])
    }
  ]
})

const lowresRT = new RenderTexture({
  width: 2 * VIEW_MARGIN_X + VIEW_WIDTH,
  height: 2 * VIEW_MARGIN_Y + VIEW_HEIGHT
})

export function onResize() {
  lowresRT.resize(2 * VIEW_MARGIN_X + VIEW_WIDTH, 2 * VIEW_MARGIN_Y + VIEW_HEIGHT)
}

export function update() {
  level.update()
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

  level.render()
  //
  // gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  // gl.viewport(0, 0, canvas.width, canvas.height)
  //
  // const w = 2 * VIEW_MARGIN_X + VIEW_WIDTH
  // const h = 2 * VIEW_MARGIN_Y + VIEW_HEIGHT
  // pixelartMaterial.shader.bind()
  // pixelartMaterial.shader.set1f('uniformPxPerTx', canvas.width / w)
  // pixelartMaterial.shader.set2f('uniformTextureSize', w, h)
  // lowresRT.bind(0)
  // quad.draw()
}
