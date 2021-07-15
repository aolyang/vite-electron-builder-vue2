const chalk = require('chalk')
const { createDev, parseTarget } = require('./dev')

const cli = require('cac')()
const _args = require('minimist')(process.argv.slice(2))

cli.command('dev <target>', 'Dev targets, divided by \',\'. default: electron').
  option('-d, --docs', 'Start docs server', { default: false }).
  action(async (target, { docs }) => {
    const { targets, ...targetObj } = parseTarget(target)
    process.env.NODE_ENV = 'development'
    process.env.ENV_ELECTRON = targetObj.electron

    if (targetObj.web) {
      await createDev('web')
      if (targetObj.electron) await createDev('electron')
    }
    if (docs) createDev('docs').then()
  })

cli.help()
cli.version(require('../package.json').version)
cli.parse()
