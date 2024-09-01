import { loading } from './ui.js'
import { initAssets } from './initAssets.js'
import { startGame } from './engine.js'
import { onResize, init, render, update } from './game/main.js'

await initAssets()

init()

loading.hidden = true

startGame(update, render, onResize)
