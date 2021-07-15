const path = require('path')
const electronPath = require('electron')
const { spawn } = require('child_process')
const { build, createServer } = require('vite')
const { createLogger } = require('./console')
const { getElectronViteConfig } = require('../packages/electron/vite.config')

/** @type {import('vite').InlineConfig} */
const sharedConfig = {
  mode: 'development',
  build: {
    watch: {}
  }
}
exports.parseTarget = (target) => {
  const targetObj = {}
  target.split(',').forEach(v => (targetObj[v] = true))
  if (targetObj.electron) targetObj.web = true

  return { ...targetObj, targets: Object.keys(targetObj) }
}

/**
 * @param configFile
 * @param writeBundle
 * @returns {Promise<import('vite').RollupOutput | Array<import('vite').RollupOutput> | import('vite').RollupWatcher>}
 */
const buildAndSetTargetWatcher = ({ target, writeBundle }) => {
  const inlineConfig = getElectronViteConfig(target)

  console.log('inlineConfig', inlineConfig)
  return build({
    ...sharedConfig,
    ...inlineConfig,

    plugins: [{ target, writeBundle }]
  })
}

let webServer = null, spawnProcess = null
const restartMainProcess = () => {
  const { warn, error } = createLogger('ELECTRON SPAWN')
  if (spawnProcess) {
    spawnProcess.kill('SIGINT')
    spawnProcess = null
  }
  spawnProcess = spawn(String(electronPath), ['.'])

  spawnProcess.stdout.on('data', d => d.toString().trim() && warn`stdout ==> ${d.toString()}`)
  spawnProcess.stderr.on('data', d => d.toString().trim() && error`stderr ==> ${d.toString()}`)
}

const createElectronWatcher = async () => {
  const { config } = webServer
  const protocol = config.server.https ? 'https' : 'http'
  const host = config.server.host || 'localhost'
  const port = config.server.port // default port 3000

  process.env.VITE_DEV_SERVER_URL = `${protocol}://${host}:${port}/`

  await buildAndSetTargetWatcher({
    target: 'preload',
    writeBundle: () => webServer.ws.send({ type: 'full-reload' })
  })

  await buildAndSetTargetWatcher({
    target: 'main',
    writeBundle: restartMainProcess
  })
}

const createWebServer = async (target) => {
  const { info } = createLogger(target)

  info`create dev server...`
  const viteServer = await createServer({
    configFile: path.join(__dirname, `../packages/${target}/vite.config.js`)
  })
  await viteServer.listen()

  return viteServer
}

exports.createDev = async (target) => {
  const { info } = createLogger(target)

  if (target === 'electron') {
    info`use web dev server`
    createElectronWatcher().then()
  } else if (target === 'web') {
    webServer = await createWebServer(target)
  } else {
    await createWebServer(target)
  }
}
