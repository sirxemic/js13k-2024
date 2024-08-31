import { textMaterial } from '../assets/materials/textMaterial.js'
import { vec3 } from '../math/vec3.js'
import { endTexture } from '../assets/textures/textTextures.js'
import { mat4 } from '../math/mat4.js'
import { VIEW_HEIGHT, VIEW_WIDTH } from '../engine.js'
import { quad } from '../assets/geometries/quad.js'
import { fadeIn } from './fade.js'

export function finalScreen() {
  const fade = fadeIn()
  return {
    update() {
      fade.update()
    },
    render() {
      textMaterial.shader.bind()
      textMaterial.updateCameraUniforms()
      textMaterial.shader.set1f('uniformNegRadius', 0)
      textMaterial.shader.set3fv('uniformColor1', vec3([1,1,1]))
      endTexture.bind()
      textMaterial.setModel(mat4([
        VIEW_WIDTH / 2, 0, 0, 0,
        0, VIEW_WIDTH / 2, 0, 0,
        0, 0, 1, 0,
        VIEW_WIDTH / 2, VIEW_HEIGHT / 2, 0, 1
      ]))
      quad.draw()

      fade.render()
    }
  }
}
