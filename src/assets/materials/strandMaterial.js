import { Material } from '../../engine/graphics/Material.js'

export let strandMaterial = new Material(`/*glsl*/
in vec2 varyingScreenPos;
uniform float uniformNegRadius;
vec4 shader() {
  float factor = uniformNegRadius * 2.0 > length(varyingScreenPos) ? 0.0 : 1.0;
  return vec4(factor);
}
`, `/*glsl*/
out vec2 varyingScreenPos;
void main() {
  gl_Position = uniformProjection * vec4(attributePosition, 1.0);
  varyingScreenPos = gl_Position.xy;
}
`)
