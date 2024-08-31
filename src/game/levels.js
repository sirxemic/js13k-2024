import { getLevel } from './level.js'
import { vec3 } from '../math/vec3.js'
import { VIEW_HEIGHT, VIEW_WIDTH } from '../engine.js'
import { oneTexture, plusTexture, threeTexture, titleTexture, twoTexture } from '../assets/textures/textTextures.js'
import { fadeIn } from './fade.js'
import { startArrow } from './startArrow.js'
import { finalScreen } from './finalScreen.js'

function createSymbol(symbol, size, position) {
  let texture
  switch (symbol) {
    case 1:
      texture = oneTexture
      break
    case 2:
      texture = twoTexture
      break
    case 3:
      texture = threeTexture
      break
    case '+':
      texture = plusTexture
      break
  }
  return {
    texture,
    value: symbol,
    size,
    width: size / 5 * 3,
    height: size,
    position
  }
}

export const levels = [

  getLevel({
    startPosition: vec3([10, VIEW_HEIGHT / 2 + 70, 0]),
    endPosition: vec3([VIEW_WIDTH, VIEW_HEIGHT / 2 + 70, 0]),
    elements: [
      createSymbol(1, 50, vec3([VIEW_WIDTH / 2 - 40, 180, 0])),
      createSymbol(3, 50, vec3([VIEW_WIDTH / 2 + 40, 180, 0])),
      createSymbol('+', 20, vec3([VIEW_WIDTH / 2 - 180, 180, 0])),
      createSymbol('+', 20, vec3([VIEW_WIDTH / 2 + 180, 180, 0])),
      {
        texture: titleTexture,
        size: 150,
        position: vec3([VIEW_WIDTH / 2, VIEW_HEIGHT / 2, 0])
      }
    ],
    entities: [
      startArrow()
    ]
  }),

  getLevel({
    startPosition: vec3([10, VIEW_HEIGHT / 2, 0]),
    endPosition: vec3([VIEW_WIDTH, VIEW_HEIGHT / 2, 0]),
    elements: [
      createSymbol(1, 30, vec3([VIEW_WIDTH / 2 - 30, 100, 0])),
      createSymbol(3, 30, vec3([VIEW_WIDTH / 2 + 30, 100, 0])),
      createSymbol(1, 30, vec3([VIEW_WIDTH / 2 - 30, 250, 0])),
      createSymbol(3, 30, vec3([VIEW_WIDTH / 2 + 30, 260, 0])),
      createSymbol('+', 30, vec3([VIEW_WIDTH / 2 - 150, 150, 0])),
      createSymbol('+', 20, vec3([VIEW_WIDTH / 2 + 180, 180, 0])),
    ],
    entities: [
      fadeIn()
    ]
  }),

  getLevel({
    startPosition: vec3([10, VIEW_HEIGHT / 2, 0]),
    endPosition: vec3([VIEW_WIDTH, VIEW_HEIGHT / 2, 0]),
    elements: [
      createSymbol(1, 40, vec3([VIEW_WIDTH / 2 - 40, 180, 0])),
      createSymbol(1, 40, vec3([VIEW_WIDTH / 2 + 150, 60, 0])),
      createSymbol(3, 20, vec3([VIEW_WIDTH / 2 + 120, 160, 0])),
      createSymbol(1, 20, vec3([VIEW_WIDTH / 2 + 140, 220, 0])),
      createSymbol(3, 50, vec3([VIEW_WIDTH / 2 + 40, 230, 0])),
      createSymbol(3, 50, vec3([VIEW_WIDTH / 2 - 120, 250, 0])),
      createSymbol('+', 30, vec3([VIEW_WIDTH / 2 - 150, 150, 0])),
      createSymbol('+', 20, vec3([VIEW_WIDTH / 2 + 170, 320, 0])),
    ],
    entities: [
      fadeIn()
    ]
  }),

  getLevel({
    startPosition: vec3([10, VIEW_HEIGHT / 2, 0]),
    endPosition: vec3([VIEW_WIDTH, VIEW_HEIGHT / 2, 0]),
    elements: [
      createSymbol(1, 20, vec3([VIEW_WIDTH / 2 - 150, 60, 0])),
      createSymbol(1, 30, vec3([VIEW_WIDTH / 2 - 75, 60, 0])),
      createSymbol(1, 50, vec3([VIEW_WIDTH / 2 + 45, 70, 0])),
      createSymbol(1, 40, vec3([VIEW_WIDTH / 2 + 150, 60, 0])),
      createSymbol('+', 20, vec3([100, 130, 0])),
      createSymbol('+', 20, vec3([350, 130, 0])),
      createSymbol(3, 20, vec3([VIEW_WIDTH / 2 - 150, 260, 0])),
      createSymbol(3, 30, vec3([VIEW_WIDTH / 2 - 75, 260, 0])),
      createSymbol(2, 50, vec3([VIEW_WIDTH / 2 + 45, 270, 0])),
      createSymbol(3, 40, vec3([VIEW_WIDTH / 2 + 150, 260, 0])),
    ],
    entities: [
      fadeIn()
    ]
  }),

  finalScreen()
]
