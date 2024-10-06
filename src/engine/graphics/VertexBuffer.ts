import { gl } from '../../engine'
import type { IndexBuffer } from './IndexBuffer'

export class VertexBuffer {
  va: WebGLVertexArrayObject
  vb: WebGLBuffer
  stride: number
  length: number
  vertexCount: number
  indexBuffer?: IndexBuffer

  constructor () {
    this.va = gl.createVertexArray()!
    gl.bindVertexArray(this.va)

    this.vb = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vb)

    this.stride = 0
    this.length = 0
    this.vertexCount = 0

    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.bindVertexArray(null)
  }

  vertexLayout (layout = [3]) {
    for (let i = 0; i < layout.length; i++) {
      this.stride += layout[i] * 4
    }

    gl.bindVertexArray(this.va)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vb)

    let istride = 0
    for (let i = 0; i < layout.length; i++) {
      gl.vertexAttribPointer(i, layout[i], gl.FLOAT, false, this.stride, istride)
      gl.enableVertexAttribArray(i)

      istride += layout[i] * 4
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.bindVertexArray(null)

    this.stride = this.stride / 4
    this.vertexCount = this.length / this.stride
  }

  vertexData (data: Float32Array) {
    this.length = data.length
    gl.bindVertexArray(this.va)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vb)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW)
    this.vertexCount = this.length / this.stride
  }

  updateVertexData (data: Float32Array, offset = 0) {
    gl.bindVertexArray(this.va)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vb)
    gl.bufferSubData(gl.ARRAY_BUFFER, offset, data)
  }

  draw (type: GLenum = gl.TRIANGLES) {
    gl.bindVertexArray(this.va)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vb)
    if (this.indexBuffer) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer.buffer)

      gl.drawElements(gl.TRIANGLES, this.indexBuffer.count, gl.UNSIGNED_SHORT, 0)
    }
    else {
      gl.bindVertexArray(this.va)
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vb)

      gl.drawArrays(type, 0, this.vertexCount)
    }
  }

  setIndexBuffer(indexBuffer: IndexBuffer) {
    this.indexBuffer = indexBuffer
  }
}
