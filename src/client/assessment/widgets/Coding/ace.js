// load required Ace plugins
import * as ace from 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/ext-searchbox'
import 'ace-builds/src-noconflict/ext-emmet'
import 'ace-builds/src-noconflict/ext-spellcheck'
import 'ace-builds/src-noconflict/ext-error_marker'

ace.config.setModuleUrl(
  'ace/ext/error_marker',
  require(`file-loader!ace-builds/src-noconflict/ext-error_marker.js`)
)
import(`ace-builds/src-noconflict/keybinding-sublime`)

export const loadModeSpecificfiles = ({ lang }) => {
  try {
    return Promise.all([
      import(`ace-builds/src-noconflict/mode-${lang}`),
      import(`ace-builds/src-noconflict/snippets/${lang}`),
      ace.config.setModuleUrl(
        `ace/mode/${lang}_worker`,
        import(`file-loader!ace-builds/src-noconflict/worker-${lang}.js`)
      ),
    ])
  } catch (err) {
    return Promise.resolve()
  }
}
