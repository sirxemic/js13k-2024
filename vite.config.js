import { defineConfig } from 'vite'
import packageJson from './package.json'

export default defineConfig({
  define: {
    GAME_ID: JSON.stringify(`${packageJson.author}_${packageJson.name}`)
  }
})
