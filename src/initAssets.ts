import { generatePluckSounds } from './assets/audio/Pluck'
import { generateReverbIR } from './assets/audio/reverbIR'
import { generateErrorSound } from './assets/audio/ErrorSound'
import { generatePadsSounds } from './assets/audio/Pads'

export async function initAssets () {
  await generatePluckSounds()
  await generatePadsSounds()
  generateReverbIR()
  generateErrorSound()
}
