import { fadeMaterial } from '../assets/materials/fadeMaterial'
import { quad } from '../assets/geometries/quad'
import { deltaTime } from '../engine'

export function fadeIn() {
  let fadeAlpha = 1
  return {
    update() {
      fadeAlpha -= deltaTime
    },
    render() {
      fadeMaterial.shader
        .bind()
        .set1f('uniformAlpha', fadeAlpha)
      quad.draw()
    }
  }
}
