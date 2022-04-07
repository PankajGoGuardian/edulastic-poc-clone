import React, { useState, useEffect, useRef, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import { drawTools } from '@edulastic/constants'
import {
  WithResources,
  MathModal,
  getMathHtml,
  AssessmentPlayerContext,
  AnswerContext,
} from '@edulastic/common'
import * as Sentry from '@sentry/browser'
import { ScratchpadContainer, ZwibblerMain } from './styled'
import ToolBox from '../Tools'
import {
  resetScratchPadDataAction,
  setSelectedNodesAction,
  toggleButtonsAction,
  updateEditModeAction,
  updateScratchpadAction,
  setScratchpadRectAction,
} from '../duck'
import MathTool from './MathTool'
import protractorImg from './assets/protractor.svg'
import centimeterImg from './assets/centimeter.svg'

import AppConfig from '../../../../../app-config'

const lineTypes = [
  drawTools.FREE_DRAW,
  drawTools.DRAW_SIMPLE_LINE,
  drawTools.DRAW_BREAKING_LINE,
  drawTools.DRAW_CURVE_LINE,
]

const textTypes = [drawTools.DRAW_MATH, drawTools.DRAW_TEXT]
function safeZwibblerLoad(zwibbler, data) {
  try {
    zwibbler.load(data)
  } catch (e) {
    try {
      // eslint-disable-next-line no-control-regex
      zwibbler.load(data.replace(/[^\x00-\x80]/g, ''))
    } catch (e2) {
      Sentry.withScope((scope) => {
        scope.setExtra('zwibbler-data', data)
        Sentry.captureException(e2)
      })
    }
  }
}

const Scratchpad = ({
  activeMode,
  deleteMode,
  editMode,
  lineWidth,
  lineColor,
  fillColor,
  fontColor,
  fontFamily,
  fontSize,
  resetScratchpad,
  updateScratchpad,
  setSelectedNodes,
  toggleButtons,
  updateEditMode,
  saveData,
  data,
  dimensions,
  readOnly,
  hideTools,
  clearClicked, // this is from highlight image,
  hideData,
  setScratchpadRect,
  conatinerWidth,
  dimensionsPercent,
  isDropDownInUse,
  scratchpadUpdated,
}) => {
  const [zwibbler, setZwibbler] = useState()
  const [clipBoard, updateClipBoard] = useState()
  const [showMathModal, setShowMathModal] = useState(false)
  const [prevItemIndex, setPrevItemIndex] = useState(null)
  const isDeleteMode = useRef()
  const zwibblerContainer = useRef()
  const zwibblerRef = useRef()
  const mathNodeRef = useRef()
  isDeleteMode.current = deleteMode
  const hideToolBar = readOnly || hideTools
  const { isStudentAttempt, currentItem } = useContext(AssessmentPlayerContext)
  const { isAnswerModifiable, expressGrader } = useContext(AnswerContext)
  const isLineMode = lineTypes.includes(activeMode)

  const [height, width] = useMemo(() => {
    let _height = get(dimensions, 'height', null)
    let _width = get(dimensions, 'width', null)
    if (readOnly && dimensionsPercent !== 100 && _height && _width) {
      _height *= dimensionsPercent / 100
      _width *= dimensionsPercent / 100
    }
    return [_height, _width]
  }, [dimensions, readOnly, dimensionsPercent])

  const toggleProtractor = () => {
    zwibbler.begin()
    const protractor = zwibbler.findNode('protractor')
    if (protractor) {
      zwibbler.deleteNode(protractor)
    } else {
      zwibbler.createNode('ImageNode', {
        url: protractorImg,
        tag: 'protractor',
        rotateAround: [191, 191],
        rotateHandle: [191, -10],
        lockSize: true,
        matrix: [1.7, 0, 0, 1.7, 15, 40],
        zIndex: 1,
      })
    }
    zwibbler.commit(true)
    updateScratchpad({ activeMode: '' })
  }

  const toggleRuler = () => {
    zwibbler.begin()
    const centimeter = zwibbler.findNode('centimeter')
    if (centimeter) {
      zwibbler.deleteNode(centimeter)
    } else {
      zwibbler.createNode('ImageNode', {
        url: centimeterImg,
        tag: 'centimeter',
        rotateAround: [191, 191],
        rotateHandle: [191, -10],
        lockSize: true,
        matrix: [0.7, 0, 0, 0.7, 15, 40],
        zIndex: 1,
      })
    }
    zwibbler.commit(true)
    updateScratchpad({ activeMode: '' })
  }

  const closeMathModal = () => setShowMathModal(false)

  const addLatex = (latex) => {
    if (latex && mathNodeRef.current) {
      const mathHtml = getMathHtml(latex)
      mathNodeRef.current.addLatex(mathHtml, fontColor, fontSize)
      setShowMathModal(false)
      updateScratchpad({ activeMode: '' })
    }
  }

  const useTool = () => {
    if (zwibbler) {
      const options = {
        lineWidth,
        strokeStyle: lineColor,
        fillStyle: isLineMode ? lineColor : fillColor,
      }
      const fontOps = { fontSize, fontName: fontFamily, fillStyle: fontColor }
      mathNodeRef.current = null

      switch (activeMode) {
        case drawTools.FREE_DRAW:
          zwibbler.useBrushTool({ lineWidth, strokeStyle: lineColor })
          break
        case drawTools.DRAW_SIMPLE_LINE:
          zwibbler.useLineTool(options, { singleLine: true })
          break
        case drawTools.DRAW_BREAKING_LINE:
          zwibbler.useLineTool(options)
          break
        case drawTools.DRAW_CURVE_LINE:
          zwibbler.useCurveTool(options)
          break
        case drawTools.DRAW_SQUARE:
          zwibbler.useRectangleTool(options)
          break
        case drawTools.DRAW_CIRCLE:
          zwibbler.useCircleTool(options)
          break
        case drawTools.DRAW_TEXT:
          zwibbler.useTextTool(fontOps)
          break
        case drawTools.DRAW_TRIANGLE:
          zwibbler.usePolygonTool(3, 0, 1.0, options)
          break
        case drawTools.DRAW_PROTRACTOR:
          toggleProtractor()
          break
        case drawTools.DRAW_RULER_TOOL:
          toggleRuler()
          break
        case drawTools.DRAW_MATH: {
          mathNodeRef.current = new MathTool({ ctx: zwibbler })
          zwibbler.useCustomTool(mathNodeRef.current)
          break
        }
        default:
          zwibbler.usePickTool()
          break
      }
    }
  }

  useEffect(useTool, [activeMode])

  useEffect(() => {
    if (zwibbler) {
      zwibbler.setToolProperty('lineWidth', lineWidth)
      zwibbler.setToolProperty('strokeStyle', lineColor)
      zwibbler.setToolProperty('fillStyle', fillColor)
      zwibbler.setToolProperty('fontName', fontFamily)
      zwibbler.setNodeProperty(
        zwibbler.getSelectedNodes(),
        'fontSize',
        fontSize
      )
      if (
        activeMode === drawTools.FREE_DRAW ||
        activeMode === drawTools.DRAW_SIMPLE_LINE ||
        activeMode === drawTools.DRAW_BREAKING_LINE ||
        activeMode === drawTools.DRAW_CURVE_LINE
      ) {
        zwibbler.setToolProperty('fillStyle', lineColor)
      }
    }
  }, [lineWidth, lineColor, fillColor, fontFamily, fontSize])

  useEffect(() => {
    if (zwibbler && textTypes.includes(activeMode)) {
      zwibbler.setToolProperty('fillStyle', fontColor)
    }
  }, [fontColor])

  useEffect(() => {
    switch (editMode) {
      case drawTools.UNDO_TOOL:
        zwibbler?.undo()
        break
      case drawTools.REDO_TOOL:
        zwibbler?.redo()
        break
      case drawTools.MOVE_FORWARD:
        zwibbler?.bringToFront()
        break
      case drawTools.MOVE_BEHIND:
        zwibbler?.sendToBack()
        break
      case drawTools.COPY:
        updateClipBoard(zwibbler?.copy(true))
        break
      case drawTools.CUT:
        updateClipBoard(zwibbler?.cut(true))
        break
      case drawTools.PASTE:
        zwibbler?.paste(clipBoard)
        break
      default:
        break
    }
    if (editMode) {
      updateEditMode({ editMode: '' })
    }
  }, [editMode])

  const onClickHandler = () => {
    if (zwibbler && !deleteMode && !readOnly) {
      setSelectedNodes(
        zwibbler.getSelectedNodes().map((id) => {
          const {
            type,
            props: { closed },
          } = zwibbler.getNodeObject(id)
          if (type === 'PathNode' && !closed) {
            return 'BrushNode'
          }
          return type
        })
      )
      if (
        activeMode &&
        activeMode !== drawTools.FREE_DRAW &&
        activeMode !== drawTools.DRAW_TEXT &&
        activeMode !== drawTools.DRAW_MATH &&
        isEmpty(zwibbler.getSelectedNodes())
      ) {
        useTool()
      }
      if (activeMode === drawTools.DRAW_MATH) {
        setShowMathModal(true)
      }
    }
  }

  useEffect(() => {
    if (window.$ && window.Zwibbler && zwibblerRef.current) {
      window.Zwibbler.component('MathNode', {
        defaults: {},
        template: `<span z-html="props.htmlStr"></span>`,
      })
      // initialize Zwibbler
      const newZwibbler = window.Zwibbler.create(zwibblerRef.current, {
        showToolbar: false,
        showColourPanel: false,
        showHints: false,
        scrollbars: false,
        readOnly,
        setFocus: false, // Zwibbler will be unable to intercept any keyboard commands
        allowZoom: !isStudentAttempt,
        allowTextInShape: false, // Zwibbler to write text inside a closed shapes @see EV-29941
        leaveTextToolOnBlur: true, // Zwibbler text tool data will be saved if user moves out of scratchpad
      })
      newZwibbler.on('node-clicked', (node) => {
        if (isDeleteMode.current) {
          newZwibbler.deleteNode(node)
        }
      })

      newZwibbler.on('document-changed', () => {
        if (newZwibbler.dirty()) {
          saveData(newZwibbler.save('zwibbler3'))
        }
        const spUpdated =
          scratchpadUpdated || newZwibbler.canUndo() || newZwibbler.canRedo()
        toggleButtons({
          canRedo: newZwibbler.canRedo(),
          canUndo: newZwibbler.canUndo(),
          scratchpadUpdated: spUpdated,
        })
      })
      newZwibbler.on('paste', () => {
        // preventing pasting of images currently
        return false
      })
      setZwibbler(newZwibbler)
      if (isStudentAttempt && !readOnly) {
        const zwibblerDomRect = zwibblerRef.current.getBoundingClientRect()
        setScratchpadRect({
          top: zwibblerDomRect.top,
          left: zwibblerDomRect.left,
          width: zwibblerDomRect.width,
          height: zwibblerDomRect.height,
        })
      }
    }
    return () => {
      setZwibbler(null)
      resetScratchpad()
    }
  }, [])

  useEffect(() => {
    if (clearClicked && zwibbler) {
      zwibbler.newDocument()
      resetScratchpad()
    }
  }, [clearClicked])

  useEffect(() => {
    // load saved user work from backend initially
    if (zwibbler) {
      /**
       * during student attempt (assessment player, practice player)
       * @see https://snapwiz.atlassian.net/browse/EV-17241
       */
      if (isStudentAttempt && prevItemIndex !== currentItem && data) {
        safeZwibblerLoad(zwibbler, data)
        setPrevItemIndex(currentItem)
      } else if (isStudentAttempt && prevItemIndex !== currentItem && !data) {
        zwibbler.newDocument()
        setPrevItemIndex(currentItem)
      } else if (data && (readOnly || expressGrader)) {
        /**
         * readonly mode views (lcb, expressGrader(edit response off), etc...)
         */
        safeZwibblerLoad(zwibbler, data)
      }
    }
  }, [data, zwibbler, currentItem])

  useEffect(() => {
    if (expressGrader && zwibbler) {
      zwibbler.setConfig('readOnly', !isAnswerModifiable)
    }
  }, [isAnswerModifiable, expressGrader])

  useEffect(() => {
    // handle dimension change such as zoom in/out or window resize
    if (zwibbler) {
      zwibbler.resize()
    }
    if (
      (isStudentAttempt || expressGrader) &&
      !readOnly &&
      zwibblerRef.current
    ) {
      const zwibblerDomRect = zwibblerRef.current.getBoundingClientRect()
      setScratchpadRect({
        top: zwibblerDomRect.top,
        left: zwibblerDomRect.left,
        width: zwibblerDomRect.width,
        height: zwibblerDomRect.height,
      })
    }
  }, [width, height, conatinerWidth])

  return (
    <ScratchpadContainer
      ref={zwibblerContainer}
      hideData={hideData}
      isDropDownInUse={isDropDownInUse}
    >
      {!hideToolBar && <ToolBox />}
      <ZwibblerMain
        deleteMode={deleteMode}
        id="zwibbler-main"
        ref={zwibblerRef}
        onClick={onClickHandler}
        onTouchStart={onClickHandler}
        hideToolBar={hideToolBar}
        readOnly={readOnly}
        height={height}
        width={width}
      />
      <MathModal
        value=""
        isEditable
        show={showMathModal}
        width="420px"
        showDropdown
        onSave={addLatex}
        onClose={closeMathModal}
      />
    </ScratchpadContainer>
  )
}

const EnhancedComponent = compose(
  connect(
    (state) => ({
      fillColor: state.scratchpad.fillColor,
      lineColor: state.scratchpad.lineColor,
      lineWidth: state.scratchpad.lineWidth,
      fontFamily: state.scratchpad.fontFamily,
      fontSize: state.scratchpad.fontSize,
      fontColor: state.scratchpad.fontColor,
      activeMode: state.scratchpad.activeMode,
      deleteMode: state.scratchpad.deleteMode,
      editMode: state.scratchpad.editMode,
      hideData: state.scratchpad.hideData,
      dimensionsPercent: state.scratchpad.dimensionsPercent,
      scratchpadUpdated: state.scratchpad.scratchpadUpdated,
      isDropDownInUse: state.ui.isDropDownInUse,
    }),
    {
      toggleButtons: toggleButtonsAction,
      resetScratchpad: resetScratchPadDataAction,
      setSelectedNodes: setSelectedNodesAction,
      updateEditMode: updateEditModeAction,
      updateScratchpad: updateScratchpadAction,
      setScratchpadRect: setScratchpadRectAction,
    }
  )
)(Scratchpad)

Scratchpad.propTypes = {
  saveData: PropTypes.func,
  data: PropTypes.string,
  hideTools: PropTypes.bool,
  readOnly: PropTypes.bool,
  isDropDownInUse: PropTypes.bool,
}

Scratchpad.defaultProps = {
  saveData: () => null,
  readOnly: false,
  hideTools: false,
  data: '',
  isDropDownInUse: false,
}

/**
 * @param {func} saveData Returns scratchpad data
 * @param {string} data scratchpad data
 * @param {boolean} hideTools hide scratchpad tool, you will need to use it separately. see highlight image.
 * @param {boolean} readOnly used to show student response, ex; LCB
 */
const ScratchpadWithResources = (props) => (
  <WithResources
    criticalResources={[`${AppConfig.jqueryPath}/jquery.min.js`]}
    resources={[`${AppConfig.zwibbler2Path}/zwibbler2.js`]}
    fallBack={<span />}
  >
    <EnhancedComponent {...props} />
  </WithResources>
)

export default ScratchpadWithResources
