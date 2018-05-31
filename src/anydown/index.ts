import Installer from './installer'

export { Installer }

export {
  CustomHandler,
  CustomHandlerPayload,
  InputEventDispatcher,
  Reflector
} from './types'

// simple renderer
export default new Installer().install()
