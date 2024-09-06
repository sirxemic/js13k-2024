import { levels } from './levels.js'

export let currentLevelIndex = 0
export let currentLevel = levels[currentLevelIndex]()

export function nextLevel() {
  currentLevelIndex++
  currentLevel = levels[currentLevelIndex]()
}
