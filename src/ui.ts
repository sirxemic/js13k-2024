import { classNames } from './classNames'

// <dev-only>
for (let key in classNames) {
  // @ts-ignore
  classNames[key] = key
}
// </dev-only>

function getElement (name: string): HTMLElement {
  return document.querySelector('.' + name)!
}

export const loading = getElement(classNames.loading)
export const restartButton = getElement(classNames.restartButton)

export function showRestartButton() {
  restartButton.style.right = 0 as unknown as string
}
export function hideRestartButton() {
  restartButton.style.right = '-10em'
}
