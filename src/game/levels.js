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
    new SymbolElement('+', 20, vec3([VIEW_WIDTH / 2 - 180, 180, 0])),
    new SymbolElement('+', 20, vec3([VIEW_WIDTH / 2 + 180, 180, 0])),
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
    new SymbolElement(1, 40, vec3([VIEW_WIDTH / 2 - 40, 180, 0])),
    new SymbolElement(1, 40, vec3([VIEW_WIDTH / 2 + 150, 60, 0])),
    new SymbolElement(3, 20, vec3([VIEW_WIDTH / 2 + 120, 160, 0])),
    new SymbolElement(1, 20, vec3([VIEW_WIDTH / 2 + 140, 220, 0])),
    new SymbolElement(3, 50, vec3([VIEW_WIDTH / 2 + 40, 230, 0])),
    new SymbolElement(3, 50, vec3([VIEW_WIDTH / 2 - 120, 250, 0])),
    new SymbolElement('+', 30, vec3([VIEW_WIDTH / 2 - 150, 150, 0])),
    new SymbolElement('+', 20, vec3([VIEW_WIDTH / 2 + 170, 320, 0])),
    new Goal(vec3([VIEW_WIDTH, VIEW_HEIGHT / 2, 0])),
    new Strand(vec3([10, VIEW_HEIGHT / 2, 0])),
    fadeIn()
  ]),

  () => getLevel([
    new SymbolElement(1, 20, vec3([VIEW_WIDTH / 2 - 150, 60, 0])),
    new SymbolElement(1, 30, vec3([VIEW_WIDTH / 2 - 75, 60, 0])),
    new SymbolElement(1, 50, vec3([VIEW_WIDTH / 2 + 45, 70, 0])),
    new SymbolElement(1, 40, vec3([VIEW_WIDTH / 2 + 150, 60, 0])),
    new SymbolElement('+', 20, vec3([100, 130, 0])),
    new SymbolElement('+', 20, vec3([350, 130, 0])),
    new SymbolElement(3, 20, vec3([VIEW_WIDTH / 2 - 150, 260, 0])),
    new SymbolElement(3, 30, vec3([VIEW_WIDTH / 2 - 75, 260, 0])),
    new SymbolElement(2, 50, vec3([VIEW_WIDTH / 2 + 45, 270, 0])),
    new SymbolElement(3, 40, vec3([VIEW_WIDTH / 2 + 150, 260, 0])),
    new Goal(vec3([VIEW_WIDTH, VIEW_HEIGHT / 2, 0])),
    new Strand(vec3([10, VIEW_HEIGHT / 2, 0])),
    fadeIn()
  ]),

  () => finalScreen()
]
