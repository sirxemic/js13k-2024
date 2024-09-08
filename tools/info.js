import fs from 'node:fs'
import { fileURLToPath } from 'url'

const path = fileURLToPath(new URL('../dist/index.html', import.meta.url))

const contents = fs.readFileSync(path, { encoding: 'utf-8' })
const tokens = contents.matchAll(/\b\w{4,}\b/g)
const counts = {}
for (const token of tokens) {
  if (!counts[token]) {
    counts[token] = 0
  }
  counts[token]++
}

const countsArray = Object.entries(counts).sort(([aKey, aCount], [bKey, bCount]) => {
  return aCount - bCount
})

const keywords = [
  'this',
  'return',
  'function',
  'await',
  'async',
  'class',
  'constructor'
]
for (const entry of countsArray) {
  if (keywords.includes(entry[0])) continue
  console.log(entry[0], entry[1])
}
