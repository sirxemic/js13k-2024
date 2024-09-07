import {
  audioContext,
  deltaTime, lastPointerPosition,
  pointerPosition,
  VIEW_HEIGHT,
  VIEW_WIDTH
} from '../engine.js'
import { add, addScaled, distance, subtract, vec3, vec3Lerp, vec3Normalize } from '../math/vec3.js'
import { clamp, saturate, smoothstep } from '../math/math.js'
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
  undoFinishTime, STATE_FINISH_EQUATION, setShowingEquationsTimeScale, STATE_LEVEL_COMPLETE
} from './shared.js'
import { Strand } from './strand.js'
import { Goal } from './goal.js'
import { Partitioner } from './partitioner.js'
import { Title } from './title.js'
import { StartArrow } from './startArrow.js'
import { Tutorial } from './tutorial.js'
import { playSample } from './audio.js'
import { ErrorSound } from '../assets/audio/ErrorSound.js'
import { playVictorySound } from './playVictorySound.js'
import { startMusic } from './dynamicMusic.js'
import { fadeMaterial } from '../assets/materials/fadeMaterial.js'
import { quad } from '../assets/geometries/quad.js'

export function getLevel(entities) {
  const elements = entities.filter(ent => ent instanceof SymbolElement)
  const strand = entities.find(ent => ent instanceof Strand)
  const goal = entities.find(ent => ent instanceof Goal)
  const startArrow = entities.find(ent => ent instanceof StartArrow)
  const tutorial = entities.find(ent => ent instanceof Tutorial)
  let title = entities.find(ent => ent instanceof Title)

  const partitioner = new Partitioner()
  let equals13Elements = []
  let equations

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
  }

  function stopDrag() {
    strand.stopDrag()
  }

  function setFinished() {
    startArrow?.handleFinish()

    setLevelState(STATE_FINISH_ANIMATION)
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
        if (lastPointerPosition) strand.move(subtract(vec3(), pointerPosition, lastPointerPosition))
        if (distance(strand.handlePosition, goal.position) < HANDLE_SIZE) {
          setFinished()
        }
      }
    }
    else if (pointerPosition) {
      startDrag()
    }
  }

  function finishUpdate() {
    if (finishAnimationT === 0) {
      strand.undoUntil = strand.strandPositions.at(-2)
    }
    const target = vec3([
      goal.position[0] + (finishAnimationT + 1) * finishAnimationT * 100,
      goal.position[1],
      0
    ])
    strand.move(subtract(vec3(), target, strand.handlePosition), false)
    finishAnimationT += deltaTime

    if (finishAnimationT > 1) {
      if (elements[0].partition === elements[1].partition && tutorial) {
        tutorial.show = true
      }
      checkConditionMet()
    }
  }

  function checkConditionMet() {
    const CHAR_WIDTH = 70
    const CHAR_HEIGHT = 80
    let partitionElements = partitions.map(() => [])
    for (const element of elements) {
      partitionElements[element.partition].push(element)
      element.targetSize = 0
      element.targetPosition = element.position
    }
    equations = getEquations(partitionElements)
    hasEquations = equations.length > 0

    if (hasEquations) {
      playSample(ErrorSound)
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
      setShowingEquationsTimeScale(equations.some(eq => eq.length > 2) ? 4 : 2)
      resetShowingEquationsTime()
      setLevelState(STATE_MAKE_EQUATION)
    }
    else {
      setLevelState(STATE_LEVEL_COMPLETE)
    }
  }

  function makeEquationUpdate() {
    const t = smoothstep(0, 1, showingEquationsTime)
    for (const element of elements) {
      addScaled(element.position, element.originalPosition, subtract(vec3(), element.targetPosition, element.originalPosition), t)
      addScaled(element.position, element.position, vec3([Math.random() * 4 - 2, 0, 0]), 1 - t)
      element.size = element.originalSize + (element.targetSize - element.originalSize) * t
      if (element.useAsMultiply) {
        element.rotation = t * 0.25 * Math.PI
      }
      else {
        element.rotation = 0
      }
    }

    if (showingEquationsTime > 1.2) {
      setLevelState(STATE_FINISH_EQUATION)
      initFinishEquation()
      return
    }

    updateShowingEquationsTime()
  }

  function setElementsAnimationPositionFrom() {
    for (const element of elements) {
      element.animationPositionFrom = vec3(element.position)
    }
  }

  function initFinishEquation() {
    setElementsAnimationPositionFrom()
    equals13Elements = []
    for (const element of elements) {
      element.doMerge = false
    }
    for (const equation of equations) {
      const doMerge = equation.map(el => el.value).join('') !== '13'
      equation.forEach(element => element.doMerge = doMerge)
      if (doMerge) {
        const element = new SymbolElement('13', 150, vec3([VIEW_WIDTH / 2, equation[0].position[1], 0]))
        element.color = equation[0].color
        element.initAnimationT = 1
        element.alpha = 0
        equals13Elements.push(element)
      }
    }
  }

  function finishEquationUpdate() {
    updateShowingEquationsTime()

    const t = smoothstep(1.7, 2.2, showingEquationsTime)
    const t2 = smoothstep(3.3, 5, showingEquationsTime)
    if (t2 === 0) {
      for (const element of elements) {
        if (element.doMerge) {
          vec3Lerp(element.position, element.animationPositionFrom, vec3([VIEW_WIDTH / 2, element.position[1], 0]), t)
          element.alpha = (1 - t) ** 0.5
        }
      }

      equals13Elements.forEach(element => {
        element.alpha = t ** 2
      })
    }
    else {
      for (const element of elements) {
        if (element.doMerge) {
          vec3Lerp(element.position, vec3([VIEW_WIDTH / 2, element.position[1], 0]), element.animationPositionFrom, t2)
          element.alpha = saturate(3 * t2)
        }
      }
      equals13Elements.forEach(element => {
        element.alpha = 1 - t2 * 3
      })
    }

    const duration = equals13Elements.length > 0 ? 6 : 2
    if (showingEquationsTime >= duration) {
      setElementsAnimationPositionFrom()
      resetUndoFinishTime()
      setLevelState(STATE_UNDO_FINISH)
    }
  }

  function backToPlayingUpdate() {
    updateUndoFinishTime()

    const t = smoothstep(0, 1, undoFinishTime)
    for (const element of elements) {
      vec3Lerp(element.position, element.animationPositionFrom, element.originalPosition, t)
      element.size = element.targetSize + (element.originalSize - element.targetSize) * t
      element.colorMerge = 1 - t

      if (element.useAsMultiply) {
        element.rotation = (1 - t) * 0.25 * Math.PI
      }
      else {
        element.rotation = 0
      }
    }

    strand.rewind()
    if (undoFinishTime >= 1 && distance(strand.handlePosition, goal.position) > HANDLE_SIZE * 1.5) {
      finishAnimationT = 0
      resetShowingEquationsTime()
      elements.forEach(element => {
        element.colorMerge = 1
        element.color = undefined
      })
      setPartitions(undefined)
      setLevelState(STATE_PLAYING)
    }
  }

  let levelCompleteTime = 0
  function levelCompleteUpdate() {
    if (levelCompleteTime === 0) {
      playVictorySound()
    }

    levelCompleteTime += deltaTime

    const t = smoothstep(1, 0, levelCompleteTime * 1.2)
    for (const element of elements) {
      element.size = element.originalSize * t
    }

    if (levelCompleteTime > 1) {
      nextLevel()
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
      case STATE_FINISH_EQUATION:
        finishEquationUpdate()
        break
      case STATE_UNDO_FINISH:
        backToPlayingUpdate()
        break
      case STATE_LEVEL_COMPLETE:
        levelCompleteUpdate()
        break
    }
    setFillEffectRadius(finishAnimationT * finishAnimationT)
    entities.forEach(ent => ent.update?.())
  }

  function render() {
    partitioner.render()
    entities.forEach(entity => entity.render())
    if (equals13Elements.length > 0) {
      debugger
    }
    equals13Elements.forEach(element => element.render())
    if (levelCompleteTime > 0) {
      fadeMaterial.shader.bind()
      fadeMaterial.shader.set1f('uniformAlpha', levelCompleteTime)
      quad.draw()
    }
  }

  return {
    update,
    render
  }
}
