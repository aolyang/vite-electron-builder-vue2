const { createLogger } = require('./console')

exports.parseTarget = (target) => {
  const targetObj = {}
  target.split(',').forEach(v => (targetObj[v] = true))
  if (!targetObj.web) {
    targetObj.web = targetObj.electron
  }
  return Object.keys(targetObj)
}

const definitions = {
  __ENV_PRODUCTION__: false,
  __ENV_DEVELOPMENT__: true
}
exports.loadEnv = (target, options) => {
  switch (target) {
    case 'electron':
      definitions.__ENV_ELECTRON__ = true
      break
  }
}

let viteServer = null
exports.createDev = (target, options) => {
  const { info, warn, error } = createLogger(target)
  console.log('process.env', target)
}
