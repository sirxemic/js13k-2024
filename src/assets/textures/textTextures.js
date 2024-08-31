import { Texture } from '../../engine/graphics/Texture.js'
import { getImageDataFromSvgCode, svg, text as svgText } from '../../generationUtils/svg.js'
import { gl } from '../../engine.js'

export async function generateText(text) {
  const code = svgText({
    text,
    style: '900 700px Times',
    color: '#fff',
    x: 256,
    y: 490
  })

  return new Texture({
    data: await getImageDataFromSvgCode(code, 512, 512),
    wrap: gl.CLAMP_TO_EDGE
  })
}

export let titleTexture = new Texture({
  data: await getImageDataFromSvgCode(
    svgText({
      text: 'Do Not Make',
      style: '900 100px Times',
      color: '#fff',
      x: 512,
      y: 256
    }),
    1024,
    1024
  ),
  wrap: gl.CLAMP_TO_EDGE
})

export let oneTextures = await Promise.all([
  generateText('1'),
  generateText('1')
])

export let threeTextures = await Promise.all([
  generateText('3'),
  generateText('3')
])
