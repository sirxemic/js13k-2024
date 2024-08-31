import { levels } from './levels.js'

export let currentLevelIndex = 0
export let currentLevel = levels[0]()

export function nextLevel() {
  currentLevelIndex++
  currentLevel = levels[currentLevelIndex]()
}
