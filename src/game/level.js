import { VertexBuffer } from '../engine/graphics/VertexBuffer.js'
import {
  deltaTime,
  gl,
  lastPointerPosition,
  pointerPosition,
  VIEW_HEIGHT,
  VIEW_MARGIN_X,
  VIEW_MARGIN_Y,
  VIEW_WIDTH
} from '../engine.js'
import { add, addScaled, distance, subtract, vec3, vec3Normalize } from '../math/vec3.js'
import { clamp } from '../math/math.js'
import { strandMaterial } from '../assets/materials/strandMaterial.js'
import { mat4 } from '../math/mat4.js'
import { handleMaterial } from '../assets/materials/handleMaterial.js'
import { quad } from '../assets/geometries/quad.js'
import { endMaterial } from '../assets/materials/endMaterial.js'
import { textMaterial } from '../assets/materials/textMaterial.js'
import { titleTexture } from '../assets/textures/textTextures.js'
import { halfMaterial } from '../assets/materials/halfMaterial.js'
import { IndexBuffer } from '../engine/graphics/IndexBuffer.js'
import { triangulate } from './triangulate.js'
import { getPolygonIntersections } from './getPolygonIntersections.js'
import { handleDrag, handleFinish, renderStartArrow } from './startArrow.js'
import { debugMaterial } from '../assets/materials/debugMaterial.js'

const TOP_HALF_COLOR = vec3([1, 0.2, 0.2])
const BOTTOM_HALF_COLOR = vec3([0, 0, 1])
const TOP_HALF_TEXT_COLOR = BOTTOM_HALF_COLOR
const BOTTOM_HALF_TEXT_COLOR = TOP_HALF_COLOR

const STATE_PLAYING = 0
const STATE_FINISH_ANIMATION = 1

const handleSize = 16

const strand = new VertexBuffer()
strand.vertexLayout([3])
strand.vertexData(new Float32Array(3 * 10 * 1024))

const endStrand = new VertexBuffer()
endStrand.vertexLayout([3])
endStrand.vertexData(new Float32Array(3 * 2))

export function getLevel({
  startPosition,
  endPosition,
  elements
}) {
  const handlePosition = vec3(startPosition)
  const handleTarget = vec3(handlePosition)

  strand.updateVertexData(
    new Float32Array([
      -1000, startPosition[1], 0,
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
  let dragStart
  let handleAtDragStart
  let state = STATE_PLAYING
  let time = 0

  let halfs

  function checkUndo() {
    for (let i = 1; i < strandPositions.length - 1; i++) {
      if (distance(strandPositions[i], lastPointerPosition) < handleSize) {
        strandPositions.length = i + 1
        handlePosition.set(strandPositions.at(-1))
        handleTarget.set(strandPositions.at(-1))
      }
    }
  }

  function update() {
    if (state === STATE_PLAYING) {
      if (dragStart) {
        if (!pointerPosition) {
          if (distance(dragStart, lastPointerPosition) < 2) {
            checkUndo()
          }
          dragStart = undefined
        }
        else {
          add(handleTarget, subtract(vec3(), pointerPosition, dragStart), handleAtDragStart)
          if (distance(handleTarget, endPosition) > handleSize * 2) {
            handleTarget[0] = clamp(handleTarget[0], handleSize, VIEW_WIDTH - handleSize)
            handleTarget[1] = clamp(handleTarget[1], handleSize, VIEW_HEIGHT - handleSize)
          }
          else if (handleTarget[0] > VIEW_WIDTH) {
            handleFinish()
            state = STATE_FINISH_ANIMATION
            handleTarget.set(endPosition)
            strandPositions.push(endPosition)
            strand.updateVertexData(
              endPosition,
              strandPositions.length * 3 * 4
            )
            time = 0
            halfs = getHalfs()
            return
          }
        }
      }
      else if (pointerPosition) {
        dragStart = vec3(pointerPosition)
        handleAtDragStart = vec3(handleTarget)

        handleDrag()

        const index = elements.findIndex(element => element.texture === titleTexture)
        if (index !== -1) {
          elements.splice(index, 1)
        }
      }
    }

    if (state === STATE_FINISH_ANIMATION) {
      handleTarget[0] = endPosition[0] + (time + 1) * time * 100
      handleTarget[1] = endPosition[1]

      const factor = 1 - Math.exp(-deltaTime * 20)
      addScaled(handlePosition, handlePosition, subtract(vec3(), handleTarget, handlePosition), factor)

      time += deltaTime
    }
    else {
      updateStrand()
    }
  }

  function updateStrand() {
    handlePosition.set(handleTarget)

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
          const lastPoint = strandPositions.at(-1)
          if (
            elements.some(element => {
              return (
                Math.abs(point[0] - element.position[0]) < element.width
                && Math.abs(point[1] - element.position[1]) < element.height
              )
            })
            ||
            strandPositions.some(point2 => {
              return point2 !== lastPoint && distance(point, point2) <= handleSize
            })
          ) {
            handlePosition.set(lastPoint)
            handleTarget.set(lastPoint)
            return
          }
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
    if (halfs) {
      halfMaterial.shader.bind()
      halfMaterial.updateCameraUniforms()
      halfMaterial.shader.set1f('uniformNegRadius', time * time)
      halfs.forEach(half => {
        halfMaterial.shader.set3fv('uniformColor', half.color)
        half.vertexBuffer.draw()
      })
    }

    strandMaterial.shader.bind()
    strandMaterial.updateCameraUniforms()
    strandMaterial.setModel(mat4())
    strandMaterial.shader.set1f('uniformNegRadius', time * time)
    strand.vertexCount = strandPositions.length + 1
    strand.draw(gl.LINE_STRIP)
    endStrand.draw(gl.LINE_STRIP)

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

    textMaterial.shader.bind()
    textMaterial.updateCameraUniforms()
    textMaterial.shader.set1f('uniformNegRadius', time * time)
    textMaterial.shader.set3fv('uniformColor1', vec3([1,1,1]))
    for (const element of elements) {
      element.texture.bind()
      textMaterial.shader.set3fv('uniformColor2', element.color2 || vec3([0,0,0]))
      textMaterial.setModel(mat4([
        element.size, 0, 0, 0,
        0, element.size, 0, 0,
        0, 0, 1, 0,
        ...element.position, 1
      ]))
      quad.draw()
    }

    for (const element of elements) {
      debugMaterial.shader.bind()
      debugMaterial.updateCameraUniforms()
      debugMaterial.setModel(mat4([
        element.width, 0, 0, 0,
        0, element.height, 0, 0,
        0, 0, 1, 0,
        ...element.position, 1
      ]))
      quad.draw(gl.LINE_STRIP)
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

    renderStartArrow()
  }

  function getHalfColor(position) {
    const intersectionCount = getPolygonIntersections(position, vec3([0, -1, 0]), strandPositions)
    return intersectionCount % 2 === 0 ? TOP_HALF_TEXT_COLOR : BOTTOM_HALF_TEXT_COLOR
  }

  function getHalfs() {
    function getHalf(perimeterVertices, reverse) {
      const half = new VertexBuffer()
      const points = [
        ...strandPositions,
        vec3([
          endPosition[0] + 500,
          endPosition[1],
          endPosition[2]
        ]),
        ...perimeterVertices
      ]
      if (reverse) {
        points.reverse()
      }
      half.vertexLayout([3])
      const vertexData = new Float32Array(points.flatMap(x => [...x]))
      half.vertexData(vertexData)

      const indexBuffer1 = new IndexBuffer()
      const indices1 = triangulate(points)
      indexBuffer1.setData(new Uint16Array(indices1))

      half.setIndexBuffer(indexBuffer1)
      return half
    }

    for (const element of elements) {
      element.color2 = getHalfColor(element.position)
    }

    return [
      {
        vertexBuffer: getHalf([
          vec3([
            VIEW_WIDTH + VIEW_MARGIN_X,
            -VIEW_MARGIN_Y,
            0
          ]),
          vec3([
            -VIEW_MARGIN_X,
            -VIEW_MARGIN_Y,
            0
          ]),
          vec3([-VIEW_MARGIN_X, startPosition[1], 0])
        ]),
        color: TOP_HALF_COLOR
      },
      {
        vertexBuffer: getHalf([
          vec3([
            VIEW_WIDTH + VIEW_MARGIN_X,
            VIEW_HEIGHT + VIEW_MARGIN_Y,
            0
          ]),
          vec3([
            -VIEW_MARGIN_X,
            VIEW_HEIGHT + VIEW_MARGIN_Y,
            0
          ]),
          vec3([-VIEW_MARGIN_X, startPosition[1], 0])
        ], true),
        color: BOTTOM_HALF_COLOR
      }
    ]
  }

  return {
    update,
    render
  }
}
