import { canvas, deltaTime, gl } from '../engine.js'
import {
  advectionMaterial,
  clearMaterial, displayMaterial,
  divergenceMaterial,
  gradientSubtractMaterial,
  pressureMaterial, splatMaterial
} from './fluidSim/shaders.js'
import { divergence, dye, pressure, velocity } from './fluidSim/rts.js'
import { supportLinearFiltering } from './fluidSim/common.js'
import { quad } from '../assets/geometries/quad.js'

export function updateSim() {
  const simTexelSize = new Float32Array([
    1 / velocity.width,
    1 / velocity.height
  ])
  const renderTexelSize = new Float32Array([
    1 / dye.width,
    1 / dye.height
  ])
  gl.disable(gl.BLEND)

  divergenceMaterial.shader.bind()
    .set2fv('uniformTexelSize', simTexelSize)
    .set1i('uniformVelocity', velocity.read.bind())
  divergence.blit()

  clearMaterial.shader.bind()
    .set1i('uniformTexture', pressure.read.bind())
    .set1f('uniformValue', 0.8)
  pressure.blit()

  pressureMaterial.shader.bind()
    .set2fv('uniformTexelSize', simTexelSize)
    .set1i('uniformDivergence', divergence.bind())

  for (let i = 0; i < 15; i++) {
    pressureMaterial.shader.set1i('uniformPressure', pressure.read.bind(1))
    pressure.blit()
  }

  gradientSubtractMaterial.shader.bind()
    .set2fv('uniformTexelSize', simTexelSize)
    .set1i('uniformPressure', pressure.read.bind(0))
    .set1i('uniformVelocity', velocity.read.bind(1))
  velocity.blit()

  advectionMaterial.shader.bind()
    .set2fv('uniformTexelSize', simTexelSize)
    .set1i('uniformVelocity', velocity.read.bind(0))
    .set1i('uniformSource', 0)
    .set1f('uniformDt', deltaTime)
    .set1f('uniformDissipation', 0.2)
  if (!supportLinearFiltering)
    advectionMaterial.shader.set2fv('uniformDyeTexelSize', simTexelSize)
  velocity.blit()

  if (!supportLinearFiltering)
    advectionMaterial.shader.set2fv('uniformDyeTexelSize', renderTexelSize)
  advectionMaterial.shader
    .set1i('uniformVelocity', velocity.read.bind(0))
    .set1i('uniformSource', dye.read.bind(1))
    .set1f('uniformDissipation', 1)
  dye.blit()

  gl.enable(gl.BLEND)
}

export function splat(point, delta) {
  splatMaterial.shader.bind()
    .set1i('uniformTarget', velocity.read.bind(0))
    .set1f('uniformAspectRatio', canvas.width / canvas.height)
    .set2fv('uniformPoint', point)
    .set3fv('uniformColor', delta)
    .set1f('uniformRadius', 0.2)
  velocity.blit()
  splatMaterial.shader.set1i('uniformTarget', dye.read.bind(0))
    .set3fv('uniformColor', new Float32Array([1, 1, 1]))
  dye.blit()
}

export function renderFluid() {
  const renderTexelSize = new Float32Array([
    1 / dye.width,
    1 / dye.height
  ])
  displayMaterial.shader.bind()
    .set2fv('uniformTexelSize', renderTexelSize)
    .set1i('uniformTexture', dye.read.bind())
  quad.draw()
}
