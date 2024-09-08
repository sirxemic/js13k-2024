import { Material } from '../../engine/graphics/Material.js'

export let partitionMaterial = new Material(`/*glsl*/
in vec2 varyingUv;
uniform vec3 uniformColor;
uniform float uniformNegRadius;
uniform float uniformFade;
vec4 shader() {
  float f = uniformNegRadius * 2.0 > length(varyingPosition.xy) ? 1.0 : 0.0;
  return vec4(f * uniformColor * uniformFade, 1.0);
}
`, `/*glsl*/
uniform float uniformAspectRatio;

out vec2 varyingUv;
void main() {
  gl_Position = uniformProjection * vec4(attributePosition, 1.0);
  varyingPosition = gl_Position.xyz;
  varyingPosition.x *= uniformAspectRatio;
}
`)
