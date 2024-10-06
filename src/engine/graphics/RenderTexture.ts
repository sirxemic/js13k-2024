import { gl } from '../../engine'
import { Texture } from './Texture'

export interface RenderTextureParams {
  width: number
  height: number
}

export class RenderTexture extends Texture {
  framebuffer: WebGLFramebuffer

  constructor(options: RenderTextureParams) {
    super(options)

    this.framebuffer = gl.createFramebuffer()!

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0)
  }

  resize(width: number, height: number) {
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
  }

  use() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)
  }
}
