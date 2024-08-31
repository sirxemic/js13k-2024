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
import { clamp, smoothstep } from '../math/math.js'
import { strandMaterial } from '../assets/materials/strandMaterial.js'
import { mat4 } from '../math/mat4.js'
import { handleMaterial } from '../assets/materials/handleMaterial.js'
import { quad } from '../assets/geometries/quad.js'
import { endMaterial } from '../assets/materials/endMaterial.js'
import { textMaterial } from '../assets/materials/textMaterial.js'
import { titleTexture } from '../assets/textures/textTextures.js'
import { partitionMaterial } from '../assets/materials/partitionMaterial.js'
import { IndexBuffer } from '../engine/graphics/IndexBuffer.js'
import { triangulate } from './triangulate.js'
import { getPolygonIntersections } from './getPolygonIntersections.js'
import { startArrowHandleDrag, startArrowHandleFinish, startArrowRender } from './startArrow.js'
import { getEquations } from './getEquations.js'
import { nextLevel } from './currentLevel.js'

const PARTITION_COLORS = [
  vec3([1, 0.2, 0.2]),
  vec3([0.1, 0.1, 1]),
  vec3([0.5, 1, 0.5])
]

const STATE_PLAYING = 0
const STATE_FINISH_ANIMATION = 1
const STATE_MAKE_EQUATION = 2
const STATE_UNDO_FINISH = 3

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
  elements,
  showTutorial
}) {
  elements.forEach(element => {
    element.originalSize = element.size
    element.originalPosition = vec3(element.position)
  })

  let partitions

  const handlePosition = vec3(startPosition)
  const handleTarget = vec3(handlePosition)

  const strandPositions = [
    vec3(startPosition)
  ]

  // Controls

  let dragStart
  let handleAtDragStart
  let state = STATE_PLAYING
  let time = 0
  let eqTime = 0
  let undoUntil
  let hasEquations = false

  function startDrag() {
    dragStart = vec3(pointerPosition)
    handleAtDragStart = vec3(handleTarget)

    startArrowHandleDrag()

    const index = elements.findIndex(element => element.texture === titleTexture)
    if (index !== -1) {
      elements.splice(index, 1)
    }
  }

  function stopDrag() {
    if (distance(dragStart, lastPointerPosition) < 2) {
      checkUndo()
    }
    dragStart = undefined
  }

  function checkUndo() {
    for (let i = 1; i < strandPositions.length - 1; i++) {
      if (distance(strandPositions[i], lastPointerPosition) < handleSize) {
        strandPositions.length = i + 1
        handlePosition.set(strandPositions.at(-1))
        handleTarget.set(strandPositions.at(-1))
      }
    }
  }

  function setFinished() {
    startArrowHandleFinish()
    state = STATE_FINISH_ANIMATION
    handleTarget.set(endPosition)
    strandPositions.push(endPosition)
    strand.updateVertexData(
      endPosition,
      strandPositions.length * 3 * 4
    )
    time = 0
    createPartitions()
  }

  function playingUpdate() {
    if (dragStart) {
      if (!pointerPosition) {
        stopDrag()
      }
      else {
        add(handleTarget, subtract(vec3(), pointerPosition, dragStart), handleAtDragStart)
        if (distance(handleTarget, endPosition) > handleSize * 2) {
          handleTarget[0] = clamp(handleTarget[0], handleSize, VIEW_WIDTH - handleSize)
          handleTarget[1] = clamp(handleTarget[1], handleSize, VIEW_HEIGHT - handleSize)
        }
        else if (handleTarget[0] > VIEW_WIDTH) {
          setFinished()
          return
        }
      }
    }
    else if (pointerPosition) {
      startDrag()
    }

    handlePosition.set(handleTarget)
    updateStrand()
  }

  function finishUpdate() {
    if (time === 0) {
      undoUntil = strandPositions.at(-2)
    }
    handleTarget[0] = endPosition[0] + (time + 1) * time * 100
    handleTarget[1] = endPosition[1]

    const factor = 1 - Math.exp(-deltaTime * 20)
    addScaled(handlePosition, handlePosition, subtract(vec3(), handleTarget, handlePosition), factor)

    updateStrand()

    time += deltaTime

    if (time > 1) {
      eqTime = 0
      state = STATE_MAKE_EQUATION
    }
  }

  function makeEquationUpdate() {
    const CHAR_WIDTH = 70
    const CHAR_HEIGHT = 80
    if (eqTime === 0) {
      let partitionElements = partitions.map(() => [])
      for (const element of elements) {
        partitionElements[element.partition].push(element)
        element.targetSize = 0
        element.targetPosition = element.position
      }
      const equations = getEquations(partitionElements)
      hasEquations = equations.length > 0

      if (hasEquations) {
        for (let i = 0; i < equations.length; i++) {
          for (let j = 0; j < equations[i].length; j++) {
            equations[i][j].targetSize = 40
            equations[i][j].targetPosition = vec3([
              VIEW_WIDTH / 2 + (-(equations[i].length - 1) / 2 + j) * CHAR_WIDTH,
              VIEW_HEIGHT / 2 + (-(equations.length - 1) / 2 + i) * CHAR_HEIGHT,
              0
            ])
          }
        }
      }
    }
    else {
      const t = smoothstep(0, 1, eqTime)
      for (const element of elements) {
        addScaled(element.position, element.originalPosition, subtract(vec3(), element.targetPosition, element.originalPosition), t)
        if (element.targetSize !== 0) {
          addScaled(element.position, element.position, vec3([Math.random() * 4 - 2, 0, 0]), 1 - t)
        }
        element.size = element.originalSize + (element.targetSize - element.originalSize) * t
      }

      if (eqTime > 1.2) {
        if (hasEquations) {
          backToPlayingUpdateTime = 0
          state = STATE_UNDO_FINISH
        }
        else {
          nextLevel()
        }
        return
      }
    }

    eqTime += deltaTime * 2
  }

  let backToPlayingUpdateTime = 0
  function backToPlayingUpdate() {
    backToPlayingUpdateTime += deltaTime

    const t = smoothstep(0, 1, backToPlayingUpdateTime)
    for (const element of elements) {
      addScaled(element.position, element.targetPosition, subtract(vec3(), element.originalPosition, element.targetPosition), t)
      element.size = element.targetSize + (element.originalSize - element.targetSize) * t
    }

    if (backToPlayingUpdateTime < 1) {
      const offScreen = vec3([endPosition[0] + 500, endPosition[1], endPosition[2]])
      if (t < 0.5) {
        addScaled(handlePosition, offScreen, subtract(vec3(), endPosition, offScreen), t * 2)
        addScaled(handleTarget, offScreen, subtract(vec3(), endPosition, offScreen), t * 2)
      }
      else {
        const t2 = (t - 0.5) * 2
        addScaled(handleTarget, endPosition, subtract(vec3(), undoUntil, endPosition), t2)
        handlePosition.set(handleTarget)
      }
      updateStrand()
    }
    else {
      time = 0
      eqTime = 0
      elements.forEach(element => {
        delete element.color
      })
      partitions = undefined
      state = STATE_PLAYING
    }
  }

  function update() {
    switch (state) {
      case STATE_PLAYING:
        playingUpdate()
        break
      case STATE_FINISH_ANIMATION:
        finishUpdate()
        break
      case STATE_MAKE_EQUATION:
        makeEquationUpdate()
        break
      case STATE_UNDO_FINISH:
        backToPlayingUpdate()
        break
    }
  }

  function updateStrand() {
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

  function render() {
    if (partitions) {
      partitionMaterial.shader.bind()
      partitionMaterial.updateCameraUniforms()
      partitionMaterial.shader.set1f('uniformNegRadius', time * time)
      partitionMaterial.shader.set1f('uniformFade', 1 - smoothstep(0, 1, eqTime))
      partitions.forEach(half => {
        partitionMaterial.shader.set3fv('uniformColor', half.color)
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

    if (handlePosition[0] <= endPosition[0]) {
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
      textMaterial.shader.set3fv('uniformColor2', element.color || vec3([0,0,0]))
      textMaterial.setModel(mat4([
        element.size, 0, 0, 0,
        0, element.size, 0, 0,
        0, 0, 1, 0,
        ...element.position, 1
      ]))
      quad.draw()
    }

    // for (const element of elements) {
    //   debugMaterial.shader.bind()
    //   debugMaterial.updateCameraUniforms()
    //   debugMaterial.setModel(mat4([
    //     element.width, 0, 0, 0,
    //     0, element.height, 0, 0,
    //     0, 0, 1, 0,
    //     ...element.position, 1
    //   ]))
    //   quad.draw(gl.LINE_STRIP)
    // }

    handleMaterial.shader.bind()
    handleMaterial.updateCameraUniforms()
    handleMaterial.setModel(mat4([
      handleSize, 0, 0, 0,
      0, handleSize, 0, 0,
      0, 0, 1, 0,
      ...handlePosition, 1
    ]))
    quad.draw()

    if (showTutorial) startArrowRender()
  }

  function getElementPartition(position) {
    for (let i = 0; i < partitions.length; i++) {
      const intersectionCount = getPolygonIntersections(position, vec3([Math.random(), 1, 0]), partitions[i].points)
      if (intersectionCount % 2 === 1) {
        return i
      }
    }
    return -1
  }

  function getElementPartitionColor(partitionIndex) {
    if (partitionIndex === -1) {
      alert('uhm?')
      return vec3([0.5, 0.5, 0.5])
    }
    else {
      return PARTITION_COLORS[(partitionIndex + 1) % partitions.length]
    }
  }

  function createPartitions() {
    function getPartition(perimeterVertices, color, reverse) {
      const vertexBuffer = new VertexBuffer()
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
      vertexBuffer.vertexLayout([3])
      const vertexData = new Float32Array(points.flatMap(x => [...x]))
      vertexBuffer.vertexData(vertexData)

      const indexBuffer1 = new IndexBuffer()
      const indices1 = triangulate(points)
      indexBuffer1.setData(new Uint16Array(indices1))

      vertexBuffer.setIndexBuffer(indexBuffer1)
      return {
        color,
        points,
        vertexBuffer
      }
    }

    partitions = [
      getPartition([
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
      ], PARTITION_COLORS[0]),

      getPartition([
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
      ], PARTITION_COLORS[1], true)
    ]

    for (const element of elements) {
      element.partition = getElementPartition(element.position)
      element.color = getElementPartitionColor(element.partition)
    }
  }

  return {
    update,
    render
  }
}
