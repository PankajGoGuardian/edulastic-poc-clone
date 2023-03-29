class ExtensionBlocker {
  READ_WRITE_EXTN_CLASS = 'th-rw'
  DISPLAY_STYLE_NONE = 'none'
  DISPLAY_STYLE_BLOCK = 'block'
  MUTATION_OBSERVER_OPTIONS = {
    subtree: true,
    childList: true,
  }
  BLOCKED_EXTENSIONS = [
    {
      extName: 'READ_WRITE_EXTN', // Read&Write for Google Chrome™
      identifyBy: () =>
        document.getElementsByClassName(this.READ_WRITE_EXTN_CLASS),
      callBack: (el) => this.showHideExtensionRootElement(el),
    },
  ]
  constructor() {
    this.isAntiCheatingEnabled = false
    this.mutationObserver = new MutationObserver(this.blockExtensionsCallback)
  }

  showHideExtensionRootElement = (element) => {
    if (element?.style) {
      element.style.display = this.isAntiCheatingEnabled
        ? this.DISPLAY_STYLE_NONE
        : this.DISPLAY_STYLE_BLOCK
    }
  }

  blockExtensionsCallback = (event) => {
    this.BLOCKED_EXTENSIONS.forEach((extensionDetails) => {
      const [element] = extensionDetails.identifyBy()
      extensionDetails.callBack(element)
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
    this.isAntiCheatingEnabled = enable
  }
}

export const extensionBlocker = new ExtensionBlocker()
