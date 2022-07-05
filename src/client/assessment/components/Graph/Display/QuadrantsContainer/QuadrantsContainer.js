import { defaultSymbols } from '@edulastic/constants'
import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { cloneDeep, isEqual, sortBy } from 'lodash'
import produce from 'immer'

import { WithResources, notification, EduButton } from '@edulastic/common'
import { greyThemeDark6, darkGrey2, partialIconColor } from '@edulastic/colors'

import {
  CHECK,
  CLEAR,
  EDIT,
  SHOW,
  PREVIEW,
} from '../../../../constants/constantsForQuestions'
import {
  setElementsStashAction,
  setStashIndexAction,
} from '../../../../actions/graphTools'

import { makeBorder } from '../../Builder'
import { CONSTANT } from '../../Builder/config'
import {
  defaultGraphParameters,
  defaultPointParameters,
  defaultAxesParameters,
  defaultGridParameters,
} from '../../Builder/settings'

import AnnotationRnd from '../../../Annotations/AnnotationRnd'

import {
  GraphWrapper,
  JSXBox,
  LabelTop,
  LabelBottom,
  LabelLeft,
  LabelRight,
  Title,
  JSXBoxWrapper,
  JSXBoxWithDrawingObjectsWrapper,
  StyledToolsContainer,
} from './styled'
import Tools from '../../common/Tools'
import GraphEditTools from '../../components/GraphEditTools'
import DrawingObjects from './DrawingObjects'
import { ElementSettingsMenu } from './ElementSettingsMenu'
import AppConfig from '../../../../../../app-config'

const trueColor = '#1fe3a1'
const errorColor = '#ee1658'
const defaultColor = '#434B5D'
const bgColor = greyThemeDark6

// TODO: Add support for user-based colorMap to replace these defaults

const colorMap = (type) => {
  switch (type) {
    case 'point':
      return '#005ce6' // dark blue
    case 'xaxis':
    case 'yaxis':
      return '#434B5D'
    case 'dashed':
      return darkGrey2 // dark bluish grey
    case 'area':
      return '#cc7537' // light brown
    default:
      return defaultColor
  }
}

const getColoredElems = (elements, compareResult) => {
  const { details = [], inequalities = [] } = compareResult || {}
  if (details.length > 0) {
    let newElems = cloneDeep(elements)
    const subElems = []

    newElems = newElems.map((el) => {
      let newEl = {}
      let result = false
      if (!el.subElement && el.type !== CONSTANT.TOOLS.AREA) {
        const detail = details.find((det) => det.id === el.id)
        if (detail && detail.result) {
          newEl = {
            ...el,
            priorityColor: trueColor,
          }
          result = true
        } else {
          newEl = {
            ...el,
            priorityColor: errorColor,
          }
        }

        if (el.subElementsIds) {
          Object.values(el.subElementsIds).forEach((val) => {
            subElems.push({
              id: val,
              result,
            })
          })
        }
        return newEl
      }
      if (el.type === CONSTANT.TOOLS.AREA && inequalities.length > 0) {
        if (inequalities.every((x) => x)) {
          return {
            ...el,
            priorityColor: trueColor,
          }
        }
        if (inequalities.some((x) => x)) {
          return {
            ...el,
            priorityColor: partialIconColor,
          }
        }
        return {
          ...el,
          priorityColor: errorColor,
        }
      }
      return el
    })

    newElems = newElems.map((el) => {
      if (el.subElement) {
        const detail = subElems.find((det) => det.id === el.id)
        let newEl = {}
        if (detail && detail.result) {
          newEl = {
            ...el,
            priorityColor: trueColor,
          }
        } else {
          newEl = {
            ...el,
            priorityColor: errorColor,
          }
        }
        return newEl
      }
      return el
    })
    return newElems
  }
  return elements
}

const getCorrectAnswer = (answerArr) => {
  if (Array.isArray(answerArr)) {
    return answerArr.map((el) => ({
      ...el,
      priorityColor: trueColor,
    }))
  }
  return answerArr
}

const getCompareResult = (evaluation) => {
  if (!evaluation) {
    return null
  }

  let compareResult = null

  Object.keys(evaluation).forEach((key) => {
    if (compareResult) {
      return
    }
    if (evaluation[key].commonResult) {
      compareResult = evaluation[key]
    }
  })

  if (compareResult) {
    return compareResult
  }

  return evaluation[0]
}

class GraphContainer extends PureComponent {
  constructor(props) {
    super(props)

    this._graphId = `jxgbox${Math.random().toString(36).replace('.', '')}`
    this._graph = null

    this.state = {
      selectedTool: this.getDefaultTool(),
      selectedDrawingObject: null,
      elementSettingsAreOpened: false,
      elementId: null,
      resourcesLoaded: false,
    }

    this.onSelectTool = this.onSelectTool.bind(this)
    this.onReset = this.onReset.bind(this)
    this.updateValues = this.updateValues.bind(this)
  }

  getDefaultTool() {
    const { toolbar } = this.props
    const { tools } = toolbar
    return tools?.[0]
  }

  handleElementSettingsMenuOpen = (elementId) =>
    this.setState({ elementSettingsAreOpened: true, elementId })

  handleElementSettingsMenuClose = (
    labelText,
    labelVisibility,
    pointVisibility,
    color,
    notSave = false
  ) => {
    this.setState({ elementSettingsAreOpened: false })

    if (notSave) {
      return
    }

    const { setValue, setElementsStash } = this.props
    const { elementId } = this.state
    const config = this._graph.getConfig()
    const updateElement = config.filter(
      (element) => element.id === elementId
    )[0]

    if (updateElement) {
      updateElement.label = labelText
      updateElement.pointIsVisible = pointVisibility
      updateElement.labelIsVisible = labelVisibility
      updateElement.baseColor = color

      if (updateElement.subElementsIds) {
        Object.values(updateElement.subElementsIds).forEach((subElementId) => {
          const subElement = config.filter(
            (element) => element.id === subElementId
          )[0]
          subElement.baseColor = color
        })
      }

      setValue(config)
      setElementsStash(config, this.getStashId())
    }
  }

  setDefaultToolState() {
    this.setState({ selectedTool: this.getDefaultTool() })
  }

  componentDidMount() {
    const {
      canvas,
      pointParameters,
      xAxesParameters,
      yAxesParameters,
      layout,
      gridParams,
      bgImgOptions,
      backgroundShapes,
      toolbar,
      setElementsStash,
      graphData,
      disableResponse,
      view,
      pointsOnEquEnabled,
    } = this.props

    const { tools } = toolbar
    const { resourcesLoaded } = this.state

    // we should create a graph with whole settings for the first time.
    // @see https://snapwiz.atlassian.net/browse/EV-17315
    const settings = {
      graphParameters: canvas,
      gridParameters: gridParams,
      axesParameters: {
        x: xAxesParameters,
        y: yAxesParameters,
      },
    }

    this._graph = makeBorder(this._graphId, graphData.graphType, settings)

    if (this._graph) {
      if (!this.drawingObjectsAreVisible) {
        this._graph.setTool(tools[0])
      }

      // this._graph.createEditButton(this.handleElementSettingsMenuOpen)
      this._graph.setDisableResponse(disableResponse)

      // if (view === EDIT && !disableResponse) {
      //   this._graph.setEditButtonStatus(false)
      // } else {
      //   this._graph.setEditButtonStatus(true)
      // }

      if (view === EDIT && pointsOnEquEnabled) {
        this._graph.updatePointOnEquEnabled(true)
      } else {
        this._graph.updatePointOnEquEnabled(false)
      }

      this._graph.resizeContainer(layout.width, layout.height)

      this._graph.setPointParameters({
        ...defaultPointParameters(),
        ...pointParameters,
      })

      this.setPriorityColors()

      this._graph.setBgImage(bgImgOptions)
      if (resourcesLoaded) {
        const bgShapeValues = backgroundShapes.values.map((el) => ({
          ...el,
          priorityColor: bgColor,
        }))
        this._graph.setBgObjects(bgShapeValues, backgroundShapes.showPoints)
      }
    }

    this.setGraphUpdateEventHandler()
    setElementsStash(this._graph.getConfig(), this.getStashId())
  }

  componentDidUpdate(prevProps) {
    const {
      canvas,
      pointParameters,
      xAxesParameters,
      yAxesParameters,
      layout,
      gridParams,
      bgImgOptions,
      backgroundShapes,
      disableResponse,
      previewTab,
      changePreviewTab,
      elements,
      evaluation,
      showConnect,
      view,
      pointsOnEquEnabled,
    } = this.props

    const { resourcesLoaded } = this.state

    let refreshElements = false

    // if (JSON.stringify(tools) !== JSON.stringify(prevProps.toolbar.tools)) {
    //   this.setDefaultToolState()
    //   this._graph.setTool(tools[0] || CONSTANT.TOOLS.SEGMENTS_POINT)
    // }

    if (this._graph) {
      this._graph.setDisableResponse(disableResponse)

      // if (view === EDIT && !disableResponse) {
      //   this._graph.setEditButtonStatus(false)
      // } else {
      //   this._graph.setEditButtonStatus(true)
      // }

      if (prevProps.pointsOnEquEnabled !== pointsOnEquEnabled) {
        if (view === EDIT && pointsOnEquEnabled) {
          this._graph.updatePointOnEquEnabled(true)
        } else {
          this._graph.updatePointOnEquEnabled(false)
        }
      }

      if (!isEqual(canvas, prevProps.canvas)) {
        this._graph.setGraphParameters({
          ...defaultGraphParameters(),
          ...canvas,
        })
        refreshElements = true
      }

      if (!isEqual(pointParameters, prevProps.pointParameters)) {
        this._graph.setPointParameters({
          ...defaultPointParameters(),
          ...pointParameters,
        })
      }

      this.setPriorityColors()

      if (
        !isEqual(xAxesParameters, prevProps.xAxesParameters) ||
        !isEqual(yAxesParameters, prevProps.yAxesParameters)
      ) {
        this._graph.setAxesParameters({
          x: {
            ...defaultAxesParameters(),
            ...xAxesParameters,
          },
          y: {
            ...defaultAxesParameters(),
            ...yAxesParameters,
          },
        })
      }

      if (!isEqual(layout, prevProps.layout)) {
        this._graph.resizeContainer(layout.width, layout.height)
      }

      if (!isEqual(gridParams, prevProps.gridParams)) {
        this._graph.setGridParameters({
          ...defaultGridParameters(),
          ...gridParams,
        })
      }

      if (!isEqual(bgImgOptions, prevProps.bgImgOptions)) {
        this._graph.removeBgImage()
        this._graph.setBgImage(bgImgOptions)
      }

      if (
        JSON.stringify(backgroundShapes.values) !==
          JSON.stringify(prevProps.backgroundShapes.values) ||
        backgroundShapes.showPoints !== prevProps.backgroundShapes.showPoints
      ) {
        this._graph.resetBg()
        if (resourcesLoaded) {
          const bgShapeValues = backgroundShapes.values.map((el) => ({
            ...el,
            priorityColor: bgColor,
          }))
          this._graph.setBgObjects(bgShapeValues, backgroundShapes.showPoints)
        }
      }
      if (
        !isEqual(elements, prevProps.elements) ||
        !isEqual(evaluation, prevProps.evaluation) ||
        !isEqual(canvas, prevProps.canvas) ||
        disableResponse !== prevProps.disableResponse
      ) {
        this.setElementsToGraph(prevProps, refreshElements)
      }
    }

    if (
      (previewTab === CHECK || previewTab === SHOW) &&
      !isEqual(elements, prevProps.elements)
    ) {
      changePreviewTab(CLEAR)
    }

    if (
      !disableResponse &&
      (!isEqual(elements, prevProps.elements) ||
        showConnect !== prevProps.showConnect)
    ) {
      this._graph.removeConnectline()
    }
  }

  // Note: Manipulating the data inside the props is considered safe here
  // as there is no change being made to the props value (a reference) in this case
  setPriorityColors() {
    const {
      bgShapes,
      toolbar,
      elements,
      xAxesParameters,
      yAxesParameters,
    } = this.props
    const { drawingPrompt } = toolbar
    if (bgShapes || drawingPrompt === 'byTools') {
      let prev = colorMap()
      elements.forEach((el) => {
        if (el.subElement && prev) {
          el.priorityColor = prev
        } else {
          el.priorityColor = colorMap(el.dashed ? 'dashed' : el.type)
          prev = el.priorityColor
        }
      })
      xAxesParameters.strokeColor = colorMap('xaxis')
      yAxesParameters.strokeColor = colorMap('yaxis')
    } else {
      elements.forEach((el) => {
        el.priorityColor = null
      })
      xAxesParameters.strokeColor = defaultColor
      yAxesParameters.strokeColor = defaultColor
      this._graph.setPriorityColor(null)
    }
  }

  onSelectTool(name) {
    this.setState({ selectedTool: name })
    this._graph.setTool(name)
  }

  onReset() {
    const { toolbar } = this.props
    const { tools } = toolbar

    this.setState({
      selectedTool: this.getDefaultTool(),
    })

    this._graph?.setTool(tools?.[0])
    this._graph?.reset()
    this.updateValues()
  }

  onUndo = () => {
    if (this._graph.cleanToolTempPoints()) {
      return
    }
    const { stash, stashIndex, setStashIndex, setValue } = this.props
    const id = this.getStashId()
    if (stashIndex[id] > 0 && stashIndex[id] <= stash[id].length - 1) {
      setValue(stash[id][stashIndex[id] - 1])
      setStashIndex(stashIndex[id] - 1, id)
    }
  }

  onRedo() {
    if (this._graph.cleanToolTempPoints()) {
      return
    }
    const { stash, stashIndex, setStashIndex, setValue } = this.props
    const id = this.getStashId()
    if (stashIndex[id] >= 0 && stashIndex[id] < stash[id].length - 1) {
      setValue(stash[id][stashIndex[id] + 1])
      setStashIndex(stashIndex[id] + 1, id)
    }
  }

  onDelete() {
    this.selectDrawingObject(null)
    this.setState({ selectedTool: CONSTANT.TOOLS.DELETE })
    this._graph.setTool('trash')
  }

  onEditLabel() {
    this.selectDrawingObject(null)
    this.setState({ selectedTool: CONSTANT.TOOLS.EDIT_LABEL })
    this._graph.setTool(CONSTANT.TOOLS.EDIT_LABEL)
  }

  getStashId() {
    const { graphData, altAnswerId, view, bgShapes } = this.props
    const type = bgShapes ? 'bgShapes' : altAnswerId || view
    return `${graphData.id}_${type}`
  }

  onSelectControl = (control) => {
    switch (control) {
      case CONSTANT.TOOLS.UNDO:
        return this.onUndo()
      case CONSTANT.TOOLS.REDO:
        return this.onRedo()
      case CONSTANT.TOOLS.RESET:
        return this.onReset()
      case CONSTANT.TOOLS.DELETE:
        return this.onDelete()
      case CONSTANT.TOOLS.EDIT_LABEL:
        return this.onEditLabel()
      default:
        return () => {}
    }
  }

  updateValues() {
    const conf = this._graph.getConfig()
    const { setValue, setElementsStash } = this.props

    setValue(conf)
    setElementsStash(conf, this.getStashId())
  }

  graphUpdateHandler = () => {
    this.updateValues()
    this.selectDrawingObject(null)
  }

  setGraphUpdateEventHandler = () => {
    this._graph.events.on(
      CONSTANT.EVENT_NAMES.CHANGE_MOVE,
      this.graphUpdateHandler
    )
    this._graph.events.on(
      CONSTANT.EVENT_NAMES.CHANGE_NEW,
      this.graphUpdateHandler
    )
    this._graph.events.on(
      CONSTANT.EVENT_NAMES.CHANGE_UPDATE,
      this.graphUpdateHandler
    )
    this._graph.events.on(
      CONSTANT.EVENT_NAMES.CHANGE_DELETE,
      this.graphUpdateHandler
    )
    this._graph.events.on(
      CONSTANT.EVENT_NAMES.CHANGE_LABEL,
      this.handleElementSettingsMenuOpen
    )
  }

  setElementsToGraph = (prevProps = {}, refreshElements = false) => {
    const { resourcesLoaded } = this.state
    if (!resourcesLoaded) {
      return
    }

    const {
      elements,
      evaluation,
      disableResponse,
      elementsIsCorrect,
      previewTab,
      toolbar,
      showConnect,
    } = this.props
    const { drawingPrompt } = toolbar

    // correct answers blocks
    if (elementsIsCorrect) {
      this._graph.resetAnswers()
      this._graph.loadAnswersFromConfig(getCorrectAnswer(elements))
      return
    }

    if (disableResponse) {
      const compareResult = getCompareResult(evaluation)
      const coloredElements = getColoredElems(elements, compareResult)
      this._graph.reset()
      this._graph.resetAnswers()
      this._graph.loadAnswersFromConfig(coloredElements)
      if (showConnect) {
        this._graph.connectPoints(coloredElements)
      }
      return
    }

    if (previewTab === CHECK || previewTab === SHOW) {
      const compareResult = getCompareResult(evaluation)
      const coloredElements = getColoredElems(elements, compareResult)
      this._graph.reset()
      this._graph.resetAnswers()
      this._graph.loadFromConfig(coloredElements)
      if (showConnect) {
        this._graph.connectPoints(coloredElements)
      }
      return
    }

    if (
      refreshElements ||
      !isEqual(sortBy(elements), sortBy(this._graph.getConfig())) ||
      (prevProps.toolbar &&
        prevProps.toolbar.drawingPrompt !== drawingPrompt) ||
      (previewTab === CLEAR &&
        (prevProps.previewTab === CHECK || prevProps.previewTab === SHOW))
    ) {
      this._graph.reset()
      this._graph.resetAnswers()
      this._graph.loadFromConfig(elements)
    }
  }

  setEquations = (equations) => {
    const { setValue, setElementsStash, elements } = this.props
    let newElements = cloneDeep(elements)
    newElements = newElements.filter(
      (el) => el.type !== CONSTANT.TOOLS.EQUATION
    )
    newElements.push(...equations)
    setValue(newElements)
    setElementsStash(newElements, this.getStashId())
  }

  allTools = [
    CONSTANT.TOOLS.POINT,
    CONSTANT.TOOLS.SEGMENT,
    CONSTANT.TOOLS.POLYGON,
    CONSTANT.TOOLS.RAY,
    CONSTANT.TOOLS.VECTOR,
    CONSTANT.TOOLS.LINE,
    CONSTANT.TOOLS.CIRCLE,
    CONSTANT.TOOLS.ELLIPSE,
    CONSTANT.TOOLS.PARABOLA,
    CONSTANT.TOOLS.PARABOLA2,
    CONSTANT.TOOLS.HYPERBOLA,
    CONSTANT.TOOLS.SIN,
    CONSTANT.TOOLS.COS,
    CONSTANT.TOOLS.TANGENT,
    CONSTANT.TOOLS.SECANT,
    CONSTANT.TOOLS.POLYNOM,
    CONSTANT.TOOLS.EXPONENT,
    // CONSTANT.TOOLS.EXPONENTIAL2,
    CONSTANT.TOOLS.LOGARITHM,
    CONSTANT.TOOLS.AREA,
    CONSTANT.TOOLS.DASHED,
    CONSTANT.TOOLS.PIECEWISE,
    // CONSTANT.TOOLS.PIECEWISE_LINE,
    // CONSTANT.TOOLS.PIECEWISE_POINT,
    CONSTANT.TOOLS.NO_SOLUTION,
    // CONSTANT.TOOLS.LINE_CUT,
    CONSTANT.TOOLS.AREA2,
  ]

  allControls = [
    CONSTANT.TOOLS.EDIT_LABEL,
    CONSTANT.TOOLS.UNDO,
    CONSTANT.TOOLS.REDO,
    CONSTANT.TOOLS.RESET,
    CONSTANT.TOOLS.DELETE,
  ]

  get drawingObjectsAreVisible() {
    const { view, toolbar } = this.props
    const { drawingPrompt } = toolbar
    return view !== EDIT && drawingPrompt === 'byObjects'
  }

  get getDrawingObjects() {
    const { toolbar = {}, elements } = this.props
    const { drawingObjects = [] } = toolbar
    const { selectedDrawingObject } = this.state

    return drawingObjects.map((item) => ({
      ...item,
      disabled: elements.findIndex((el) => el.id === item.id) > -1,
      selected: !!(
        selectedDrawingObject && selectedDrawingObject.id === item.id
      ),
    }))
  }

  get hasFillArea() {
    const {
      toolbar: { tools = [] },
    } = this.props
    return tools.includes('area')
  }

  get includeDashed() {
    const {
      toolbar: { includeDashed },
    } = this.props
    return includeDashed
  }

  get isShowConnectPoints() {
    const {
      showConnect,
      elements,
      view,
      disableResponse,
      isPrintPreview,
    } = this.props

    return (
      showConnect &&
      !isPrintPreview &&
      view === PREVIEW &&
      !disableResponse &&
      elements.filter((e) => e.type === CONSTANT.TOOLS.POINT && !e.subElement)
        .length > 1
    )
  }

  selectDrawingObject = (drawingObject) => {
    this.setState({ selectedDrawingObject: drawingObject })
    this._graph.setDrawingObject(drawingObject)
  }

  resourcesOnLoaded = () => {
    const { backgroundShapes } = this.props
    const { resourcesLoaded } = this.state
    if (!resourcesLoaded) {
      this.setState({ resourcesLoaded: true }, this.setElementsToGraph)
      const bgShapeValues = backgroundShapes.values.map((el) => ({
        ...el,
        priorityColor: bgColor,
      }))
      this._graph.resetBg()
      this._graph.setBgObjects(bgShapeValues, backgroundShapes.showPoints)
    }
  }

  setTools = (tools) => {
    const { graphData, setQuestionData } = this.props
    if (tools.length > 0) {
      setQuestionData(
        produce(graphData, (draft) => {
          draft.toolbar.tools = tools
        })
      )
    } else {
      notification({ msg: 'at-least 1 tool required', type: 'warning' })
    }
  }

  handleConnectPoint = () => {
    const { elements } = this.props
    this._graph.connectPoints(elements)
  }

  render() {
    const {
      toolbar,
      layout,
      annotation,
      controls,
      bgShapes,
      elements,
      disableResponse,
      view,
      advancedElementSettings,
      graphData,
      setQuestionData,
      isPrintPreview,
      onChangeKeypad,
      symbols,
    } = this.props
    const { tools, drawingPrompt } = toolbar
    const {
      selectedTool,
      elementSettingsAreOpened,
      elementId,
      selectedDrawingObject,
    } = this.state
    const hasAnnotation =
      annotation &&
      (annotation.labelTop ||
        annotation.labelLeft ||
        annotation.labelRight ||
        annotation.labelBottom)

    const equations =
      elements && elements.length
        ? elements.filter((el) => el.type === CONSTANT.TOOLS.EQUATION)
        : []

    return (
      <div data-cy="axis-quadrants-container" style={{ width: '100%' }}>
        <WithResources
          resources={[
            `${AppConfig.jqueryPath}/jquery.min.js`,
            `${AppConfig.katexPath}/katex.min.js`,
          ]}
          fallBack={<span />}
          onLoaded={this.resourcesOnLoaded}
        >
          <span />
        </WithResources>
        <GraphWrapper>
          {annotation && annotation.title && (
            <Title dangerouslySetInnerHTML={{ __html: annotation.title }} />
          )}
          {!disableResponse && !isPrintPreview && (
            <StyledToolsContainer>
              <Tools
                canEditTools={view === EDIT && !bgShapes}
                tools={
                  bgShapes
                    ? this.allTools
                    : this.drawingObjectsAreVisible
                    ? []
                    : tools
                }
                setTools={this.setTools}
                controls={bgShapes ? this.allControls : controls}
                selected={[selectedTool]}
                onSelectControl={this.onSelectControl}
                onSelect={this.onSelectTool}
                fontSize={bgShapes ? '14px' : layout.fontSize}
              />
            </StyledToolsContainer>
          )}
          <JSXBoxWithDrawingObjectsWrapper className="__prevent-page-break">
            {this.drawingObjectsAreVisible && !disableResponse && (
              <DrawingObjects
                selectDrawingObject={this.selectDrawingObject}
                drawingObjects={this.getDrawingObjects}
                showSolutionSet={this.hasFillArea}
                includeDashed={this.includeDashed}
                selectedObj={selectedDrawingObject}
              />
            )}
            <JSXBoxWrapper>
              {annotation && annotation.labelTop && (
                <LabelTop
                  dangerouslySetInnerHTML={{ __html: annotation.labelTop }}
                />
              )}
              {annotation && annotation.labelRight && (
                <LabelRight
                  dangerouslySetInnerHTML={{ __html: annotation.labelRight }}
                />
              )}
              {annotation && annotation.labelLeft && (
                <LabelLeft
                  dangerouslySetInnerHTML={{ __html: annotation.labelLeft }}
                />
              )}
              {annotation && annotation.labelBottom && (
                <LabelBottom
                  dangerouslySetInnerHTML={{ __html: annotation.labelBottom }}
                />
              )}
              <JSXBox
                data-cy="jxgbox"
                id={this._graphId}
                className="jxgbox"
                margin={layout.margin ? layout.margin : hasAnnotation ? 20 : 0}
              />
              {view === EDIT && !bgShapes && !disableResponse && (
                <>
                  <GraphEditTools
                    side="left"
                    graphData={graphData}
                    setQuestionData={setQuestionData}
                    equations={equations}
                    setEquations={this.setEquations}
                    layout={layout}
                    elements={elements}
                    margin={{
                      top: layout.margin
                        ? layout.margin
                        : hasAnnotation
                        ? 20
                        : 0,
                      left: hasAnnotation ? 20 : 0,
                    }}
                    onChangeKeypad={onChangeKeypad}
                    symbols={symbols}
                  />
                  <GraphEditTools
                    side="right"
                    graphData={graphData}
                    setQuestionData={setQuestionData}
                    equations={equations}
                    setEquations={this.setEquations}
                    layout={layout}
                    elements={elements}
                    margin={{
                      top: layout.margin
                        ? layout.margin
                        : hasAnnotation
                        ? 20
                        : 0,
                      left: hasAnnotation ? 20 : 0,
                    }}
                    onChangeKeypad={onChangeKeypad}
                    symbols={symbols}
                  />
                </>
              )}
              <AnnotationRnd
                noBorder={view !== EDIT}
                question={graphData}
                setQuestionData={setQuestionData}
                disableDragging={view !== EDIT}
              />
              {this.isShowConnectPoints && this._graph && (
                <EduButton onClick={this.handleConnectPoint}>
                  Connect Points
                </EduButton>
              )}
              {elementSettingsAreOpened && this._graph && (
                <ElementSettingsMenu
                  showColorPicker={
                    drawingPrompt === 'byObjects' &&
                    view === 'edit' &&
                    !bgShapes
                  }
                  advancedElementSettings={advancedElementSettings}
                  element={
                    this._graph
                      .getConfig()
                      .filter((element) => element.id === elementId)[0]
                  }
                  handleClose={this.handleElementSettingsMenuClose}
                />
              )}
            </JSXBoxWrapper>
          </JSXBoxWithDrawingObjectsWrapper>
        </GraphWrapper>
      </div>
    )
  }
}

GraphContainer.propTypes = {
  canvas: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired,
  pointParameters: PropTypes.object.isRequired,
  xAxesParameters: PropTypes.object.isRequired,
  yAxesParameters: PropTypes.object.isRequired,
  gridParams: PropTypes.object.isRequired,
  bgImgOptions: PropTypes.object.isRequired,
  backgroundShapes: PropTypes.object,
  evaluation: PropTypes.any,
  toolbar: PropTypes.object,
  setValue: PropTypes.func.isRequired,
  elements: PropTypes.array.isRequired,
  bgShapes: PropTypes.bool.isRequired,
  annotation: PropTypes.object,
  controls: PropTypes.array,
  view: PropTypes.string.isRequired,
  setElementsStash: PropTypes.func.isRequired,
  setStashIndex: PropTypes.func.isRequired,
  stash: PropTypes.object,
  stashIndex: PropTypes.object,
  graphData: PropTypes.string.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  altAnswerId: PropTypes.string,
  disableResponse: PropTypes.bool,
  previewTab: PropTypes.string,
  changePreviewTab: PropTypes.func,
  elementsIsCorrect: PropTypes.bool,
  advancedElementSettings: PropTypes.bool,
  onChangeKeypad: PropTypes.func,
  symbols: PropTypes.array,
}

GraphContainer.defaultProps = {
  backgroundShapes: { values: [], showPoints: true },
  advancedElementSettings: false,
  evaluation: null,
  annotation: null,
  controls: [],
  stash: {},
  stashIndex: {},
  altAnswerId: null,
  toolbar: {
    tools: [],
    drawingPrompt: 'byTools',
    drawingObjects: [],
  },
  disableResponse: false,
  previewTab: CLEAR,
  changePreviewTab: () => {},
  elementsIsCorrect: false,
  onChangeKeypad: () => {},
  symbols: defaultSymbols,
}

export default connect(
  (state) => ({
    stash: state.graphTools.stash,
    stashIndex: state.graphTools.stashIndex,
  }),
  {
    setElementsStash: setElementsStashAction,
    setStashIndex: setStashIndexAction,
  }
)(GraphContainer)
