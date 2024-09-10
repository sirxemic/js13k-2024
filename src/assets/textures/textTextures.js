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
    data: await getImageDataFromSvgCode(
      code,
      512,
      512
    ),
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

export let plusTexture = new Texture({
  data: await getImageDataFromSvgCode(
    '<path d="M70 233h372v46h-372zM233 70h46v372h-46z" fill="#fff" />',
    512,
    512
  ),
  wrap: gl.CLAMP_TO_EDGE
})

export let minusTexture = new Texture({
  data: await getImageDataFromSvgCode(
    '<path d="M70 233h372v46h-372z" fill="#fff" />',
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
