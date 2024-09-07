import { levels } from './levels.js'

export let currentLevelIndex = window.localStorage.getItem('donotmake13') || 0
export let currentLevel = levels[currentLevelIndex]()

export function nextLevel() {
  currentLevelIndex++
  window.localStorage.setItem('donotmake13', currentLevelIndex === levels.length - 1 ? 0 : currentLevelIndex)
  currentLevel = levels[currentLevelIndex]()
}
