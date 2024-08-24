import { Material } from '../../engine/graphics/Material.js'

export let halfMaterial = new Material(`/*glsl*/
in vec2 varyingUv;
uniform vec3 uniformColor;
uniform float uniformNegRadius;
vec4 shader() {
  float factor = uniformNegRadius > length(varyingPosition.xy) ? 1.0 : 0.0;
  return vec4(factor * uniformColor, 1.0);
}
`, `/*glsl*/
out vec2 varyingUv;
void main() {
  gl_Position = uniformProjection * uniformView * vec4(attributePosition, 1.0);
  varyingPosition = gl_Position.xyz;
}
`)
