import * as path from 'path'
import * as cp   from 'child_process'

import { genPort }         from '/@/api/gen/masterPort'
import { DEV_MASTER_PATH } from '/@/constent/defenitions'

export default async function startMaster() {
  const masterName = process.platform === 'win32' ? 'master.exe' : 'master'

  const port = __ENV_DEVELOPMENT__ ? 3434 : await genPort(3000)
  console.log('use port', port)

  let masterPath = path.join(path.dirname(process.execPath), masterName)
  if (__ENV_DEVELOPMENT__) {
    masterPath = DEV_MASTER_PATH
  }

  const params: string[] = [
    '--port=' + port
  ]
  const master = cp.spawn(masterPath, params)
  console.log('master path', masterPath, __ENV_DEVELOPMENT__)

  master.on('error', err => {
    console.log('start error', err)
  })
  master.on('close', code => {
    console.log('exit code', code)
  })
  master.stdout.on('data', data => {
    console.log('%c>>>master stdout:%s', 'color:blue', new TextDecoder('utf-8').decode(data))
  })
  return port
}
