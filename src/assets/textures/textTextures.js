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

export let oneTexture = await generateText('1')
export let twoTexture = await generateText('2')
export let threeTexture = await generateText('3')
export let plusTexture = await generateText('+')

export let endTexture = new Texture({
  data: await getImageDataFromSvgCode(svgText({
      text: `That's all!`,
      style: '900 100px Times',
      color: '#fff',
      x: 512,
      y: 512
    }) + svgText({
    text: `Thanks for playing!`,
    style: '900 70px Times',
    color: '#fff',
    x: 512,
    y: 600
  }),
    1024,
    1024
  ),
  wrap: gl.CLAMP_TO_EDGE
})
