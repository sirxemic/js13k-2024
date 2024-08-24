import { VertexBuffer } from '../engine/graphics/VertexBuffer.js'
import { deltaTime, gl, pointerPosition, VIEW_HEIGHT, VIEW_WIDTH } from '../engine.js'
import { addScaled, distance, subtract, vec3, vec3Normalize } from '../math/vec3.js'
import { clamp } from '../math/math.js'
import { strandMaterial } from '../assets/materials/strandMaterial.js'
import { mat4 } from '../math/mat4.js'
import { handleMaterial } from '../assets/materials/handleMaterial.js'
import { quad } from '../assets/geometries/quad.js'
import { endMaterial } from '../assets/materials/endMaterial.js'

const STATE_PLAYING = 0
const STATE_FINISH_ANIMATION = 1

const handleSize = 10

const strand = new VertexBuffer(gl.LINE_STRIP)
strand.vertexLayout([3])
strand.vertexData(new Float32Array(3 * 10 * 1024))

const endStrand = new VertexBuffer(gl.LINE_STRIP)
endStrand.vertexLayout([3])
endStrand.vertexData(new Float32Array(3 * 2))

export function getLevel({
  startPosition,
  endPosition
}) {
  const handlePosition = vec3(startPosition)
  const handleTarget = vec3(handlePosition)

  strand.updateVertexData(
    new Float32Array([
      -1000, VIEW_HEIGHT / 2, 0,
      ...startPosition
    ]),
    0
  )

  endStrand.updateVertexData(
    new Float32Array([
      ...endPosition,
      endPosition[0] + 500,
      endPosition[1],
      endPosition[2]
    ])
  )

  const strandPositions = [
    vec3(startPosition)
  ]
  let dragging = false
  let state = STATE_PLAYING
  let time = 0

  function update() {
    if (state === STATE_PLAYING) {
      if (dragging) {
        if (!pointerPosition) {
          dragging = false
        }
        else {
          handleTarget.set(pointerPosition)
          if (distance(handleTarget, endPosition) > handleSize * 2) {
            handleTarget[0] = clamp(handleTarget[0], handleSize, VIEW_WIDTH - handleSize)
            handleTarget[1] = clamp(handleTarget[1], handleSize, VIEW_HEIGHT - handleSize)
          }
          else if (handleTarget[0] > VIEW_WIDTH) {
            state = STATE_FINISH_ANIMATION
            handleTarget.set(endPosition)
            strandPositions.push(endPosition)
            strand.updateVertexData(
              endPosition,
              strandPositions.length * 3 * 4
            )
            time = 0
            return
          }
        }
      }
      else {
        if (pointerPosition && distance(pointerPosition, handlePosition) < handleSize) {
          dragging = true
        }
      }
    }

    if (state === STATE_FINISH_ANIMATION) {
      handleTarget[0] = endPosition[0] + time * time * 100
      handleTarget[1] = endPosition[1]

      const factor = 1 - Math.exp(-deltaTime * 20)
      addScaled(handlePosition, handlePosition, subtract(vec3(), handleTarget, handlePosition), factor)

      time += deltaTime
    }
    else {
      handleCollisions()
      updateStrand()
    }
  }

  function handleCollisions() {
    const point1 = vec3(handlePosition)
    const point2 = vec3(handleTarget)
    if (distance(point1, point2) < 2) return
    const direction = vec3Normalize(subtract(vec3(), point2, point1))
    const dist = distance(point2, point1)
    let collisionIndexStart = 0
    for (let x = 0; x <= dist; x += handleSize / 2) {
      const point = addScaled(vec3(), point1, direction, x)
      for (let i = collisionIndexStart; i < strandPositions.length; i++) {
        const point2 = strandPositions[strandPositions.length - i - 1]
        if (distance(point2, point) < handleSize * 1.25) {
          if (i === collisionIndexStart || i === collisionIndexStart + 1) {
            collisionIndexStart++
          }
          else {
            return
          }
        }
      }
      handleTarget.set(point)
    }
  }

  function updateStrand() {
    const factor = 1 - Math.exp(-deltaTime * 20)
    addScaled(handlePosition, handlePosition, subtract(vec3(), handleTarget, handlePosition), factor)

    const previousPosition = strandPositions.at(-1)
    let distanceToPrev = distance(handlePosition, previousPosition)
    if (distanceToPrev > handleSize) {
      const vectorToPrev = vec3Normalize(subtract(vec3(), handlePosition, previousPosition))
      for (let x = handleSize; x < distanceToPrev; x += handleSize) {
        const point = addScaled(vec3(), previousPosition, vectorToPrev, x)

        if (strandPositions.at(-2) && distance(point, strandPositions.at(-2)) <= handleSize) {
          strandPositions.pop()
        }
        else {
          strandPositions.push(point)
          strand.updateVertexData(
            point,
            strandPositions.length * 3 * 4
          )
        }
      }
    }
  }

  function render() {
    strandMaterial.shader.bind()
    strandMaterial.updateCameraUniforms()
    strandMaterial.setModel(mat4())
    strand.vertexCount = strandPositions.length + 1
    strand.draw()
    endStrand.draw()

    if (state === STATE_PLAYING) {
      endMaterial.shader.bind()
      endMaterial.updateCameraUniforms()
      endMaterial.setModel(mat4([
        handleSize, 0, 0, 0,
        0, handleSize, 0, 0,
        0, 0, 1, 0,
        ...endPosition, 1
      ]))
      quad.draw()
    }

    handleMaterial.shader.bind()
    handleMaterial.updateCameraUniforms()
    handleMaterial.setModel(mat4([
      handleSize, 0, 0, 0,
      0, handleSize, 0, 0,
      0, 0, 1, 0,
      ...handlePosition, 1
    ]))
    quad.draw()
  }

  return {
    update,
    render
  }
}
