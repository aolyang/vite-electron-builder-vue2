const chalk = require('chalk')
const { createLogger } = require('vite')

/**
 * @param level {import('vite').LogLevel}
 * @param options {import('vite').LoggerOptions}
 */
exports.createLogger = (level, options) => {
  const logger = createLogger(level, options)

  return {
    warn: ([template, ...args]) => {
      console.log(template, args)
      logger[level]()
    }
  }
}
