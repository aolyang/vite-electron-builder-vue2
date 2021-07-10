const crossEnv = require('cross-env')
const { createLogger } = require('./console')

exports.parseTarget = (target) => {
  const targetObj = {}
  target.split(',').forEach(v => (targetObj[v] = true))
  if (!targetObj.web) {
    targetObj.web = targetObj.electron
  }
  return Object.keys(targetObj)
}

crossEnv('NODE_ENV=development')
const definitions = {
  __ENV_PRODUCTION__: false,
  __ENV_DEVELOPMENT__: true
}
exports.loadEnv = (target, options) => {
  switch (target) {
    case 'electron':
      crossEnv('__ENV_ELECTRON__=true')
      definitions.__ENV_ELECTRON__ = true
      break
  }
}

let viteServer = null
exports.createDev = (target, options) => {
  const { info, warn, error } = createLogger(target)
  info`node.env ${process.env}`
  info`test msg ${10} + ${'http://12'}`
  warn`test msg ${10} + ${'http://12'}`
  error`test msg ${10} + ${'http://12'}`
}
