declare const __ENV_DEVELOPMENT__ = boolean
declare const __ENV_PRODUCTION__ = !__ENV_DEVELOPMENT__

declare namespace NodeJS {
  interface Global {
    masterPort: number
  }
}

declare interface ElectronApi {
  readonly versions: Readonly<NodeJS.ProcessVersions>
  readonly $on: (scope: string, callback: () => any) => void
  readonly $send: (scope: string, data: any) => any
  readonly getGlobal: (path: string) => any
}

declare interface Window {
  electron: Readonly<MountedWebApi>
  electronRequire?: NodeRequire
}
