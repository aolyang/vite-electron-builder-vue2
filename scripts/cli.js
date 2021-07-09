const { build, createLogger, createServer } = require('vite')

const cli = require('cac')()
const _args = require('minimist')(process.argv.slice(2))

cli.command('dev [...targets]', 'Dev targets').
  action((targets, options) => {
    console.log('dev???', name)
  })

cli.help()
cli.version(require('../package.json').version)
cli.parse()
