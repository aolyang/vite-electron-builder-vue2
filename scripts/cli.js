const { createDev, parseTarget } = require('./dev')

const cli = require('cac')()
const _args = require('minimist')(process.argv.slice(2))

cli.command('dev <target>', 'Dev targets, divided by \',\'').
  action((target, options) => {
    const targets = parseTarget(target)
    targets.forEach(createDev)
  })

cli.command('create <name>', 'Create a new page or component with template').
  option('-t, --template', 'Choose a template', { default: 'page' }).
  option('-l, --lib', 'Choose a Framework(vue, react) to use', { default: 'vue' }).
  action((name, options) => {

  })

cli.help()
cli.version(require('../package.json').version)
cli.parse()
