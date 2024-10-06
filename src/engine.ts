import { type Vec3, vec3 } from './math/vec3'
import { Stats } from './stats.js'
import { mat4, setOrthographicProjection } from './math/mat4'
import type { Material } from './engine/graphics/Material'

// Constants
export const VIEW_WIDTH = 480
export const VIEW_HEIGHT = 360
export const VIEW_RATIO = VIEW_WIDTH / VIEW_HEIGHT
export let VIEW_MARGIN_X = 0
export let VIEW_MARGIN_Y = 0
export const VIEW_MIDDLE = vec3([VIEW_WIDTH / 2, VIEW_HEIGHT / 2, 0])

// Loop
export let deltaTime: number

let customOnResize: () => void

// <dev-only>
const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)
// </dev-only>

export function startGame(update: () => void, render: () => void, onResize: () => void) {
  let previousT: number
  customOnResize = onResize

  function tick(t: DOMHighResTimeStamp) {
    // <dev-only>
    stats.begin()
    // </dev-only>

    if (!previousT) {
      previousT = t
      window.requestAnimationFrame(tick)
      return
    }

    deltaTime = Math.min(0.1, (t - previousT) / 1000)

    update()
    render()

    lastPointerPosition = pointerPosition

    previousT = t
    window.requestAnimationFrame(tick)

    // <dev-only>
    stats.end()
    // </dev-only>
  }

  window.requestAnimationFrame(tick)
}

// Graphics
export let projectionMatrix = mat4()

export const canvas = document.querySelector('canvas')!
export const gl = canvas.getContext('webgl2', {
  antialias: true
})!

function onResize() {
  canvas.width = window.innerWidth * window.devicePixelRatio
  canvas.height = window.innerHeight * window.devicePixelRatio

  VIEW_MARGIN_X = 0
  VIEW_MARGIN_Y = 0
  if (canvas.width / canvas.height > VIEW_RATIO) {
    VIEW_MARGIN_X = Math.round((VIEW_HEIGHT * canvas.width / canvas.height - VIEW_WIDTH) / 2)
  }
  else {
    VIEW_MARGIN_Y = Math.round((VIEW_WIDTH * canvas.height / canvas.width - VIEW_HEIGHT) / 2)
  }

  setOrthographicProjection(
    projectionMatrix,
    VIEW_HEIGHT + VIEW_MARGIN_Y,
    -VIEW_MARGIN_Y,
    -VIEW_MARGIN_X,
    VIEW_WIDTH + VIEW_MARGIN_X,
    0, 100
  )

  customOnResize?.()
}
window.onresize = onResize
onResize()

export function useMaterial(material: Material) {
  return material.shader
    .bind()
    .set4x4f('uniformProjection', projectionMatrix)
}

// Audio
export let audioContext = new window.AudioContext()
export let audioDestination = audioContext.createDynamicsCompressor()
export let contextSampleRate = audioContext.sampleRate

audioDestination.connect(audioContext.destination)

// Input
export let pointerPosition: Vec3 | undefined
export let lastPointerPosition: Vec3 | undefined

document.body.addEventListener('pointerdown', (e) => {
  pointerPosition = getPointerPosition(e)
})

document.body.addEventListener('pointermove', (e) => {
  if (!pointerPosition) return

  pointerPosition = getPointerPosition(e)
})

document.body.addEventListener('pointerup', () => {
  pointerPosition = undefined
})

function getPointerPosition(e: PointerEvent) {
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  if (screenWidth / screenHeight > VIEW_RATIO) {
    return vec3([
      (e.clientX - ((screenWidth - screenHeight * VIEW_RATIO) / 2)) * VIEW_HEIGHT / screenHeight,
      e.clientY * VIEW_HEIGHT / screenHeight,
      0
    ])
  }
  else {
    return vec3([
      e.clientX * VIEW_WIDTH / screenWidth,
      (e.clientY - ((screenHeight - screenWidth / VIEW_RATIO) / 2)) * VIEW_WIDTH / screenWidth,
      0
    ])
  }
}
