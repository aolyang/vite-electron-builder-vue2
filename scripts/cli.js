const { createDev, parseTarget } = require('./dev')

const cli = require('cac')()
const _args = require('minimist')(process.argv.slice(2))

cli.command('dev <target>', 'Dev targets, divided by \',\'').
  action((target, options) => {
    const targets = parseTarget(target)
    targets.forEach(createDev)
  })

cli.help()
cli.version(require('../package.json').version)
cli.parse()
