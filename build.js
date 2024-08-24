import { build } from './build/build.js'

await build({
  // Rename certain words and rewrite patterns which closure compiler usually doesn't mangle, such that
  // it actually does mangle them.
  fixBeforeMinify (code) {
    return code.replace(/stride/g, 'stride_Thing')
  },

  // Hack: undo some renaming :P
  fixAfterHtmlMinify (html) {
    return html
  }
})
