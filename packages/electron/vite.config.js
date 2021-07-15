const { join } = require('path')
const { builtinModules } = require('module')

const PACKAGE_ROOT = __dirname

const rollupExternals = [
  'electron',
  ...builtinModules
]
exports.getElectronViteConfig = (target) => {
  const ENV_PRODUCTION = process.env.NODE_ENV === 'production'

  return {
    root: PACKAGE_ROOT,
    define: {
      __ENV_DEVELOPMENT__: !ENV_PRODUCTION,
      __ENV_PRODUCTION__: ENV_PRODUCTION
    },
    resolve: {
      alias: {
        '/@/': join(PACKAGE_ROOT, 'src') + '/'
      }
    },
    build: {
      lib: {
        entry: `src/${target}.ts`,
        formats: ['cjs']
      },
      assetsDir: '.',
      sourcemap: 'inline',
      outDir: `dist/${target}`,
      minify: ENV_PRODUCTION ? 'terser' : false,
      terserOptions: {
        ecma: 2020,
        compress: {
          passes: 2
        },
        safari10: false
      },
      rollupOptions: {
        external: rollupExternals,
        output: {
          entryFileNames: 'index.cjs'
        }
      },
      emptyOutDir: true,
      watch: ENV_PRODUCTION ? null : {}
    }
  }
}
