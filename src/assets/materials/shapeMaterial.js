import { Material } from '../../engine/graphics/Material.js'

export let shapeMaterial = new Material(`/*glsl*/
vec4 shader() {
  return vec4(1.0);
}
`, `/*glsl*/
void main() {
  gl_Position = uniformProjection * uniformView * uniformModel * vec4(attributePosition, 1.0);
}
`)
