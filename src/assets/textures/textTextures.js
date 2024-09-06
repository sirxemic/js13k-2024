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

export let digitTextures = await Promise.all([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => generateText(digit)))

export let plusTexture = await generateText('+')
export let minusTexture = await generateText('−')
export let multiplyTexture = await generateText('×')

export let equals13Texture = new Texture({
  data: await getImageDataFromSvgCode(
    svgText({
      text: '13',
      style: '900 200px Times',
      color: '#fff',
      x: 256,
      y: 320
    }),
    512,
    512
  ),
  wrap: gl.CLAMP_TO_EDGE
})

export let endTexture = new Texture({
  data: await getImageDataFromSvgCode(svgText({
      text: `That’s all!`,
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
