import { Material } from '../../engine/graphics/Material.js'

export let pixelartMaterial = new Material(`/*glsl*/
in vec2 varyingUv;
vec4 shader() {
  return texture(uniformTextures[0], varyingUv);
}
`, `/*glsl*/
out vec2 varyingUv;
void main() {
  varyingUv = attributePosition.xy * 0.5 + 0.5;
  varyingUv.y = 1.0 - varyingUv.y;
  varyingPosition = vec3(uniformModel * vec4(attributePosition, 1.0));
  gl_Position = vec4(attributePosition, 0.0, 1.0);
}
`)
