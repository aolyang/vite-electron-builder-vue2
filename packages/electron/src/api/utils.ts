import * as path from 'path'
import * as os   from 'os'

import { EDGE_EXTENSIONS_DIR, VUEJS_EXTENSION_ID } from '/@/constent/defenitions'

export const getVueJsExtensionPath = (): string => {
  return path.join(os.homedir(), EDGE_EXTENSIONS_DIR + VUEJS_EXTENSION_ID)
}
