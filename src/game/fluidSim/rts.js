import { gl } from '../../engine.js'
import { RenderTexture } from '../../engine/graphics/RenderTexture.js'
import { supportLinearFiltering } from './common.js'
import { quad } from '../../assets/geometries/quad.js'

function createDoubleRT(options) {
  return {
    width: options.width,
    height: options.height,
    read: new RenderTexture(options),
    write: new RenderTexture(options),
    blit() {
      this.write.use()
      quad.draw()
      ;[this.read, this.write] = [this.write, this.read]
    }
  }
}

gl.getExtension('EXT_color_buffer_float')

const filter = supportLinearFiltering ? gl.LINEAR : gl.NEAREST

function getResolution(resolution) {
  let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight
  if (aspectRatio < 1)
    aspectRatio = 1.0 / aspectRatio

  let min = Math.round(resolution)
  let max = Math.round(resolution * aspectRatio)

  if (gl.drawingBufferWidth > gl.drawingBufferHeight)
    return { width: max, height: min };
  else
    return { width: min, height: max };
}

const dyeRes = getResolution(512)
export const dye = createDoubleRT({
  ...dyeRes,
  internalFormat: gl.RGBA16F,
  format: gl.RGBA,
  type: gl.HALF_FLOAT,
  filter
})

const simRes = getResolution(128)

export const velocity = createDoubleRT({
  ...simRes,
  internalFormat: gl.RGBA16F,
  format: gl.RGBA,
  type: gl.HALF_FLOAT,
  filter
})

const options = {
  ...simRes,
  internalFormat: gl.RGBA16F,
  format: gl.RGBA,
  type: gl.HALF_FLOAT,
  filter: gl.NEAREST
}
export const divergence = new RenderTexture(options)
export const curl = new RenderTexture(options)
export const pressure = createDoubleRT(options)
