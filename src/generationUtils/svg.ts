export function svg (width: number, height: number, ...content: string[]) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${content.join('')}</svg>`
}

export function text (
  text: string,
  style: string,
  color: string,
  x: number,
  y: number
) {
  return `<text style="font:${style}" fill="${color}" text-anchor="middle" x="${x}" y="${y}">${text}</text>`
}

export async function getImageDataFromSvgCode (code: string, width: number, height: number) {
  const img = new Image(width, height)
  img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg(width, height, code))

  await new Promise(resolve => { img.onload = resolve })

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  canvas.width = width
  canvas.height = height
  ctx.drawImage(img, 0, 0, width, height)

  return canvas
}
