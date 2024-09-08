import { gl } from '../../engine.js'

export class Texture {
  constructor ({
    data,
    width,
    height = width,
    internalFormat = gl.RGBA,
    format = gl.RGBA,
    type = gl.UNSIGNED_BYTE,
    wrap = gl.CLAMP_TO_EDGE,
    filter = gl.LINEAR
  }) {
    this.textureInternalFormat = internalFormat
    this.textureFormat = format
    this.textureType = type
    this.width = width
    this.height = height
    this.texture = gl.createTexture()

    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    if (width) {
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, null)
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, format, type, data)
    }
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter)
  }

  bind (slot = 0) {
    gl.activeTexture(gl.TEXTURE0 + slot)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    return slot
  }
}
