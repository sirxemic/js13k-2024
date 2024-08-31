import { vec3 } from '../math/vec3.js'
import { deltaTime } from '../engine.js'

export let fillEffectRadius = 0
export function setFillEffectRadius(value) {
  fillEffectRadius = value
}

export let introTime = 0
export function resetIntroTime() {
  introTime = 0
}
export function updateIntroTime() {
  introTime += deltaTime
}

export let showingEquationsTime = 0
export function resetShowingEquationsTime() {
  showingEquationsTime = 0
}
export function updateShowingEquationsTime() {
  showingEquationsTime += deltaTime * 2
}

export let strand
export function setStrand(value) {
  strand = value
}

export let goal
export function setGoal(value) {
  goal = value
}

export let elements
export function setElements(value) {
  elements = value
}

export let partitions
export function setPartitions(value) {
  partitions = value
}

export const HANDLE_SIZE = 16

export const PARTITION_COLORS = [
  vec3([1, 0.2, 0.2]),
  vec3([0.1, 0.1, 1]),
  vec3([0.5, 1, 0.5])
]

export const STATE_INTRO = 0
export const STATE_PLAYING = 1
export const STATE_FINISH_ANIMATION = 2
export const STATE_MAKE_EQUATION = 3
export const STATE_UNDO_FINISH = 4

export let levelState = STATE_INTRO
export function setLevelState(value) {
  levelState = value
}
