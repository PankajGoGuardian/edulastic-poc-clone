// load Ace editor
const ace = require("ace-builds/src-noconflict/ace");

// load required Ace plugins
require("ace-builds/src-noconflict/theme-github");
require("ace-builds/src-noconflict/ext-language_tools");
require("ace-builds/src-noconflict/ext-searchbox");
require("ace-builds/src-noconflict/ext-emmet");
require("ace-builds/src-noconflict/ext-spellcheck");
require("ace-builds/src-noconflict/ext-error_marker");
ace.config.setModuleUrl("ace/ext/error_marker", require(`file-loader!ace-builds/src-noconflict/ext-error_marker.js`));
import(`ace-builds/src-noconflict/keybinding-sublime`);

export const loadModeSpecificfiles = ({ lang }) => {
  try {
    return Promise.all([
      import(`ace-builds/src-noconflict/mode-${lang}`),
      import(`ace-builds/src-noconflict/snippets/${lang}`),
      ace.config.setModuleUrl(
        `ace/mode/${lang}_worker`,
        import(`file-loader!ace-builds/src-noconflict/worker-${lang}.js`)
      )
    ]);
  } catch (err) {
    return new Promise((resolve, reject) => resolve());
  }
};
