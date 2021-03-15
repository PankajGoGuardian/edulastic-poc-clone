import { removeTokenFromHtml } from '@edulastic/common'

function customPastePlugin(FroalaEditor) {
  FroalaEditor.DEFAULTS = Object.assign(FroalaEditor.DEFAULTS, {
    sanitizeClipboardHtml: false,
  })

  FroalaEditor.PLUGINS.customPastePlugin = (editor) => {
    function cleanup(clipboard_html) {
      let sanitizedString = clipboard_html
      if (editor.opts.tokenHighlightTemplate) {
        sanitizedString = removeTokenFromHtml(sanitizedString)
      }

      if (editor.opts.sanitizeClipboardHtml) {
        sanitizedString = sanitizedString
          ?.replace(/<meta[\s\S]*?>/g, '')
          ?.replace(/(<p(.*?)>)/g, '')
      }

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
