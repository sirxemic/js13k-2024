import { gl } from '../../engine.js'
import { Texture } from './Texture.js'
import { quad } from '../../assets/geometries/quad.js'

export class RenderTexture extends Texture {
  constructor(options) {
    super(options)

    this.framebuffer = gl.createFramebuffer()

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0)
    gl.viewport(0, 0, this.width, this.height)
    gl.clear(gl.COLOR_BUFFER_BIT)
  }

  resize(width, height) {
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, this.textureInternalFormat, width, height, 0, this.textureFormat, this.textureType, null)
    this.width = width
    this.height = height
  }

  use() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)
    gl.viewport(0, 0, this.width, this.height)
  }

  blit() {
    this.use()
    quad.draw()
  }
}
