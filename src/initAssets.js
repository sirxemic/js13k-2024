import { generatePluckSounds } from './assets/audio/Pluck.js'
import { generateReverbIR } from './assets/audio/reverbIR.js'

export async function initAssets () {
  await generatePluckSounds()
  await generateReverbIR()
}
