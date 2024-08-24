import packageJson from '../package.json' assert { type: 'json' }

export function setGameID (code) {
  return code.replace('GAME_ID', JSON.stringify(`${packageJson.author}_${packageJson.name}`))
}
