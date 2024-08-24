import { Material } from '../../engine/graphics/Material.js'

export let handleMaterial = new Material(`/*glsl*/
in vec2 varyingUv;
vec4 shader() {
  float alpha = smoothstep(1.02, 1.0, length(varyingUv));
  float color1 = 0.7 + 0.3 * smoothstep(0.7, 0.8, length(varyingUv));
  color1 = mix(color1, 1.0, 0.5 + varyingUv.x + varyingUv.y);
  return vec4(vec3(color1), alpha);
}
`, `/*glsl*/
out vec2 varyingUv;
void main() {
  varyingUv = attributePosition.xy;
  varyingPosition = vec3(uniformModel * vec4(attributePosition, 1.0));
  gl_Position = uniformProjection * uniformView * vec4(varyingPosition, 1.0);
}
`)
