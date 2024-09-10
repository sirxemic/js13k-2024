import { textMaterial } from '../assets/materials/textMaterial.js'
import { vec3 } from '../math/vec3.js'
import { endTexture } from '../assets/textures/textTextures.js'
import { mat4 } from '../math/mat4.js'
import { deltaTime, useMaterial, VIEW_HEIGHT, VIEW_WIDTH } from '../engine.js'
import { quad } from '../assets/geometries/quad.js'
import { fadeIn } from './fade.js'
import { shapeMaterial } from '../assets/materials/shapeMaterial.js'
import { star } from '../assets/geometries/star.js'
import { smoothstep } from '../math/math.js'

export function finalScreen() {
  const fade = fadeIn()
  let time = 0
  return {
    update() {
      time += deltaTime
      fade.update()
    },
    render() {
      const scale = VIEW_WIDTH / 2 * smoothstep(0, 1, smoothstep(0, 1.5, time))
      useMaterial(textMaterial)
        .set1f('uniformNegRadius', 0)
        .set3fv('uniformColor1', vec3([1,1,1]))
        .set3fv('uniformColor2', vec3([0,0,0]))
        .set1f('uniformAlpha', 1)
        .setModel(mat4([
          scale, 0, 0, 0,
          0, scale, 0, 0,
          0, 0, 1, 0,
          VIEW_WIDTH / 2, VIEW_HEIGHT / 2, 0, 1
        ]))
      endTexture.bind()
      quad.draw()

      useMaterial(shapeMaterial)
        .set1f('uniformBrightness', 1)

      const radius = smoothstep(0, 1, smoothstep(0.4, 1.5, time)) * 250
      const size = smoothstep(0.7, 1.2, time) * 20

      for (let i = 0; i < 13; i++) {
        const x = VIEW_WIDTH / 2 + Math.sin(Math.PI * 2 * i / 13 + 0.1 * time) * radius
        const y = VIEW_HEIGHT / 2 + Math.cos(Math.PI * 2 * i / 13 + 0.1 * time) * radius
        shapeMaterial.shader.setModel(mat4([
          size, 0, 0, 0,
          0, size, 0, 0,
          0, 0, 1, 0,
          x, y, 0, 1
        ]))

        star.draw()
      }


      fade.render()
    }
  }
}
