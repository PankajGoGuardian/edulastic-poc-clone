import { CONTEXTMENU_EVENT_NAME } from './constants'
import { extensionBlocker } from './extensionBlocker/extensionBlocker'

const contextmenuEventCallback = (event) => event.preventDefault()

export const blockAntiCheatingFeature = () => {
  extensionBlocker.toggleExtensionBlocker(true)
  document.addEventListener(CONTEXTMENU_EVENT_NAME, contextmenuEventCallback)
}

export const unblockAntiCheatingFeature = () => {
  extensionBlocker.toggleExtensionBlocker(false)
  document.removeEventListener(CONTEXTMENU_EVENT_NAME, contextmenuEventCallback)
}
