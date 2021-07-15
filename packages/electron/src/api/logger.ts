import * as electron from 'electron'

export const logger = (...args: any[]):void => {
  const win = electron.BrowserWindow.getFocusedWindow()

  win?.webContents.send('console:log', args)
}
