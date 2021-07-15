import { join }           from 'path'
import { builtinModules } from 'module'

const path = require('path')
const { defineConfig } = require('vite')
const { createVuePlugin: vue2 } = require('vite-plugin-vue2')

const PACKAGE_ROOT = __dirname
const ENV_PRODUCTION = process.env.MODE === 'production'
const __ENV_ELECTRON__ = process.env.ENV_ELECTRON

module.exports = defineConfig({
  root: PACKAGE_ROOT,
  define: {
    __ENV_ELECTRON__,
    __ENV_DEVELOPMENT__: !ENV_PRODUCTION,
    __ENV_PRODUCTION__: ENV_PRODUCTION
  },
  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'src') + '/',
      '@root/': join(PACKAGE_ROOT, '../') // packages/*
    }
  },
  plugins: [
    vue2()
  ],
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  },
  build: {
    minify: __ENV_ELECTRON__,
    sourcemap: !ENV_PRODUCTION,
    outDir: 'dist',
    assetsDir: '.',
    polyfillDynamicImport: true,
    rollupOptions: {
      external: [...builtinModules],
      output: {
        manualChunks: {
        }
      }
    },
    emptyOutDir: true
  }
})
