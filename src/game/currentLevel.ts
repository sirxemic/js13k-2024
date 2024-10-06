import { levels } from './levels'
import { restartButton } from '../ui'

export let currentLevelIndex = (window.localStorage.getItem('donotmake13') as unknown as number) || 0
export let currentLevel = levels[currentLevelIndex]()

export function restart() {
  currentLevel = levels[currentLevelIndex]()
}

document.addEventListener('keydown', e => {
  if (e.key === 'r') {
    restart()
  }
})

restartButton.onclick = restart

export function nextLevel() {
  currentLevelIndex++
  const value = (currentLevelIndex === levels.length - 1 ? 0 : currentLevelIndex) as unknown as string
  window.localStorage.setItem('donotmake13', value)
  currentLevel = levels[currentLevelIndex]()
}
