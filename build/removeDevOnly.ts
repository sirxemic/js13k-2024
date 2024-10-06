export function removeDevOnly (code: string) {
  const originalLines = code.split('\n')
  const finalLines = []
  let devOnly = false

  let lastFoundOpen = -1
  for (let i = 0; i < originalLines.length; i++) {
    const line = originalLines[i]
    if (line.match(/\/\/\s*<dev-only>/)) {
      if (devOnly) {
        throw new Error('missing </dev-only>! Context: ' + originalLines.slice(i-2, i + 2))
      }

      devOnly = true
      lastFoundOpen = i
    }
    else if (line.match(/\/\/\s*<\/dev-only>/)) {
      devOnly = false
    }
    else if (!devOnly) {
      finalLines.push(line)
    }
  }

  if (devOnly) {
    throw new Error('missing </dev-only>! Context: ' + originalLines.slice(lastFoundOpen - 2, lastFoundOpen + 2))
  }

  return finalLines.join('\n')
}
