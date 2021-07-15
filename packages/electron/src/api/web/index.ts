import { get } from 'lodash-es'

import { ipcRenderer, remote } from 'electron'

export const api: ElectronApi = {
  versions: process.versions,
  getGlobal: (path) => {
    const paths = path.split('.')

    const target = remote.getGlobal(paths[0])
    if(typeof target !== 'object') {
      return target
    }
    return get(remote.getGlobal(paths[0]), paths.slice(1).join('.'))
  },
  $send(channel: string, params: any) {
    ipcRenderer.send(channel, params)
  },
  $on: (channel, callback) => {
    ipcRenderer.on(channel, callback)
  }
}
