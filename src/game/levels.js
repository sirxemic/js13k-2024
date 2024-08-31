import { getLevel } from './level.js'
import { vec3 } from '../math/vec3.js'
import { VIEW_HEIGHT, VIEW_WIDTH } from '../engine.js'
import { oneTextures, threeTextures, titleTexture } from '../assets/textures/textTextures.js'

let randomNessIndexThing = 1
function createSymbol(symbol, size, position) {
  let texture
  switch (symbol) {
    case 1:
      texture = oneTextures[(randomNessIndexThing++) % oneTextures.length]
      break
    case 3:
      texture = threeTextures[(randomNessIndexThing++) % threeTextures.length]
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
      {
        texture: titleTexture,
        size: 150,
        position: vec3([VIEW_WIDTH / 2, VIEW_HEIGHT / 2, 0])
      }
    ],
    showTutorial: true
  }),
  getLevel({
    startPosition: vec3([10, VIEW_HEIGHT / 2 + 70, 0]),
    endPosition: vec3([VIEW_WIDTH, VIEW_HEIGHT / 2 + 70, 0]),
    elements: [
      createSymbol(1, 40, vec3([VIEW_WIDTH / 2 - 40, 180, 0])),
      createSymbol(1, 40, vec3([VIEW_WIDTH / 2 + 150, 60, 0])),
      createSymbol(3, 50, vec3([VIEW_WIDTH / 2 + 40, 230, 0])),
      createSymbol(3, 60, vec3([VIEW_WIDTH / 2 - 110, 250, 0]))
    ]
  })
]

