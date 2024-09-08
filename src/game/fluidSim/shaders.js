import { Material } from '../../engine/graphics/Material.js'
import { supportLinearFiltering } from './common.js'

const vertexShader = `/*glsl*/
out vec2 varyingUv;
out vec2 varyingL;
out vec2 varyingR;
out vec2 varyingT;
out vec2 varyingB;
uniform vec2 uniformTexelSize;

void main() {
  varyingUv = attributePosition.xy * 0.5 + 0.5;
  varyingL = varyingUv - vec2(uniformTexelSize.x, 0.0);
  varyingR = varyingUv + vec2(uniformTexelSize.x, 0.0);
  varyingT = varyingUv + vec2(0.0, uniformTexelSize.y);
  varyingB = varyingUv - vec2(0.0, uniformTexelSize.y);
  gl_Position = vec4(attributePosition, 1.0);
}
`

let advectionShader = `/*glsl*/
in vec2 varyingUv;
uniform sampler2D uniformVelocity;
uniform sampler2D uniformSource;
uniform vec2 uniformTexelSize;
uniform vec2 uniformDyeTexelSize;
uniform float uniformDt;
uniform float uniformDissipation;

vec4 bilerp(sampler2D sam, vec2 uv, vec2 tsize) {
  vec2 st = uv / tsize - 0.5;

  vec2 iuv = floor(st);
  vec2 fuv = fract(st);

  vec4 a = texture(sam, (iuv + vec2(0.5, 0.5)) * tsize);
  vec4 b = texture(sam, (iuv + vec2(1.5, 0.5)) * tsize);
  vec4 c = texture(sam, (iuv + vec2(0.5, 1.5)) * tsize);
  vec4 d = texture(sam, (iuv + vec2(1.5, 1.5)) * tsize);

  return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
}

vec4 shader() {
#ifdef MANUAL_FILTERING
  vec2 coord = varyingUv - uniformDt * bilerp(uniformVelocity, varyingUv, uniformTexelSize).xy * uniformTexelSize;
  vec4 result = bilerp(uniformSource, uniformSource, uniformDyeTexelSize);
#else
  vec2 coord = varyingUv - uniformDt * texture(uniformVelocity, varyingUv).xy * uniformTexelSize;
  vec4 result = texture(uniformSource, coord);
#endif
  float decay = 1.0 + uniformDissipation * uniformDt;
  return result / decay;
}
`

advectionShader = (supportLinearFiltering ? '' : `#define MANUAL_FILTERING\n`) + advectionShader

export const advectionMaterial = new Material(
  advectionShader,
  vertexShader
)

const divergenceShader = `/*glsl*/
in vec2 varyingUv;
in vec2 varyingL;
in vec2 varyingR;
in vec2 varyingT;
in vec2 varyingB;
uniform sampler2D uniformVelocity;

vec4 shader() {
  float L = texture(uniformVelocity, varyingL).x;
  float R = texture(uniformVelocity, varyingR).x;
  float T = texture(uniformVelocity, varyingT).y;
  float B = texture(uniformVelocity, varyingB).y;

  vec2 C = texture(uniformVelocity, varyingUv).xy;
  if (varyingL.x < 0.0) { L = -C.x; }
  if (varyingR.x > 1.0) { R = -C.x; }
  if (varyingT.y > 1.0) { T = -C.y; }
  if (varyingB.y < 0.0) { B = -C.y; }

  float div = 0.5 * (R - L + T - B);
  return vec4(div, 0.0, 0.0, 1.0);
}
`

export const divergenceMaterial = new Material(
  divergenceShader,
  vertexShader
)

const clearShader = `/*glsl*/
in vec2 varyingUv;
uniform sampler2D uniformTexture;
uniform float uniformValue;

vec4 shader() {
  return uniformValue * texture(uniformTexture, varyingUv);
}
`

export const clearMaterial = new Material(
  clearShader,
  vertexShader
)

const pressureShader = `/*glsl*/
in vec2 varyingUv;
in vec2 varyingL;
in vec2 varyingR;
in vec2 varyingT;
in vec2 varyingB;
uniform sampler2D uniformPressure;
uniform sampler2D uniformDivergence;

vec4 shader() {
  float L = texture(uniformPressure, varyingL).x;
  float R = texture(uniformPressure, varyingR).x;
  float T = texture(uniformPressure, varyingT).x;
  float B = texture(uniformPressure, varyingB).x;
  float C = texture(uniformPressure, varyingUv).x;
  float divergence = texture(uniformDivergence, varyingUv).x;
  float pressure = (L + R + B + T - divergence) * 0.25;
  return vec4(pressure, 0.0, 0.0, 1.0);
}
`

export const pressureMaterial = new Material(
  pressureShader,
  vertexShader
)

const gradientSubtractShader = `/*glsl*/
in vec2 varyingUv;
in vec2 varyingL;
in vec2 varyingR;
in vec2 varyingT;
in vec2 varyingB;
uniform sampler2D uniformPressure;
uniform sampler2D uniformVelocity;

vec4 shader() {
  float L = texture(uniformPressure, varyingL).x;
  float R = texture(uniformPressure, varyingR).x;
  float T = texture(uniformPressure, varyingT).x;
  float B = texture(uniformPressure, varyingB).x;
  vec2 velocity = texture(uniformVelocity, varyingUv).xy;
  velocity.xy -= vec2(R - L, T - B);
  return vec4(velocity, 0.0, 1.0);
}
`

export const gradientSubtractMaterial = new Material(
  gradientSubtractShader,
  vertexShader
)

const splatShader = `/*glsl*/
in vec2 varyingUv;
uniform sampler2D uniformTarget;
uniform float uniformAspectRatio;
uniform vec3 uniformColor;
uniform vec3 uniformPoint;
uniform float uniformRadius;

vec4 shader() {
  vec2 p = varyingUv - uniformPoint.xy;
  p.x *= uniformAspectRatio;
  vec3 splat = exp(-dot(p, p) / uniformRadius) * uniformColor;
  vec3 base = texture(uniformTarget, varyingUv).xyz;
  return vec4(base + splat, 1.0);
}
`

export const splatMaterial = new Material(
  splatShader,
  vertexShader
)

const displayShader = `/*glsl*/
in vec2 varyingUv;
in vec2 varyingL;
in vec2 varyingR;
in vec2 varyingT;
in vec2 varyingB;
uniform sampler2D uniformTexture;
uniform vec2 uniformTexelSize;

vec4 shader() {
    vec3 c = texture(uniformTexture, varyingUv).rgb;

    vec3 lc = texture(uniformTexture, varyingL).rgb;
    vec3 rc = texture(uniformTexture, varyingR).rgb;
    vec3 tc = texture(uniformTexture, varyingT).rgb;
    vec3 bc = texture(uniformTexture, varyingB).rgb;

    float dx = length(rc) - length(lc);
    float dy = length(tc) - length(bc);

    vec3 n = normalize(vec3(dx, dy, length(uniformTexelSize)));
    vec3 l = vec3(0.0, 0.0, 1.0);

    float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
    c *= diffuse;

    return vec4(c, 1.0);
}
`

export const displayMaterial = new Material(
  displayShader,
  vertexShader
)
