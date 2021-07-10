const chalk = require('chalk')
const { createLogger } = require('vite')

const TypeColor = {
  info: 'blueBright',
  warn: 'yellowBright',
  error: 'redBright'
}
const makeLogMsg = (type, [templates, ...args]) => {
  let str = ''
  templates.forEach((v, i) => {
    str += chalk[TypeColor[type]].bold(v || '') + chalk.bold(args[i] || '')
  })
  return str
}

const makeLogFunc = (type, group) => (...args) => {
  const logger = createLogger(type, { prefix: group })
  logger[type](makeLogMsg(type, args), { timestamp: true })
}

/**
 * @return {info, warn, success, error}
 */
exports.createLogger = (group) => {
  return {
    info: makeLogFunc('info', group),
    warn: makeLogFunc('warn', group),
    error: makeLogFunc('error', group)
  }
}
