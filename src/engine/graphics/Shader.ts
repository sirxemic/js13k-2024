import { gl } from '../../engine'
import type { SubShader } from './Subshader'
import type { Mat4 } from '../../math/mat4'
import type { Vec2 } from '../../math/vec2'
import type { Vec3 } from '../../math/vec3'

export class Shader {
  program: WebGLProgram

  constructor () {
    this.program = gl.createProgram()!
  }

  join (subShader: SubShader) {
    gl.attachShader(this.program, subShader.shader)
    return this
  }

  link () {
    gl.linkProgram(this.program)
    gl.useProgram(this.program)
    gl.useProgram(null)
    return this
  }

  bind () {
    gl.useProgram(this.program)
    return this
  }

  unbind () {
    gl.useProgram(null)
    return this
  }

  setModel (mat: Mat4) {
    this.set4x4f('uniformModel', mat)
    return this
  }

  set1i (name: string, val: number) {
    gl.uniform1i(gl.getUniformLocation(this.program, name), val)
    return this
  }

  set1f (name: string, val: number) {
    gl.uniform1f(gl.getUniformLocation(this.program, name), val)
    return this
  }

  set2f (name: string, x: number, y: number) {
    gl.uniform2f(gl.getUniformLocation(this.program, name), x, y)
    return this
  }

  set2fv (name: string, vec: Vec2) {
    gl.uniform2fv(gl.getUniformLocation(this.program, name), vec)
    return this
  }

  set3f (name: string, x: number, y: number, z: number) {
    gl.uniform3f(gl.getUniformLocation(this.program, name), x, y, z)
    return this
  }

  set3fv (name: string, xyz: Vec3) {
    gl.uniform3fv(gl.getUniformLocation(this.program, name), xyz)
    return this
  }

  set4f (name: string, x: number, y: number, z: number, w: number) {
    gl.uniform4f(gl.getUniformLocation(this.program, name), x, y, z, w)
    return this
  }

  set4fv (name: string, xyzw: Float32Array) {
    gl.uniform4fv(gl.getUniformLocation(this.program, name), xyzw)
    return this
  }

  set4x4f (name: string, mat: Mat4) {
    gl.uniformMatrix4fv(gl.getUniformLocation(this.program, name), false, mat)
    return this
  }
}
