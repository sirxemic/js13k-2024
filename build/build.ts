import { rollup } from 'rollup'
import fs from 'node:fs'
import rollupPluginJson from '@rollup/plugin-json'
import rollupPluginUrl from '@rollup/plugin-url'
import rollupPluginTypescript from '@rollup/plugin-typescript'

import { setGameID } from './setGameID'
import { removeDevOnly } from './removeDevOnly'
import { ccMinify } from './ccMinify'
import { minifyMore } from './minifyMore'
import { minifyShaders } from './minifyShaders'
import { transformConstToLet } from './transformConstToLet'
import { transformGlConsts } from './transformGlConsts'
import { minifyHtml } from './minifyHtml'
import { zip } from './zip'

export interface BuildParams {
  fixBeforeMinify: (src: string) => string
  fixAfterHtmlMinify: (src: string) => string
}

export async function build({ fixBeforeMinify, fixAfterHtmlMinify }: BuildParams) {
  const plugins = [
    rollupPluginJson(),
    rollupPluginUrl({
      limit: Infinity
    }),
    rollupPluginTypescript()
  ]

  const inputOptions = {
    input: 'src/main.ts',
    plugins
  } as const

  const outputOptions = {
    file: 'dist/build',
    format: 'es'
  } as const

  if (!fs.existsSync('dist')){
    fs.mkdirSync('dist')
  }

  const bundle = await rollup(inputOptions)
  const { output } = await bundle.generate(outputOptions)
  let code = output[0].code

  code = `(async () => {${code}})()`

  const postProcessFunctions = [
    setGameID,
    transformConstToLet,
    transformGlConsts,
    fixBeforeMinify,
    removeDevOnly,
    ccMinify,
    minifyMore,
    minifyShaders
  ]

  for (const func of postProcessFunctions) {
    // console.log('Code size:', code.length)
    // console.log(`Executing ${func.name}...`)
    code = await func(code)
  }

  // console.log('Code size:', code.length)
  // console.log(`Generating and minifying HTML...`)
  let minifiedHtml = fs.readFileSync('index.html', { encoding: 'utf-8' })
  minifiedHtml = minifyHtml(minifiedHtml)
  minifiedHtml = fixAfterHtmlMinify(minifiedHtml)

  let newScriptTag = `<script>${code.replace("'use strict';", '')}</script>`
  minifiedHtml = minifiedHtml
    .replace(/<script[^>]+><\/script>/, _ => newScriptTag)

  fs.writeFileSync('dist/index.html', minifiedHtml, { encoding: 'utf-8' })

  console.log('HTML bundle size:', minifiedHtml.length)
  console.log('Zipping...')

  await zip('dist/index.html', 'dist/dist.zip')

  const finalFileSize = fs.readFileSync('dist/dist.zip').byteLength

  const limit = 13 * 1024
  const perc = (finalFileSize * 100 / limit).toFixed(1)
  console.log(`Final file size: ${finalFileSize} (${perc}% of 13kb)`)

  if (finalFileSize > limit) {
    console.error(`That's ${finalFileSize - limit} too many bytes!`)
  } else {
    console.log(`${limit - finalFileSize} bytes left!`)
  }
}
