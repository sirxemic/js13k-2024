const equations = [
  [1, 3],
  [1, 1, '+', 1, '+', 1],
  [1, 1, '+', 2]
]

export function getEquations(partitionElements) {
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

function getElements(equation, elements) {
  const result = []
  for (const part of equation) {
    const elementIndex = elements.findIndex(element => element.value === part)
    if (elementIndex === -1) {
      elements.push(...result)
      return undefined
    }
    result.push(...elements.splice(elementIndex, 1))
  }
  return result
}
