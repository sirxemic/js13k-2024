import { Texture } from '../../engine/graphics/Texture.js'
import { getImageDataFromSvgCode, svg, text as svgText } from '../../generationUtils/svg.js'
import { gl } from '../../engine.js'

export async function generateText(text) {
  const code = svgText(
    text,
    '900 700px Times',
    '#fff',
    256,
    490
  )

  return new Texture({
    data: await getImageDataFromSvgCode(code, 512, 512),
    wrap: gl.CLAMP_TO_EDGE
  })
}

export let titleTexture = new Texture({
  data: await getImageDataFromSvgCode(
    svgText(
      'Do Not Make',
      '900 100px Times',
      '#fff',
       512,
       256
    ),
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
    svgText(
      '13',
      '900 200px Times',
      '#fff',
      256,
      320
    ),
    512,
    512
  ),
  wrap: gl.CLAMP_TO_EDGE
})

export let endTexture = new Texture({
  data: await getImageDataFromSvgCode(svgText(
    `That’s all!`,
    '900 100px Times',
    '#fff',
    512,
    512
    ) + svgText(
      `Thanks for playing!`,
    '900 70px Times',
    '#fff',
    512,
    600
  ),
    1024,
    1024
  ),
  wrap: gl.CLAMP_TO_EDGE
})
