export function getFreq(note: number) {
  return 220 * 2 ** (note / 12)
}
