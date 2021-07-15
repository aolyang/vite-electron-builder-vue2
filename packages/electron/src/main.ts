import { join } from 'path'
import { URL }  from 'url'

import { app, BrowserWindow, ipcMain, session } from 'electron'
import { logger }                               from '/@/api/logger'
import { getVueJsExtensionPath }                from '/@/api/utils'
import startMaster                              from '/@/master'

import type { IpcMainEvent } from 'electron'

const isSingleInstance = app.requestSingleInstanceLock()

if (!isSingleInstance) {
  app.quit()
  process.exit(0)
}

app.disableHardwareAcceleration()

/**
 * Workaround for TypeScript bug
 * @see https://github.com/microsoft/TypeScript/issues/41468#issuecomment-727543400
 */
const env = import.meta.env

// Install "Vue.js devtools"
console.log('env mode', env.MODE, __ENV_DEVELOPMENT__)
if (__ENV_DEVELOPMENT__) {
  app.whenReady().
    then(async () => {
      const devToolsPath = getVueJsExtensionPath()
      await session.defaultSession.loadExtension(devToolsPath)
    }).
    catch(e => console.error('Failed install extension:', e))
}

let mainWindow: BrowserWindow | null = null
const sendMainWindowStatus = () => {
  if (!mainWindow) return
  const windowStatus = {
    isNormal: mainWindow.isNormal(),
    isMaximized: mainWindow.isMaximized(),
    isFullScreen: mainWindow.isFullScreen()
  }
  // logger('???????', windowStatus)
  mainWindow?.webContents.send('refresh-window-bar', windowStatus)
}
const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 1366,
    minWidth: 1366,
    height: 768,
    minHeight: 768,
    show: false, // Use 'ready-to-show' event to show window
    icon: join(__dirname, './assets/app.png'),
    frame: false,
    webPreferences: {
      webSecurity: false,
      preload: join(__dirname, '../preload/index.cjs'),
      contextIsolation: env.MODE !== 'test',   // Spectron tests can't work with contextIsolation: true
      enableRemoteModule: true // Spectron tests can't work with enableRemoteModule: false
    }
  })

  mainWindow.menuBarVisible = false
  /**
   * If you install `show: true` then it can cause issues when trying to close the window.
   * Use `show: false` and listener events `ready-to-show` to fix these issues.
   *
   * @see https://github.com/electron/electron/issues/25012
   */
  mainWindow.on('close', (event) => {
    event.preventDefault()
    mainWindow?.webContents.send('try-close-window')
  })
  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()

    // if (env.MODE === 'development') {
    //   setTimeout(() => {
    //     mainWindow?.webContents.openDevTools()
    //   }, 1000)
    // }
  })

  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test
   */
  const proUrl = new URL('./renderer/index.html', 'file://' + __dirname).toString()
 
  const pageUrl = __ENV_DEVELOPMENT__ ? env.VITE_DEV_SERVER_URL as string : proUrl
  console.log('proUrl', pageUrl)

  await mainWindow.webContents.session.setProxy({ proxyRules: 'direct://' })
  await mainWindow.loadURL(pageUrl)

  // global.masterPort = await startMaster()
  // mainWindow.webContents.send('port-ready', global.masterPort)
  mainWindow.on('resize', sendMainWindowStatus)
  mainWindow.on('enter-full-screen', sendMainWindowStatus)
  mainWindow.on('leave-full-screen', sendMainWindowStatus)
  mainWindow.on('enter-html-full-screen', sendMainWindowStatus)
  mainWindow.on('leave-html-full-screen', sendMainWindowStatus)
}

ipcMain.on('get-window-bar-status', sendMainWindowStatus)
ipcMain.on('set-window-status', (eventIP: IpcMainEvent, funcName: string) => {
  if (!mainWindow) return
  if (funcName in mainWindow) {
    // @ts-ignore
    mainWindow[funcName]()
  } else if (funcName === 'exit') {
    mainWindow.destroy()
    app.quit()
  }
})
ipcMain.on('reboot', () => {
  if (mainWindow) mainWindow.reload()
})
app.on('second-instance', () => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    logger('second-instance')
    // if (mainWindow.isMinimized()) mainWindow.restore()
    // mainWindow.focus()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.whenReady().then(createWindow).catch((e) => console.error('Failed create window:', e))
