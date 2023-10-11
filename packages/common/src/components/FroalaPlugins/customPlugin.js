/* eslint-disable */
import uuid from 'uuid/v4'
import { canInsert } from '../../helpers'
import { toolbarMapping } from './helpers'

function customPlugin(FroalaEditor) {
  // register custom math buttton
  FroalaEditor.DefineIconTemplate(
    'math',
    `
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27.188 21.645" {...props}>
    <g transform="translate(0.375 0.375)">
      <path
        className="a"
        d="M25.261,49.1H12.434L7.4,66.82a1.179,1.179,0,0,1-1.08.817H6.278a1.178,1.178,0,0,1-1.093-.74L3.127,61.751H1.177a1.177,1.177,0,0,1,0-2.354H3.924a1.178,1.178,0,0,1,1.093.74l1.141,2.851,4.3-15.43a1.177,1.177,0,0,1,1.121-.817H25.261a1.177,1.177,0,1,1,0,2.354ZM25.9,64.915,21.255,59.7l4.422-4.909a.294.294,0,0,0-.218-.491h-2.8a.3.3,0,0,0-.223.1L19.47,57.847l-2.945-3.441a.293.293,0,0,0-.224-.1H13.376a.294.294,0,0,0-.219.49l4.373,4.91-4.6,5.213a.294.294,0,0,0,.22.489h2.9a.293.293,0,0,0,.226-.106l3.073-3.687,3.146,3.69a.3.3,0,0,0,.224.1h2.963a.294.294,0,0,0,.219-.49Z"
        transform="translate(0 -46.742)"
      />
    </g>
  </SVG>
  `
  )

  FroalaEditor.DefineIconTemplate(
    'specialCharacters',
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 469.333 469.333" style="enable-background:new 0 0 469.333 469.333;" xml:space="preserve">
  <g>
    <g>
      <g>
        <path d="M253.227,300.267L253.227,300.267L199.04,246.72l0.64-0.64c37.12-41.387,63.573-88.96,79.147-139.307h62.507V64H192     V21.333h-42.667V64H0v42.453h238.293c-14.4,41.173-36.907,80.213-67.627,114.347c-19.84-22.08-36.267-46.08-49.28-71.467H78.72     c15.573,34.773,36.907,67.627,63.573,97.28l-108.48,107.2L64,384l106.667-106.667l66.347,66.347L253.227,300.267z"/>
        <path d="M373.333,192h-42.667l-96,256h42.667l24-64h101.333l24,64h42.667L373.333,192z M317.333,341.333L352,248.853     l34.667,92.48H317.333z"/>
      </g>
    </g>
  </g>
  </svg>`
  )

  FroalaEditor.DEFAULTS.specialCharacterSets = [
    {
      title: 'spanish',
      char: '&iexcl;',
    },
  ]

  FroalaEditor.DefineIconTemplate(
    'response',
    `<span class="custom-toolbar-btn">Drop Area</span>`
  )
  FroalaEditor.DefineIconTemplate(
    'responseBoxes',
    `<span class="custom-toolbar-btn">Response Boxes</span>`
  )
  FroalaEditor.DefineIconTemplate(
    'textinput',
    `<span class="custom-toolbar-btn">Text Input</span>`
  )
  FroalaEditor.DefineIconTemplate(
    'textdropdown',
    `<span class="custom-toolbar-btn">Text Dropdown</span>`
  )
  FroalaEditor.DefineIconTemplate(
    'mathinput',
    `<span class="custom-toolbar-btn">Math Input</span>`
  )
  FroalaEditor.DefineIconTemplate(
    'mathunit',
    `<span class="custom-toolbar-btn">Math w/ units</span>`
  )
  FroalaEditor.DefineIconTemplate(
    'paragraphNumber',
    `<span class="custom-toolbar-btn">PN</span>`
  )
  FroalaEditor.VIDEO_PROVIDERS.push(
    {
      test_regex: /^.+(screencast-o-matic.com)\/[^_&]+/,
      url_regex: '',
      url_text: '',
      html:
        '<iframe width="640" height="360" src="{url}" frameborder="0" allowfullscreen></iframe>',
      provider: 'screencast',
    },
    {
      test_regex: /^.+(drive.google.com)\/(file)\/(d)\/[^_&]+/,
      url_regex: /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:drive\.google\.com)\/(?:file)\/(?:d)\/?([0-9a-zA-Z_\-]+)(.+)?/g,
      url_text: 'https://drive.google.com/file/d/$1/preview',
      html: `<iframe width="640" height="360" src="{url}" frameborder="0" allowfullscreen></iframe>`,
      provider: 'google-drive',
    }
  )

  FroalaEditor.VIDEO_EMBED_REGEX = /<iframe[^>]*?(?:\/>|>[^<]*?<\/iframe>|(<embed.*>))\W*$/i

  FroalaEditor.DefineIcon('specialCharacters', {
    NAME: 'specialCharacters',
    template: 'specialCharacters',
  })

  // Register response commnad for Response Button
  FroalaEditor.DefineIcon('response', {
    NAME: 'response',
    template: 'response',
  })
  FroalaEditor.RegisterCommand('response', {
    title: 'Drop Area',
    focus: true,
    undo: true,
    refreshAfterCallback: true,
    callback() {
      if (
        !canInsert(this.selection.element()) ||
        !canInsert(this.selection.endElement())
      )
        return false
      this.html.insert(
        `&nbsp;<Response id="${uuid()}" contentEditable="false"></Response>&nbsp;`
      )
      this.undo.saveStep()
    },
  })

  // Register textinput command for Text Input button
  FroalaEditor.DefineIcon('textinput', {
    NAME: 'textinput',
    template: 'textinput',
  })
  FroalaEditor.RegisterCommand('textinput', {
    title: 'Text Input',
    focus: true,
    undo: true,
    refreshAfterCallback: true,
    callback() {
      if (
        !canInsert(this.selection.element()) ||
        !canInsert(this.selection.endElement())
      )
        return false
      this.html.insert(
        `&nbsp;<TextInput id="${uuid()}" contentEditable="false"></TextInput>&nbsp;`
      )
      this.undo.saveStep()
    },
  })

  // Register textdropdown command for Text Dropdown button
  FroalaEditor.DefineIcon('textdropdown', {
    NAME: 'textdropdown',
    template: 'textdropdown',
  })
  FroalaEditor.RegisterCommand('textdropdown', {
    title: 'Text Dropdown',
    focus: true,
    undo: true,
    refreshAfterCallback: true,
    callback() {
      if (
        !canInsert(this.selection.element()) ||
        !canInsert(this.selection.endElement())
      )
        return false
      this.html.insert(
        `&nbsp;<TextDropdown id="${uuid()}" contentEditable="false"></TextDropdown>&nbsp;`
      )
      this.undo.saveStep()
    },
  })

  // Register mathinput command for Math Input button
  FroalaEditor.DefineIcon('mathinput', {
    NAME: 'mathinput',
    template: 'mathinput',
  })
  FroalaEditor.RegisterCommand('mathinput', {
    title: 'Math Input',
    focus: true,
    undo: true,
    refreshAfterCallback: true,
    callback() {
      if (
        !canInsert(this.selection.element()) ||
        !canInsert(this.selection.endElement())
      )
        return false
      this.html.insert(
        `&nbsp;<MathInput id="${uuid()}" contentEditable="false"></MathInput>&nbsp;`
      )
      this.undo.saveStep()
    },
  })

  // Register mathunit command for Math Unit button
  FroalaEditor.DefineIcon('mathunit', {
    NAME: 'mathunit',
    template: 'mathunit',
  })
  FroalaEditor.RegisterCommand('mathunit', {
    title: 'Math w/ units',
    focus: true,
    undo: true,
    refreshAfterCallback: true,
    callback() {
      if (
        !canInsert(this.selection.element()) ||
        !canInsert(this.selection.endElement())
      )
        return false
      this.html.insert(
        `&nbsp;<MathUnit id="${uuid()}" contentEditable="false"></MathUnit>&nbsp;`
      )
      this.undo.saveStep()
    },
  })

  // Dropdown Toobar button for MathInput/TextDropDown/TextInput/MathUnits
  FroalaEditor.DefineIcon('responseBoxes', {
    NAME: 'responseBoxes',
    template: 'responseBoxes',
  })
  FroalaEditor.RegisterCommand('responseBoxes', {
    type: 'dropdown',
    focus: false,
    undo: true,
    refreshAfterCallback: true,
    options: {
      textinput: 'Text Input',
      textdropdown: 'Text Dropdown',
      mathinput: 'Math Input',
      mathunit: 'Math w/ units',
    },
    callback: function (_, op) {
      // OP is registered commands
      this.commands.exec(op)
    },
  })

  FroalaEditor.DefineIcon('paragraphNumber', {
    NAME: 'paragraphNumber',
    template: 'paragraphNumber',
  })
  FroalaEditor.RegisterCommand('paragraphNumber', {
    title: 'paragraphNumber',
    focus: false,
    undo: true,
    refreshAfterCallback: true,
    callback: function () {
      this.html.insert(`<ParagraphNumber></ParagraphNumber>`)
      this.undo.saveStep()
    },
  })

  FroalaEditor.PLUGINS.accessibleToolbar = function (editor) {
    // Add ARIA attributes to toolbar buttons.
    function addAriaAttributes() {
      editor.$tb.find('.fr-command').each(function () {
        var $button = $(this)
        var command = $button.data('cmd')
        var title = $button.attr('title')
        console.log('command', command)
        $button.attr({
          role: 'button',
          'aria-label': title,
          tabindex: 0,
        })
      })
    }

    // Add keyboard event handlers.
    function addKeyboardHandlers() {
      var toolbar = editor.$tb[0]
      let command = ''
      toolbar.addEventListener('keydown', function (e) {
        if (e.keyCode === FroalaEditor.KEYCODE.ENTER) {
          e.preventDefault()
          const $focusedButton = editor.$tb.find('.fr-command:focus')
          if ($focusedButton.length) {
            command = $focusedButton[0].getAttribute('data-cmd')
            // Execute the command.
            console.log('editor.....................', command, editor)
            if (Object.keys(toolbarMapping).includes(command)) {
              editor[toolbarMapping[command]]?.showInsertPopup()
              const $input = editor.$tb.find('.fr-popup input[type="file"]')
              if ($input.length) $input[0].click()
            } else if (command && editor.commands[command]) {
              editor.commands[command]()
            }
          }
        }
      })
    }

    // Initialize the plugin when the editor is ready.
    editor.events.on('initialized', function () {
      addAriaAttributes()
      addKeyboardHandlers()
    })
  }

  // Register the plugin.
  FroalaEditor.RegisterCommand('accessibleToolbar', {
    title: 'Accessible Toolbar',
    undo: true,
    focus: true,
    plugin: 'accessibleToolbar',
  })
}

export default customPlugin
