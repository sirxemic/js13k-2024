import { playSample } from './audio'
import { PluckSounds } from '../assets/audio/Pluck'

const notes = [14, 15, 16, 17, 19]
export function playVictorySound() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      playSample(PluckSounds[notes[i]])
    }, i * 100)
  }
}
