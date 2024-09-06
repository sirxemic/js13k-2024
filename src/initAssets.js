import { generatePluckSounds } from './assets/audio/Pluck.js'
import { generateReverbIR } from './assets/audio/reverbIR.js'
import { generateErrorSound } from './assets/audio/ErrorSound.js'

export async function initAssets () {
  await generatePluckSounds()
  await generateReverbIR()
  await generateErrorSound()
}
