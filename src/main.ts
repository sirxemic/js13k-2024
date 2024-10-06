import { loading } from './ui'
import { initAssets } from './initAssets'
import { audioContext, startGame } from './engine'
import { onResize, init, render, update } from './game/main'
import { startMusic } from './game/dynamicMusic'

await initAssets()

init()

loading.remove()

startGame(update, render, onResize)

document.addEventListener('pointerdown', async () => {
  await audioContext.resume()
  startMusic()
})
