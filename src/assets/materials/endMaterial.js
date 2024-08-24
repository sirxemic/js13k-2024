import { Material } from '../../engine/graphics/Material.js'

export let endMaterial = new Material(`/*glsl*/
in vec2 varyingUv;
vec4 shader() {
  float alpha = smoothstep(1.0, 0.95, length(varyingUv));
  float color1 = smoothstep(0.7, 0.8, length(varyingUv));
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
