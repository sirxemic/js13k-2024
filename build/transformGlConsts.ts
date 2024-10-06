import { GL } from '@luma.gl/constants'

export function transformGlConsts (code: string) {
  for (let [key, value] of Object.entries(GL)) {
    code = code.replace(new RegExp(`([^a-zA-Z.])gl\\.${key}\\b`, 'g'), (g0, g1) => g1 + value)
  }
  return code
}
