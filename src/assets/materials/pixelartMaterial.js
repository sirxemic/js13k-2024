import { Material } from '../../engine/graphics/Material.js'

export let pixelartMaterial = new Material(`/*glsl*/
in vec2 varyingUv;
uniform float uniformPxPerTx;
uniform vec2 uniformTextureSize;
vec4 shader() {
  vec2 tx = varyingUv * uniformTextureSize;
  vec2 txOffset = clamp(fract(tx) * uniformPxPerTx, 0.0, 0.5) - clamp((1.0 - fract(tx)) * uniformPxPerTx, 0.0, 0.5);
  vec2 uv = (floor(tx) + 0.5 + txOffset) / uniformTextureSize;
  float txx = (fract(tx.x) - 0.5) * 2.0;
  float tyy = (fract(tx.y) - 0.5) * 2.0;
  float thing = pow(tyy, 4.0);
  return texture(uniformTextures[0], uv) - thing;
}
`, `/*glsl*/
out vec2 varyingUv;
void main() {
  varyingUv = attributePosition.xy * 0.5 + 0.5;
  gl_Position = vec4(attributePosition, 1.0);
}
`)
