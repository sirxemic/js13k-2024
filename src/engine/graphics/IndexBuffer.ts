import { gl } from '../../engine'

export class IndexBuffer {
  buffer: WebGLBuffer
  count!: number

  constructor () {
    this.buffer = gl.createBuffer()!
  }

  setData (data: Uint16Array) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW)
    this.count = data.length
  }
}
