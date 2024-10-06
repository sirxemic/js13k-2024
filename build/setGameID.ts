import packageJson from '../package.json' assert { type: 'json' }

export function setGameID (code: string) {
  return code.replace('GAME_ID', JSON.stringify(`${packageJson.author}_${packageJson.name}`))
}
