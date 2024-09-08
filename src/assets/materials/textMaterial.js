import { Material } from '../../engine/graphics/Material.js'

export let textMaterial = new Material(`/*glsl*/
in vec2 varyingUv;
uniform float uniformNegRadius;
uniform vec3 uniformColor1;
uniform vec3 uniformColor2;
uniform float uniformAlpha;
uniform float uniformColorMerge;
vec4 shader() {
  vec3 color = uniformNegRadius * 2.0 > length(varyingPosition.xy) ? uniformColor2 : uniformColor1;
  color = mix(uniformColor1, color, uniformColorMerge);
  float alpha = texture(uniformTextures[0], varyingUv).a * uniformAlpha;
  return vec4(color, alpha);
}
`, `/*glsl*/
out vec2 varyingUv;
out vec2 varyingScreenPos;
uniform float uniformAspectRatio;

void main() {
  varyingUv = attributePosition.xy * 0.5 + 0.5;
  gl_Position = uniformProjection * uniformModel * vec4(attributePosition, 1.0);
  varyingPosition = gl_Position.xyz;
  varyingPosition.x *= uniformAspectRatio;
}
`)
