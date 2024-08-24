import { VertexBuffer } from '../engine/graphics/VertexBuffer.js'
import { deltaTime, gl, pointerPosition, VIEW_HEIGHT, VIEW_MARGIN_X, VIEW_MARGIN_Y, VIEW_WIDTH } from '../engine.js'
import { addScaled, distance, subtract, vec3, vec3Normalize } from '../math/vec3.js'
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

const TOP_HALF_COLOR = vec3([1, 0, 0])
const BOTTOM_HALF_COLOR = vec3([0.1, 0.2, 1])
const TOP_HALF_TEXT_COLOR = vec3([0, 0, 0])
const BOTTOM_HALF_TEXT_COLOR = vec3([1, 1, 1])

const STATE_PLAYING = 0
const STATE_FINISH_ANIMATION = 1

const handleSize = 16

const strand = new VertexBuffer(gl.LINE_STRIP)
strand.vertexLayout([3])
strand.vertexData(new Float32Array(3 * 10 * 1024))

const endStrand = new VertexBuffer(gl.LINE_STRIP)
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
  let dragging = false
  let state = STATE_PLAYING
  let time = 0

  let halfs

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
            halfs = getHalfs()
            return
          }
        }
      }
      else {
        if (pointerPosition && distance(pointerPosition, handlePosition) < handleSize) {
          dragging = true

          const index = elements.findIndex(element => element.texture === titleTexture)
          if (index !== -1) {
            elements.splice(index, 1)
          }
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
          if (strandPositions.some(point2 => {
            return point2 !== lastPoint && distance(point, point2) <= handleSize
          })) {
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
        console.log('...')
        half.vertexBuffer.draw()
      })
    }

    strandMaterial.shader.bind()
    strandMaterial.updateCameraUniforms()
    strandMaterial.setModel(mat4())
    strandMaterial.shader.set1f('uniformNegRadius', time * time)
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
        ...pixelAligned(endPosition), 1
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
        ...pixelAligned(element.position), 1
      ]))
      quad.draw()
    }

    handleMaterial.shader.bind()
    handleMaterial.updateCameraUniforms()
    handleMaterial.setModel(mat4([
      handleSize, 0, 0, 0,
      0, handleSize, 0, 0,
      0, 0, 1, 0,
      ...pixelAligned(handlePosition), 1
    ]))
    quad.draw()
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

function pixelAligned(vec) {
  return vec.map(Math.floor)
}
