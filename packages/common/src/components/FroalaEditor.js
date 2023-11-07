/* eslint-disable */
import React, { useState, useEffect, useRef, useContext } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Editor from 'react-froala-wysiwyg'
import FroalaEditor from 'froala-editor'
import { withTheme } from 'styled-components'
import { notification, LanguageContext } from '@edulastic/common'
import { aws, math, appLanguages } from '@edulastic/constants'
import { withMathFormula } from '../HOC/withMathFormula'
import 'froala-editor/js/plugins.pkgd.min'
import 'froala-editor/css/plugins.pkgd.min.css'
import 'froala-editor/css/froala_editor.pkgd.min.css'
// froala.min.css is loaded at index as it required for preview as well.

import {
  uploadToS3,
  reIndexResponses,
  canInsert,
  beforeUpload,
  isValidUpdate,
} from '../helpers'
import headings from './FroalaPlugins/headings'
import customPastePlugin from './FroalaPlugins/customPastePlugin'
import customPlugin from './FroalaPlugins/customPlugin'
import imageUploadPlugin from './FroalaPlugins/imageUploadPlugin'
import useStickyToolbar from './FroalaPlugins/useStickyToolbar'
import {
  getToolbarButtons,
  getSpecialCharacterSets,
  isContainsMathContent,
} from './FroalaPlugins/helpers'
import { buttonWidthMap } from './FroalaPlugins/constants'
import {
  NoneDiv,
  ToolbarContainer,
  BackgroundStyleWrapper,
} from './FroalaPlugins/styled'

import MathModal from './MathModal'

import {
  getMathHtml,
  replaceLatexesWithMathHtml,
  replaceMathHtmlWithLatexes,
} from '../utils/mathUtils'
import audioPlugin from './FroalaPlugins/audioPlugin'
import useAudioRecorder from '../../../../src/client/assessment/widgets/AudioResponse/hooks/useAudioRecorder'

const symbols = ['all']
const { defaultNumberPad } = math

// adds h1 & h2 buttons commands to froala editor.
headings(FroalaEditor)
// adds past event handler
customPastePlugin(FroalaEditor)
// register custom buttons
customPlugin(FroalaEditor)
// adds image.beforeUpload and image.inserted event handler
imageUploadPlugin(FroalaEditor)

const CustomEditor = ({
  value,
  onChange,
  toolbarId,
  toolbarSize,
  additionalToolbarOptions,
  initOnClick,
  theme,
  border,
  centerContent,
  imageDefaultWidth,
  videoDefaultWidth,
  placeholder,
  fontSize,
  className,
  buttons,
  advancedAreOpen,
  customCharacters,
  editorHeight,
  allowQuickInsert = true,
  unsetMaxWidth = false,
  ...restOptions
}) => {
  const mathFieldRef = useRef(null)
  const editorRef = useRef(null)
  const toolbarContainerRef = useRef(null)
  const [showMathModal, setMathModal] = useState(false)
  const [mathModalIsEditable, setMathModalIsEditable] = useState(true)
  const [currentLatex, setCurrentLatex] = useState('')
  const [currentMathEl, setCurrentMathEl] = useState(null)
  const [content, setContent] = useState('')
  const [prevValue, setPrevValue] = useState('')
  const [configState, setConfigState] = useState(null)
  const [mathField, setMathField] = useState(null)
  const { currentLanguage } = useContext(LanguageContext)
  const EditorRef = useRef(null)

  useStickyToolbar(toolbarId, EditorRef.current, toolbarContainerRef.current)

  const onRecordingComplete = ({ audioFile, audioUrl }) => {
    window.audioUrl = audioUrl
  }

  const setErrorData = (data) => {
    window.audioError = data
  }

  const { onClickRecordAudio, onClickStopRecording } = useAudioRecorder({
    onChangeRecordingState: () => {},
    onRecordingComplete,
    setErrorData,
  })

  useEffect(() => {
    if (window.jQuery) {
      // add audio plugin
      audioPlugin(FroalaEditor, onClickRecordAudio, onClickStopRecording)
    }
  }, [window?.jQuery])

  const toolbarButtons = getToolbarButtons(
    'STD',
    toolbarSize,
    additionalToolbarOptions,
    buttons
  )
  const toolbarButtonsMD = getToolbarButtons(
    'MD',
    toolbarSize,
    additionalToolbarOptions,
    buttons
  )
  const toolbarButtonsSM = getToolbarButtons(
    'SM',
    toolbarSize,
    additionalToolbarOptions,
    buttons
  )
  const toolbarButtonsXS = getToolbarButtons(
    'XS',
    toolbarSize,
    additionalToolbarOptions,
    buttons
  )
  const specialCharactersSets = getSpecialCharacterSets(customCharacters)
  const initialConfig = Object.assign(
    {
      key: process.env.REACT_APP_FROALA_KEY,
      imageInsertButtons: ['imageUpload'], // hide other image uplaod options
      imageDefaultDisplay: 'inline',
      linkAlwaysBlank: true, // adding to make link always open in blank
      zIndex: 996, // header 999 | dropdown 998 | froala calculate toolbar zIndex - 1
      imageDefaultWidth,
      initOnClick,
      toolbarButtons,
      toolbarButtonsMD,
      toolbarButtonsSM,
      toolbarButtonsXS,
      videoInsertButtons: [
        'videoBack',
        '|',
        'videoByURL',
        'videoEmbed',
        'videoUpload',
      ],
      videoResize: true,
      videoMove: true,
      videoDefaultAlign: 'left',
      videoDefaultWidth: 480,
      videoDefaultDisplay: 'inline',
      tableResizerOffset: 10,
      tableResizingLimit: 50,
      toolbarInline: true,
      toolbarVisibleWithoutSelection: true,
      toolbarContainer: toolbarId
        ? `#froalaToolbarContainer-${toolbarId}`
        : undefined,
      placeholderText: placeholder,
      htmlAllowedEmptyTags: [
        'textarea',
        'a',
        'iframe',
        'object',
        'video',
        'style',
        'script',
        '.fa',
        'span',
        'path',
        'line',
        'textinput',
        'textdropdown',
        'mathinput',
        'mathunit',
        'paragraphnumber',
        'response',
        'specialCharacters',
      ],
      specialCharactersSets,
      fontSize: ['12', '14', '16', '20'],
      fontSizeDefaultSelection: '14',
      htmlAllowedTags: ['.*'],
      htmlAllowedAttrs: ['.*'],
      htmlRemoveTags: ['script'],
      quickInsertEnabled: allowQuickInsert,
      events: {
        click: function (evt) {
          const closestMathParent = evt.currentTarget.closest(
            'span.input__math'
          )
          const paraRemove = evt.currentTarget.closest(
            'span.paragraph-number-remove'
          )
          if (closestMathParent) {
            this.selection.save()
            setCurrentLatex(closestMathParent.getAttribute('data-latex'))
            const mqeditable = closestMathParent.getAttribute('mqeditable')
            setMathModalIsEditable(mqeditable !== 'false')
            setCurrentMathEl(closestMathParent)
            setMathModal(true)
          } else if (paraRemove) {
            paraRemove.parentElement.remove()
            this.selection.save()
            const updatedHtml = reIndexResponses(this.html.get(true))
            if (updatedHtml) {
              this.html.set(updatedHtml)
            }
          } else {
            setCurrentLatex('')
            setCurrentMathEl(null)
          }
        },
        mouseup: function () {
          const range = this.selection.ranges()[0]
          const {
            endContainer,
            startContainer,
            commonAncestorContainer,
          } = range
          if (
            !this.selection.isCollapsed() &&
            (isContainsMathContent(endContainer) ||
              isContainsMathContent(startContainer) ||
              isContainsMathContent(commonAncestorContainer))
          ) {
            // disable font size button
            $("[data-cmd='fontSize']").addClass('fr-disabled')
          } else {
            $("[data-cmd='fontSize']").removeClass('fr-disabled')
          }
        },
        keydown: function (evt) {
          if (evt.which === 8) {
            const range = this.selection.ranges()[0]
            const parent = range.commonAncestorContainer
            const cursorEl = parent.childNodes[range.startOffset - 1]
            if (parent && range.startOffset === range.endOffset) {
              if (!$(cursorEl).length || !cursorEl || !cursorEl.tagName) return

              if (
                [
                  'RESPONSE',
                  'TEXTINPUT',
                  'TEXTDROPDOWN',
                  'MATHINPUT',
                  'PARAGRAPHNUMBER',
                  'MATHUNIT',
                ].includes(cursorEl.tagName)
              ) {
                cursorEl.remove()
                this.selection.save()
                const updatedHtml = reIndexResponses(this.html.get(true))
                if (updatedHtml) {
                  this.html.set(updatedHtml)
                }
                return
              }
              if (
                cursorEl.tagName === 'SPAN' &&
                $(cursorEl).hasClass('input__math') &&
                $(cursorEl).attr('data-latex')
              ) {
                cursorEl.remove()
                return
              }
              return
            }
            if (
              cursorEl &&
              cursorEl.tagName === 'SPAN' &&
              $(cursorEl).hasClass('input__math') &&
              $(cursorEl).attr('data-latex')
            ) {
              cursorEl.remove()
              return
            }
          }
        },
        'video.beforeUpload': function (video) {
          if (
            !canInsert(this.selection.element()) ||
            !canInsert(this.selection.endElement()) ||
            !beforeUpload(video[0], 'video')
          ) {
            return false
          }
          this.video.showProgressBar()
          uploadToS3(video[0], aws.s3Folders.DEFAULT)
            .then((url) => {
              const embedded = `<video class="fr-draggable" src='${url}' controls>Video is not supported on this browser.</video>`
              this.video.insert(embedded)
            })
            .catch((e) => {
              console.error(e)
              this.popups.hideAll()
              notification({ messageKey: 'videoUploadErr' })
            })
          return false
        },
        'video.linkError': function (link) {
          const popup = this.popups.areVisible()
          const layer = popup?.find('.fr-video-progress-bar-layer')
          layer
            ?.find('.fr-message')
            ?.text(
              'The video cannot be added because the address is invalid/unsupported.'
            )
        },
        'video.codeError': function (code) {
          const popup = this.popups.areVisible()
          const layer = popup?.find('.fr-video-progress-bar-layer')
          layer
            ?.find('.fr-message')
            ?.text(
              'The video cannot be added because the embed code is invalid/unsupported.'
            )
        },
        'edit.on': function (e, editor) {
          if (restOptions.readOnly === true) {
            this.edit.off()
            this.$el?.find('.input__math')?.css('pointer-events', 'none')
            this.$el?.find('img')?.css('pointer-events', 'none')
            this.$el?.find('video')?.css('pointer-events', 'none')
          }
        },
        'toolbar.show': function () {
          /**
           * there are no option to change tooltip of toolbar buttons
           * And 'tooltips:flase' option does not work properly on windows and linux
           * So just used this way for now.
           * @see https://snapwiz.atlassian.net/browse/EV-12857
           */
          $('[data-cmd="moreText"]')?.prop('title', 'More Tools')
        },
        'toolbar.hide': function () {
          if (this.hasFocus) {
            return false
          } else {
            return true
          }
        },
        initialized: function () {
          this.hasFocus = false
        },
        focus: function () {
          if (initOnClick) {
            this.hasFocus = true
          }
          if (this.hasFocus && typeof this.handleStickyToolbar === 'function') {
            this.handleStickyToolbar(this, toolbarContainerRef.current)
          }
        },
        blur: function () {
          if (initOnClick) {
            this.hasFocus = false
            if (this.toolbar) {
              this.toolbar.hide()
            }
          }
        },
        'file.beforeUpload': function (files = []) {
          const file = files[0]

          if (!file) {
            this.popups.hideAll()
            notification({ messageKey: 'fileUploadErr' })
            return false
          }

          // currently supporting only pdf through file upload
          if (file.type !== 'application/pdf') {
            this.popups.hideAll()
            notification({ messageKey: 'fileTypeErr' })
            return false
          }

          uploadToS3(file, aws.s3Folders.DEFAULT)
            .then((url) => {
              this.file.insert(url, file.name)
            })
            .catch((e) => {
              console.error(e)
              this.popups.hideAll()
              notification({ messageKey: 'fileUploadErr' })
            })
          return false
        },
        'commands.after': function (cmd) {
          if (cmd === 'moreText') {
            this.toolbarExpanded = !this.toolbarExpanded
            return
          }
          if (
            cmd === 'textinput' ||
            cmd === 'textdropdown' ||
            cmd === 'mathinput' ||
            cmd === 'mathunit' ||
            cmd === 'response' ||
            cmd === 'paragraphNumber'
          ) {
            this.selection.save()
            const updatedHtml = reIndexResponses(this.html.get(true))
            if (updatedHtml) {
              this.html.set(updatedHtml)
            }
          }
        },
      },
    },
    restOptions
  )

  // Math Html related helper functions

  const initMathField = () => {
    if (mathField || !window.MathQuill) return
    if (mathFieldRef.current) {
      const MQ = window.MathQuill.getInterface(2)
      try {
        setMathField(MQ.StaticMath(mathFieldRef.current))
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }
  }

  const setChange = (val) => {
    setContent(val)

    const valueToSave = replaceMathHtmlWithLatexes(val)
    setPrevValue(valueToSave)

    onChange(valueToSave)
  }

  // Math Modal related functions
  const saveMathModal = (latex) => {
    if (!latex) {
      // close the modal and return back if nothing was entered
      setMathModal(false)
      EditorRef.current.selection.restore() // set cursor at the end of content
      return
    }

    EditorRef.current.selection.restore()
    const mathHtml = getMathHtml(latex)
    if (currentMathEl) {
      currentMathEl.innerHTML = mathHtml
      currentMathEl.setAttribute('data-latex', latex)
    } else {
      EditorRef.current.html.insert(
        `<span class="input__math" contenteditable="false" data-latex="${latex}">${mathHtml}</span> `
      )
    }

    // if html is inserted over using editor methods `saveStep` requires to be called
    // to update teh editor. Otherwise `modalChange` wont be triggered!
    EditorRef.current.undo.saveStep()

    setMathModal(false)
  }

  const closeMathModal = () => setMathModal(false)

  // Froala configuration
  const manualControl = ({ getEditor, initialize }) => {
    initialize()
    EditorRef.current = getEditor()
  }

  const hasResponseBoxBtn = () =>
    additionalToolbarOptions.includes('textinput') ||
    additionalToolbarOptions.includes('response') ||
    additionalToolbarOptions.includes('mathinput') ||
    additionalToolbarOptions.includes('mathunit') ||
    additionalToolbarOptions.includes('textdropdown') ||
    additionalToolbarOptions.includes('responseBoxes') ||
    additionalToolbarOptions.includes('paragraphNumber')

  useEffect(() => {
    let toolbarWidth = toolbarContainerRef?.current?.clientWidth
    // if response button is there than subtracting the width of response button
    if (hasResponseBoxBtn()) {
      for (let i = 0; i < additionalToolbarOptions.length; i++) {
        if (i === 3) break
        toolbarWidth -= buttonWidthMap[additionalToolbarOptions[i]]
      }
    }
    /**
     * calculating the toolbar button counts dynamically that can be displayed without moreText and the rest will be displayed
     * in the moreText. Here each button takes the width of 42px and padding of total 31px is given to the right and left of the toolbar container
     * so subtracting the total padding and dividing the remaining width by each button width to get the count of buttons.
     */

    let buttonCounts = Math.floor((toolbarWidth - 31) / 42)

    if (
      initialConfig.toolbarButtons?.moreText?.buttons?.length > buttonCounts
    ) {
      buttonCounts -= 1
    }
    const _toolbarButtons = getToolbarButtons(
      'STD',
      toolbarSize,
      additionalToolbarOptions,
      buttons,
      buttonCounts
    )
    const _toolbarButtonsMD = getToolbarButtons(
      'MD',
      toolbarSize,
      additionalToolbarOptions,
      buttons,
      buttonCounts
    )
    const _toolbarButtonsSM = getToolbarButtons(
      'SM',
      toolbarSize,
      additionalToolbarOptions,
      buttons,
      buttonCounts
    )
    const _toolbarButtonsXS = getToolbarButtons(
      'XS',
      toolbarSize,
      additionalToolbarOptions,
      buttons,
      buttonCounts
    )

    const updatedConfig = {
      ...initialConfig,
      toolbarButtons: _toolbarButtons,
      toolbarButtonsMD: _toolbarButtonsMD,
      toolbarButtonsSM: _toolbarButtonsSM,
      toolbarButtonsXS: _toolbarButtonsXS,
    }

    // for hidden refs wait for it to be shown in the dom to set config.
    if (EditorRef?.current?.offsetParent === null) {
      setConfigState(null)
    } else {
      setConfigState(updatedConfig)
    }
  }, [toolbarContainerRef?.current, advancedAreOpen])

  useEffect(() => {
    // sample extension of custom buttons
    initMathField()
    if (value && hasResponseBoxBtn()) {
      setChange(reIndexResponses(value))
    }
    // Math Input
    FroalaEditor.DefineIcon('math', { NAME: 'math', template: 'math' })
    FroalaEditor.RegisterCommand('math', {
      title: 'Math',
      focus: false,
      undo: false,
      refreshAfterCallback: false,
      callback() {
        EditorRef.current = this
        if (
          !canInsert(this.selection.element()) ||
          !canInsert(this.selection.endElement())
        )
          return false
        this.selection.save()
        setCurrentLatex('')
        setCurrentMathEl(null)
        setMathModal(true)
        this.undo.saveStep()
      },
    })
  }, [])

  useEffect(() => {
    if (mathFieldRef.current) {
      initMathField()
    }
  }, [mathFieldRef.current])

  useEffect(() => {
    // In case of prop updates after onChange, we are gonna ignore that.
    if (!value) {
      setContent('')
      setPrevValue('')
      return
    }

    if (prevValue === value) {
      return
    }
    setPrevValue(value)
    setContent(replaceLatexesWithMathHtml(value))
  }, [value])

  useEffect(() => {
    if (
      value &&
      content &&
      currentLanguage &&
      currentLanguage !== appLanguages.LANGUAGE_EN &&
      hasResponseBoxBtn() &&
      !isValidUpdate(value, content)
    ) {
      // in spanish mode, if they add/remove responseboxes
      // use previous content instead of updated
      setChange(value)
    }
  }, [content])

  useEffect(() => {
    if (editorRef.current && editorRef.current.editor) {
      editorRef.current.editor.opts.placeholderText = placeholder
      editorRef.current.editor.placeholder.refresh()
    }
  }, [placeholder])

  return (
    <>
      <MathModal
        isEditable={mathModalIsEditable}
        show={showMathModal}
        symbols={symbols}
        numberPad={defaultNumberPad}
        showDropdown={false}
        showResposnse={false}
        value={currentLatex}
        onSave={saveMathModal}
        onClose={closeMathModal}
      />
      <BackgroundStyleWrapper
        backgroundColor={configState?.backgroundColor}
        centerContent={centerContent}
        border={border}
        theme={theme}
        fontSize={fontSize}
        className={className}
        editorHeight={editorHeight}
        unsetMaxWidth={unsetMaxWidth}
      >
        {toolbarId && (
          <ToolbarContainer
            id={`froalaToolbarContainer-${toolbarId}`}
            ref={toolbarContainerRef}
            toolbarInline={initialConfig.toolbarInline}
          />
        )}

        {configState && (
          <Editor
            model={content}
            ref={editorRef}
            onModelChange={setChange}
            config={configState}
            onManualControllerReady={manualControl}
          />
        )}
      </BackgroundStyleWrapper>
      <NoneDiv>
        <span ref={mathFieldRef} className="input__math__field" />
      </NoneDiv>
    </>
  )
}

CustomEditor.propTypes = {
  value: PropTypes.string.isRequired,
  toolbarId: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  toolbarSize: PropTypes.oneOf(['STD', 'MD', 'SM', 'XS']),
  additionalToolbarOptions: PropTypes.array,
  customCharacters: PropTypes.array,
  readOnly: PropTypes.bool,
  imageDefaultWidth: PropTypes.number,
  videoDefaultWidth: PropTypes.number,
  initOnClick: PropTypes.bool,
  border: PropTypes.string,
  centerContent: PropTypes.bool,
  editorHeight: PropTypes.number,
}

CustomEditor.defaultProps = {
  toolbarId: null,
  initOnClick: true,
  toolbarSize: 'STD',
  customCharacters: [],
  additionalToolbarOptions: [],
  readOnly: false,
  imageDefaultWidth: 300,
  videoDefaultWidth: 480,
  border: 'none',
  centerContent: false,
  editorHeight: null,
}

const enhance = compose(
  withMathFormula,
  withTheme,
  connect((state) => ({
    advancedAreOpen: state?.assessmentplayerQuestions?.advancedAreOpen,
  }))
)

export default enhance(CustomEditor)
