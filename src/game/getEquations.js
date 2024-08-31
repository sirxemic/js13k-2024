const equations = [
  [1, 3],
  [1, 1, '+', 1, '+', 1],
  [1, 1, '+', 2]
]

export function getEquations(partitionElements) {
  const result = []
  for (const partition of partitionElements) {
    for (const equation of equations) {
      const resultItem = getElements(equation, partition)
      if (resultItem) {
        result.push(resultItem)
      }
    }
  }
  return result
}

function getElements(equation, elements) {
  const elementsCopy = elements.slice()
  const result = []
  for (const part of equation) {
    const elementIndex = elementsCopy.findIndex(element => element.value === part)
    if (elementIndex === -1) return undefined
    result.push(...elementsCopy.splice(elementIndex, 1))
  }
  return result
}
