import { VertexBuffer } from '../engine/graphics/VertexBuffer.js'
import { add, addScaled, distance, dot, length, project, scale, subtract, vec3, vec3Normalize } from '../math/vec3.js'
import { deltaTime, gl, lastPointerPosition, pointerPosition, useMaterial, VIEW_HEIGHT, VIEW_WIDTH } from '../engine.js'
import { strandMaterial } from '../assets/materials/strandMaterial.js'
import { mat4 } from '../math/mat4.js'
import { elements, fillEffectRadius, goal, HANDLE_SIZE, levelState, musicTime, STATE_PLAYING } from './shared.js'
import { handleMaterial } from '../assets/materials/handleMaterial.js'
import { quad } from '../assets/geometries/quad.js'
import { setPosition } from './dynamicMusic.js'
import { clamp } from '../math/math.js'

export class Strand {
  constructor(startPosition) {
    this.vertexBuffer = new VertexBuffer()
    this.vertexBuffer.vertexLayout([3])
    this.vertexBuffer.vertexData(new Float32Array(3 * 10 * 1024))

    this.startPosition = startPosition
    this.strandPositions = [
      vec3([-1000, startPosition[1], 0]),
      vec3(startPosition),
      vec3(startPosition)
    ]

    this.handlePosition = vec3(startPosition)

    this.dragStart = undefined

    this.vertexBuffer.updateVertexData(
      new Float32Array([
        -1000, startPosition[1], 0,
        ...startPosition,
        ...startPosition
      ]),
      0
    )
  }

  startDrag() {
    this.dragStart = vec3(pointerPosition)
  }

  stopDrag() {
    this.dragStart = undefined
  }

  checkUndo() {
    for (let i = 1; i < this.strandPositions.length - 1; i++) {
      if (distance(this.strandPositions[i], lastPointerPosition) < HANDLE_SIZE) {
        this.strandPositions.length = i + 1
        this.handlePosition.set(this.strandPositions.at(-1))
      }
    }
  }

  move(delta, collisionCheck = true) {
    let deltaLength = length(delta)
    const deltaNormalized = vec3Normalize(vec3(), delta)

    while (deltaLength > 0) {
      if (this.moveStep(scale(vec3(), deltaNormalized, Math.min(HANDLE_SIZE, deltaLength)), collisionCheck)) {
        return
      }
      deltaLength -= HANDLE_SIZE
    }
  }

  collides(point) {
    if (elements.some(element => {
      return Math.abs(point[0] - element.position[0]) < element.width && Math.abs(point[1] - element.position[1]) < element.height
    })) {
      return true
    }
    for (let i = 0; i < this.strandPositions.length - 3; i++) {
      if (distance(this.strandPositions[i], point) <= HANDLE_SIZE) {
        return true
      }
    }
    return false
  }

  moveStep(delta, collisionCheck) {
    const newPosition = add(vec3(), this.handlePosition, delta)

    if (collisionCheck && this.collides(newPosition)) {
      return true
    }

    this.handlePosition.set(newPosition)

    if (collisionCheck) {
      const maxX = this.handlePosition[1] > goal.position[1] - HANDLE_SIZE && this.handlePosition[1] < goal.position[1] + HANDLE_SIZE
        ? VIEW_WIDTH + Math.abs(this.handlePosition[1] - goal.position[1])
        : VIEW_WIDTH - HANDLE_SIZE

      this.handlePosition[0] = clamp(this.handlePosition[0], HANDLE_SIZE, maxX)
      this.handlePosition[1] = clamp(this.handlePosition[1], HANDLE_SIZE, VIEW_HEIGHT - HANDLE_SIZE)
    }

    const secondLastPoint = this.strandPositions.at(-2)
    const thirdLastPoint = this.strandPositions.at(-3)

    if (distance(this.handlePosition, thirdLastPoint) < HANDLE_SIZE) {
      this.strandPositions.splice(-2, 1)
      this.vertexBuffer.updateVertexData(
        this.handlePosition,
        (this.strandPositions.length - 1) * 3 * 4
      )
      return
    }

    // Make sure angles are never smaller than 90 degrees
    const dir1 = subtract(vec3(), this.handlePosition, secondLastPoint)
    const dir1Normalized = vec3Normalize(vec3(), dir1)
    const dir2 = subtract(vec3(), secondLastPoint, thirdLastPoint)
    const dir2Normalized = vec3Normalize(vec3(), dir2)
    if (dot(dir1Normalized, dir2Normalized) < 0) {
      const projected = add(vec3(), project(vec3(), dir1, dir2), secondLastPoint)
      secondLastPoint.set(projected)
      this.vertexBuffer.updateVertexData(
        projected,
        (this.strandPositions.length - 2) * 3 * 4
      )
    }

    if (distance(this.handlePosition, secondLastPoint) > HANDLE_SIZE) {
      this.vertexBuffer.updateVertexData(
        this.handlePosition,
        this.strandPositions.length * 3 * 4
      )
      this.strandPositions.push(vec3(this.handlePosition))
    }
    else {
      this.strandPositions.at(-1).set(this.handlePosition)
      this.vertexBuffer.updateVertexData(
        this.handlePosition,
        (this.strandPositions.length - 1) * 3 * 4
      )
    }
  }

  rewind() {
    const direction = subtract(vec3(), this.strandPositions.at(-2), this.handlePosition)
    const speed = this.handlePosition[0] > VIEW_WIDTH ? 200 : 50
    scale(direction, vec3Normalize(direction), deltaTime * speed)
    this.move(direction, false)
  }

  update() {
    if (levelState === STATE_PLAYING) {
      setPosition(this.handlePosition)
    }
    else {
      setPosition(undefined)
    }
  }

  render() {
    useMaterial(strandMaterial)
    strandMaterial.setModel(mat4())
    strandMaterial.shader.set1f('uniformNegRadius', fillEffectRadius)
    this.vertexBuffer.vertexCount = this.strandPositions.length
    this.vertexBuffer.draw(gl.LINE_STRIP)

    useMaterial(handleMaterial)
    handleMaterial.setModel(mat4([
      HANDLE_SIZE, 0, 0, 0,
      0, HANDLE_SIZE, 0, 0,
      0, 0, 1, 0,
      ...this.handlePosition, 1
    ]))
    quad.draw()

    // <dev-only>
    // for (const point of this.strandPositions) {
    //   handleMaterial.setModel(mat4([
    //     HANDLE_SIZE * 0.1, 0, 0, 0,
    //     0, HANDLE_SIZE * 0.1, 0, 0,
    //     0, 0, 1, 0,
    //     ...point, 1
    //   ]))
    //   quad.draw()
    // }
    // </dev-only>
  }
}
