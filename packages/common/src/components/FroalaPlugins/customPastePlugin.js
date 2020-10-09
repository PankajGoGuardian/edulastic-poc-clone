function customPastePlugin(FroalaEditor) {
  FroalaEditor.DEFAULTS = Object.assign(FroalaEditor.DEFAULTS, {
    sanitizeClipboardHtml: false,
  })

  FroalaEditor.PLUGINS.customPastePlugin = (editor) => {
    function cleanup(clipboard_html) {
      if (!editor.opts.sanitizeClipboardHtml) {
        return clipboard_html
      }

      const sanitizedString = clipboard_html
        ?.replace(/<meta[\s\S]*?>/g, '')
        ?.replace(/(<p(.*?)>)/g, '')

      return sanitizedString
    }

    function _init() {
      editor.events.on('paste.beforeCleanup', cleanup)
      editor.events.on('paste.afterCleanup', cleanup)
    }
    return {
      _init,
    }
  }
}

export default customPastePlugin
