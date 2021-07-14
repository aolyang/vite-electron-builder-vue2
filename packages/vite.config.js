const path = require('path')
const { defineConfig } = require('vite')
const { createVuePlugin: vue2 } = require('vite-plugin-vue2')

const microApps = require('./microApps.json')

module.exports = defineConfig({
  root: __dirname,
  plugins: [
    vue2()
  ],
  build: {
    manifest: true,
    polyfillDynamicImport: true,
    //dynamicImportVarsOptions: {},
    rollupOptions: {
      input: path.join(__dirname, `./${microApps.root.entry}/entry.js`)
    }
  }
})
