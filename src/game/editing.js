import { elements } from './shared.js'
import { pointerPosition } from '../engine.js'
import { vec3 } from '../math/vec3.js'

let draggedElement
export function startEditDrag() {
  draggedElement = undefined
  for (const element of elements) {
    if (
      pointerPosition[0] > element.position[0] - element.width / 2 &&
      pointerPosition[0] < element.position[0] + element.width / 2 &&
      pointerPosition[1] > element.position[1] - element.height / 2 &&
      pointerPosition[1] < element.position[1] + element.height / 2
    ) {
      draggedElement = element
      break
    }
  }
}

export function editDrag() {
  if (!draggedElement) return
  draggedElement.position = vec3(pointerPosition)
  draggedElement.originalPosition = vec3(pointerPosition)
}

export function stopEditDrag() {
  draggedElement = undefined
}
