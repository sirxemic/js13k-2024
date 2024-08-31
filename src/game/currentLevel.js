import { levels } from './levels.js'

export let currentLevelIndex = 0

export function getCurrentLevel() {
  return levels[currentLevelIndex]
}

export function nextLevel() {
  currentLevelIndex++
}
