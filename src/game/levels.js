import { getLevel } from './level.js'
import { vec3 } from '../math/vec3.js'
import { VIEW_HEIGHT, VIEW_WIDTH } from '../engine.js'
import { fadeIn } from './fade.js'
import { StartArrow } from './startArrow.js'
import { finalScreen } from './finalScreen.js'
import { SymbolElement } from './symbolElement.js'
import { Title } from './title.js'
import { Strand } from './strand.js'
import { Goal } from './goal.js'
import { Tutorial } from './tutorial.js'

export const levels = [
  () => getLevel([
    new SymbolElement(1, 50, vec3([VIEW_WIDTH / 2 - 40, 180, 0])),
    new SymbolElement(3, 50, vec3([VIEW_WIDTH / 2 + 40, 180, 0])),
    new SymbolElement('+', 25, vec3([VIEW_WIDTH / 2 - 180, 160, 0])),
    new SymbolElement('+', 20, vec3([VIEW_WIDTH / 2 + 180, 180, 0])),
    new SymbolElement('+', 15, vec3([VIEW_WIDTH / 2 + 40, 330, 0])),
    new Title(),
    new StartArrow(),
    new Tutorial(),
    new Goal(vec3([VIEW_WIDTH, VIEW_HEIGHT / 2 + 70, 0])),
    new Strand(vec3([10, VIEW_HEIGHT / 2 + 70, 0]))
  ]),

  () => getLevel([
    new SymbolElement(1, 30, vec3([VIEW_WIDTH / 2 - 30, 100, 0])),
    new SymbolElement(3, 30, vec3([VIEW_WIDTH / 2 + 30, 100, 0])),
    new SymbolElement(1, 30, vec3([VIEW_WIDTH / 2 - 30, 250, 0])),
    new SymbolElement(3, 30, vec3([VIEW_WIDTH / 2 + 30, 260, 0])),
    new SymbolElement('+', 30, vec3([VIEW_WIDTH / 2 - 150, 150, 0])),
    new SymbolElement('+', 20, vec3([VIEW_WIDTH / 2 + 180, 180, 0])),
    new Goal(vec3([VIEW_WIDTH, VIEW_HEIGHT / 2, 0])),
    new Strand(vec3([10, VIEW_HEIGHT / 2, 0])),
    fadeIn()
  ]),

  () => getLevel([
    new SymbolElement(1, 30, vec3([VIEW_WIDTH / 2 - 40, 170, 0])),
    new SymbolElement(1, 25, vec3([VIEW_WIDTH / 2 + 140, 65, 0])),
    new SymbolElement(3, 15, vec3([VIEW_WIDTH / 2 + 120, 160, 0])),
    new SymbolElement(1, 15, vec3([VIEW_WIDTH / 2 + 140, 220, 0])),
    new SymbolElement(3, 40, vec3([VIEW_WIDTH / 2 + 40, 230, 0])),
    new SymbolElement(3, 40, vec3([VIEW_WIDTH / 2 - 120, 250, 0])),
    new SymbolElement('+', 30, vec3([VIEW_WIDTH / 2 - 150, 150, 0])),
    new SymbolElement('+', 20, vec3([VIEW_WIDTH / 2 + 170, 320, 0])),
    new Goal(vec3([VIEW_WIDTH, VIEW_HEIGHT / 2, 0])),
    new Strand(vec3([10, VIEW_HEIGHT / 2, 0])),
    fadeIn()
  ]),

  () => getLevel([
    new SymbolElement(1, 20, vec3([VIEW_WIDTH / 2 - 160, 60, 0])),
    new SymbolElement(1, 25, vec3([VIEW_WIDTH / 2 - 75, 60, 0])),
    new SymbolElement(1, 40, vec3([VIEW_WIDTH / 2 + 25, 90, 0])),
    new SymbolElement(1, 30, vec3([VIEW_WIDTH / 2 + 150, 60, 0])),
    new SymbolElement('+', 20, vec3([140, 130, 0])),
    new SymbolElement('+', 20, vec3([350, 140, 0])),
    new SymbolElement('+', 20, vec3([VIEW_WIDTH / 2, 270, 0])),
    new SymbolElement(3, 30, vec3([VIEW_WIDTH / 2 + 100, 265, 0])),
    new SymbolElement(3, 45, vec3([VIEW_WIDTH / 2 - 100, 250, 0])),
    new Goal(vec3([VIEW_WIDTH, VIEW_HEIGHT / 2, 0])),
    new Strand(vec3([10, VIEW_HEIGHT / 2, 0])),
    fadeIn()
  ]),

  () => getLevel([
    new SymbolElement('+', 20, vec3([140, 130, 0])),
    new SymbolElement(2, 20, vec3([165, 130, 0])),
    new SymbolElement('+', 50, vec3([240, 130, 0])),
    new SymbolElement(3, 50, vec3([240+70, 130, 0])),
    new SymbolElement('+', 45, vec3([VIEW_WIDTH / 2 - 30, 240, 0])),
    new SymbolElement(5, 45, vec3([VIEW_WIDTH / 2 + 30, 240, 0])),
    new SymbolElement(1, 30, vec3([70, 270, 0])),
    new SymbolElement(1, 30, vec3([240+140+20, 200, 0])),
    new Goal(vec3([VIEW_WIDTH, VIEW_HEIGHT / 2 + 80, 0])),
    new Strand(vec3([10, 50, 0])),
    fadeIn()
  ]),

  () => finalScreen()
]
