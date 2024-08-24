import { loading } from './ui.js'
import { initAssets } from './initAssets.js'
import { startGame } from './engine.js'
import { render, update } from './game/main.js'

await initAssets()

loading.hidden = true

startGame(update, render)
