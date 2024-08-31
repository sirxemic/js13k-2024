import { Material } from '../../engine/graphics/Material.js'

export let textMaterial = new Material(`/*glsl*/
in vec2 varyingUv;
in vec2 varyingScreenPos;
uniform float uniformNegRadius;
uniform vec3 uniformColor1;
uniform vec3 uniformColor2;
vec4 shader() {
  vec3 color = uniformNegRadius * 2.0 > length(varyingScreenPos) ? uniformColor2 : uniformColor1;
  float alpha = texture(uniformTextures[0], varyingUv).a;
  return vec4(color, alpha);
}
`, `/*glsl*/
out vec2 varyingUv;
out vec2 varyingScreenPos;
void main() {
  varyingUv = attributePosition.xy * 0.5 + 0.5;
  varyingPosition = vec3(uniformModel * vec4(attributePosition, 1.0));
  gl_Position = uniformProjection * uniformView * vec4(varyingPosition, 1.0);
  varyingScreenPos = gl_Position.xy;
}
`)
