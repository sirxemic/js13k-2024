import {
  audioContext,
  deltaTime,
  pointerPosition,
  VIEW_HEIGHT,
  VIEW_WIDTH
} from '../engine.js'
import { add, addScaled, distance, subtract, vec3, vec3Normalize } from '../math/vec3.js'
import { clamp, smoothstep } from '../math/math.js'
import { getEquations } from './getEquations.js'
import { nextLevel } from './currentLevel.js'
import { SymbolElement } from './symbolElement.js'
import {
  HANDLE_SIZE,
  introTime,
  partitions,
  resetIntroTime,
  resetShowingEquationsTime,
  setElements,
  setFillEffectRadius,
  setGoal,
  setLevelState,
  setPartitions,
  setStrand,
  showingEquationsTime,
  levelState,
  STATE_FINISH_ANIMATION,
  STATE_INTRO,
  STATE_MAKE_EQUATION,
  STATE_PLAYING,
  STATE_UNDO_FINISH,
  updateIntroTime,
  updateShowingEquationsTime,
  resetUndoFinishTime,
  updateUndoFinishTime,
  undoFinishTime
} from './shared.js'
import { Strand } from './strand.js'
import { Goal } from './goal.js'
import { Partitioner } from './partitioner.js'
import { Title } from './title.js'
import { StartArrow } from './startArrow.js'
import { Tutorial } from './tutorial.js'
import { generateReverbIR } from '../assets/audio/reverbIR.js'
import { setReverbDestination } from './audio.js'

export function getLevel(entities) {
  const elements = entities.filter(ent => ent instanceof SymbolElement)
  const strand = entities.find(ent => ent instanceof Strand)
  const goal = entities.find(ent => ent instanceof Goal)
  const startArrow = entities.find(ent => ent instanceof StartArrow)
  const tutorial = entities.find(ent => ent instanceof Tutorial)
  let title = entities.find(ent => ent instanceof Title)

  const partitioner = new Partitioner()

  setStrand(strand)
  setGoal(goal)
  setElements(elements)
  resetIntroTime()
  resetShowingEquationsTime()
  setLevelState(STATE_INTRO)

  // Controls

  let finishAnimationT = 0
  let hasEquations = false

  async function startDrag() {
    strand.startDrag()
    startArrow?.handleDrag()

    if (title) {
      entities.splice(entities.indexOf(title), 1)
      title = undefined
    }

    await audioContext.resume()
  }

  function stopDrag() {
    strand.stopDrag()
  }

  function setFinished() {
    startArrow?.handleFinish()

    setLevelState(STATE_FINISH_ANIMATION)
    strand.setFinished(goal.position)
    finishAnimationT = 0

    partitioner.createPartitions()
  }

  function introUpdate() {
    updateIntroTime()
    if (introTime >= 1) {
      setLevelState(STATE_PLAYING)
    }
  }

  function playingUpdate() {
    if (strand.dragStart) {
      if (!pointerPosition) {
        stopDrag()
      }
      else {
        add(strand.handleTarget, subtract(vec3(), pointerPosition, strand.dragStart), strand.handleAtDragStart)
        if (distance(strand.handleTarget, goal.position) > HANDLE_SIZE * 2) {
          strand.handleTarget[0] = clamp(strand.handleTarget[0], HANDLE_SIZE, VIEW_WIDTH - HANDLE_SIZE)
          strand.handleTarget[1] = clamp(strand.handleTarget[1], HANDLE_SIZE, VIEW_HEIGHT - HANDLE_SIZE)
        }
        else if (strand.handleTarget[0] > VIEW_WIDTH) {
          setFinished()
          return
        }
      }
    }
    else if (pointerPosition) {
      startDrag()
    }

    strand.handlePosition.set(strand.handleTarget)
    updateStrand()
  }

  function finishUpdate() {
    if (finishAnimationT === 0) {
      strand.undoUntil = strand.strandPositions.at(-2)
    }
    strand.handleTarget[0] = goal.position[0] + (finishAnimationT + 1) * finishAnimationT * 100
    strand.handleTarget[1] = goal.position[1]

    const factor = 1 - Math.exp(-deltaTime * 20)
    addScaled(strand.handlePosition, strand.handlePosition, subtract(vec3(), strand.handleTarget, strand.handlePosition), factor)

    updateStrand()

    finishAnimationT += deltaTime

    if (finishAnimationT > 1) {
      if (elements[0].partition === elements[1].partition && tutorial) {
        tutorial.show = true
      }
      resetShowingEquationsTime()
      setLevelState(STATE_MAKE_EQUATION)
    }
  }

  function makeEquationUpdate() {
    const CHAR_WIDTH = 70
    const CHAR_HEIGHT = 80
    if (showingEquationsTime === 0) {
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
      const t = smoothstep(0, 1, showingEquationsTime)
      for (const element of elements) {
        addScaled(element.position, element.originalPosition, subtract(vec3(), element.targetPosition, element.originalPosition), t)
        if (element.targetSize !== 0) {
          addScaled(element.position, element.position, vec3([Math.random() * 4 - 2, 0, 0]), 1 - t)
        }
        element.size = element.originalSize + (element.targetSize - element.originalSize) * t
      }

      if (showingEquationsTime > 1.2) {
        if (hasEquations) {
          resetUndoFinishTime()
          setLevelState(STATE_UNDO_FINISH)
        }
        else {
          nextLevel()
        }
        return
      }
    }

    updateShowingEquationsTime()
  }

  function backToPlayingUpdate() {
    updateUndoFinishTime()

    const t = smoothstep(0, 1, undoFinishTime)
    for (const element of elements) {
      addScaled(element.position, element.targetPosition, subtract(vec3(), element.originalPosition, element.targetPosition), t)
      element.size = element.targetSize + (element.originalSize - element.targetSize) * t
    }

    if (undoFinishTime < 1) {
      const offScreen = vec3([goal.position[0] + 500, goal.position[1], goal.position[2]])
      if (t < 0.5) {
        addScaled(strand.handlePosition, offScreen, subtract(vec3(), goal.position, offScreen), t * 2)
        addScaled(strand.handleTarget, offScreen, subtract(vec3(), goal.position, offScreen), t * 2)
      }
      else {
        const t2 = (t - 0.5) * 2
        addScaled(strand.handleTarget, goal.position, subtract(vec3(), strand.undoUntil, goal.position), t2)
        strand.handlePosition.set(strand.handleTarget)
      }
      updateStrand()
    }
    else {
      finishAnimationT = 0
      resetShowingEquationsTime()
      elements.forEach(element => {
        element.color = undefined
      })
      setPartitions(undefined)
      setLevelState(STATE_PLAYING)
    }
  }

  function update() {
    switch (levelState) {
      case STATE_INTRO:
        introUpdate()
        break
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
    setFillEffectRadius(finishAnimationT * finishAnimationT)
    entities.forEach(ent => ent.update?.())
  }

  function updateStrand() {
    const previousPosition = strand.strandPositions.at(-1)
    let distanceToPrev = distance(strand.handlePosition, previousPosition)
    if (distanceToPrev > HANDLE_SIZE) {
      const vectorToPrev = vec3Normalize(subtract(vec3(), strand.handlePosition, previousPosition))
      for (let x = HANDLE_SIZE; x < distanceToPrev; x += HANDLE_SIZE) {
        const point = addScaled(vec3(), previousPosition, vectorToPrev, x)

        if (strand.strandPositions.at(-2) && distance(point, strand.strandPositions.at(-2)) <= HANDLE_SIZE) {
          strand.strandPositions.pop()
        }
        else {
          const lastPoint = strand.strandPositions.at(-1)
          if (
            elements.some(element => {
              return (
                Math.abs(point[0] - element.position[0]) < element.width
                && Math.abs(point[1] - element.position[1]) < element.height
              )
            })
            ||
            strand.strandPositions.some(point2 => {
              return point2 !== lastPoint && distance(point, point2) <= HANDLE_SIZE
            })
          ) {
            strand.handlePosition.set(lastPoint)
            strand.handleTarget.set(lastPoint)
            return
          }
          strand.strandPositions.push(point)
          strand.vertexBuffer.updateVertexData(
            point,
            strand.strandPositions.length * 3 * 4
          )
        }
      }
    }
  }

  function render() {
    partitioner.render()
    entities.forEach(entity => entity.render())
  }

  return {
    update,
    render
  }
}
