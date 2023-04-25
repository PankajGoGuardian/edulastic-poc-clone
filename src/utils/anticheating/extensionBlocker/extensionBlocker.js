import { BLOCKED_EXTENSIONS } from './extensionBlockerConst'

class ExtensionBlocker {
  MUTATION_OBSERVER_OPTIONS = {
    subtree: true,
    childList: true,
  }
  EXTENSION_ELEMENTS = {}
  constructor() {
    this.isBlockExtensionEnabled = false
    this.mutationObserver = new MutationObserver(this.mutationCallback)
  }

  addOrRemoveExtensionRootElement = (extensionDetails) => {
    const [element] = extensionDetails?.identifyBy()
    const key = `${extensionDetails?.extName}`
    let storedExtensionElement = this.EXTENSION_ELEMENTS[key]
    const isRemoveExtension = element && this.isBlockExtensionEnabled
    const isAppendExtension =
      !element && storedExtensionElement && !this.isBlockExtensionEnabled
    if (isRemoveExtension) {
      this.EXTENSION_ELEMENTS[key] = element
      document.body.removeChild(element)
    }
    if (isAppendExtension) {
      document.body.appendChild(storedExtensionElement)
      delete this.EXTENSION_ELEMENTS[key]
    }
  }

  mutationCallback = (mutationsList) => {
    BLOCKED_EXTENSIONS.forEach((extensionDetails) => {
      this.addOrRemoveExtensionRootElement(extensionDetails)
    })
  }

  registerMutationObserver() {
    this.mutationObserver.observe(
      document.documentElement,
      this.MUTATION_OBSERVER_OPTIONS
    )
  }

  unregisterMutationObserver() {
    this.mutationObserver.disconnect()
  }

  toggleExtensionBlocker(enable) {
    this.isBlockExtensionEnabled = enable
  }
}

export const extensionBlocker = new ExtensionBlocker()
