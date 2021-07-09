const { createLogger } = require('./console')
exports.createDev = (target, options) => {
  const logger = createLogger({ prefix: target })
}
