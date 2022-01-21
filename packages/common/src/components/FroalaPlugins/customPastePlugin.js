/* eslint-disable func-names */
import striptags from 'striptags'

const allowedTags = [
  'span',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'b',
  'strong',
  'i',
  'em',
  'mark',
  'small',
  'del',
  'ins',
  'sub',
  'sup',
  'table',
  'tr',
  'thead',
  'tbody',
  'th',
  'td',
  'tfoot',
  'img',
  'ul',
  'ol',
  'dl',
  'li',
  'p',
  'br',
  'a',
  'audio',
  'video',
  'source',
]

function customPastePlugin(FroalaEditor) {
  FroalaEditor.DEFAULTS = Object.assign(FroalaEditor.DEFAULTS, {
    sanitizeClipboardHtml: false,
  })

  FroalaEditor.PLUGINS.customPastePlugin = function (editor) {
    function cleanup(clipboard_html) {
      let sanitizedString = clipboard_html
      if (editor.opts.tokenHighlightTemplate) {
        sanitizedString = sanitizedString.replace(/(<([^>]+)>)/gi, '')
      }

      if (editor.opts.sanitizeClipboardHtml) {
        sanitizedString = sanitizedString
          ?.replace(/<meta[\s\S]*?>/g, '')
          ?.replace(/(<p(.*?)>)/g, '<p>')
      }

      if (editor.opts.restrictTags) {
        sanitizedString = striptags(sanitizedString, allowedTags)
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
