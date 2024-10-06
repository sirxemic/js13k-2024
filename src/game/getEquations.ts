import type { SymbolElement } from './symbolElement'

let equations = [
  '13',
  '7+6',
  '8+5',
  '9+4',
  '12+1',
  '15-2',
  '4*2+5',
  '2*5+3',
  '2*6+1',
  '3*5-2',
  '4*4-3',
  '35-22',
  '45-32',
  '55-42',
  '6+4+3',
  '6+5+2',
  '6+6+1',
  '22-3*3',
  '33-5*4',
  '11+1+1',
  '15-1-1',
  '22-4-5',
  '23-5-5',
  '3*3+2+2',
  '23-2-4-4',
  '2*2*2+3+2'
]

export function getEquations(partitionElements: SymbolElement[][]) {
  const result = []
  for (const partition of partitionElements) {
    const elementsCopy = partition.slice()
    for (const equation of equations) {
      let resultItem
      do {
        resultItem = getElements(equation, elementsCopy)
        if (resultItem) {
          result.push(resultItem)
        }
      } while (resultItem)
    }
  }
  return result
}

function getElements(equation: string, elements: SymbolElement[]) {
  const result = []
  for (const part of equation) {
    let valuesToCheck: (string | number)[]
    if (part === '*' || part === '+') {
      valuesToCheck = ['+']
    }
    else if (part === '-') {
      valuesToCheck = ['-']
    }
    else if (part === '9' || part === '6') {
      valuesToCheck = [9, 6]
    }
    else {
      valuesToCheck = [Number(part)]
    }
    const elementIndex = elements.findIndex(element => valuesToCheck.includes(element.value))
    if (elementIndex === -1) {
      result.forEach(el => el.useCase = undefined)
      elements.push(...result)
      return undefined
    }
    elements[elementIndex].useCase = part
    result.push(...elements.splice(elementIndex, 1))
  }
  return result
}
