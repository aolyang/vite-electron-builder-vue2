import * as net from 'net'

type SocketError = Error & {
  code: string
}

function testPort(port: number): Promise<boolean> {
  return new Promise<boolean>(resolve => {
    const socket = new net.Socket()

    socket.connect({ host: '127.0.0.1', port })
    socket.once('connect', function () {
      socket.unref()
      resolve(false)
    })
    socket.once('error', function (err: SocketError) {
      socket.unref()
      if (err.code === 'ECONNREFUSED') {
        resolve(true)
      } else resolve(false)
    })
  })
}

export const genPort = async (port: number): Promise<number> => {
  const res = await testPort(port)
  if (!res) {
    console.log('port: ' + port + '占用！')
    return genPort(++port)
  }
  return port
}
