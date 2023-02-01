import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isEqual, maxBy } from 'lodash'
import next from 'immer'

import { DragDrop, WithResources, measureText } from '@edulastic/common'
import { response } from '@edulastic/constants'

import {
  CHECK,
  CLEAR,
  EDIT,
  SHOW,
} from '../../../../constants/constantsForQuestions'
import {
  setElementsStashAction,
  setStashIndexAction,
} from '../../../../actions/graphTools'

import {
  defaultGraphParameters,
  defaultGridParameters,
  defaultPointParameters,
} from '../../Builder/settings'
import { makeBorder } from '../../Builder'
import { CONSTANT } from '../../Builder/config'

import AnnotationRnd from '../../../Annotations/AnnotationRnd'

import Tools from '../../common/Tools'
import ResponseBox from './ResponseBox'
import { GraphWrapper, JSXBox, ContainerWithResponses } from './styled'
import {
  getAdjustedHeightAndWidth,
  getAdjustedV1AnnotationCoordinatesForRender,
} from '../../common/utils'
import AppConfig from '../../../../../../app-config'
import { roundPointToNearestValue } from '../Utils'

const v1Dimenstions = {
  v1Height: 432,
  v1Width: 720,
}
export const defaultTitleWidth = 150

const { DragPreview, DropContainer } = DragDrop

const getColoredElems = (elements, compareResult) => {
  if (
    compareResult &&
    compareResult.details &&
    compareResult.details.length > 0
  ) {
    const { details } = compareResult
    return elements.map((el) => {
      const detail = details && details.find((det) => det.label.id === el.id)
      let newEl = {}

      if (detail && detail.result) {
        newEl = {
          className: 'correct',
          ...el,
        }
      } else {
        newEl = {
          className: 'incorrect',
          ...el,
        }
      }
      return newEl
    })
  }
  return elements
}

const getCorrectAnswer = (answerArr) => {
  if (Array.isArray(answerArr)) {
    return answerArr.map((el) => ({
      className: 'correct',
      ...el,
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
    if (evaluation[key].result) {
      compareResult = evaluation[key]
    }
  })

  if (compareResult) {
    return compareResult
  }

  return evaluation[0]
}

class AxisLabelsContainer extends PureComponent {
  constructor(props) {
    super(props)

    this.MIN_WIDTH = 500
    this.MIN_HEIGHT = 150

    this._graphId = `jxgbox${Math.random().toString(36).replace('.', '')}`
    this._graph = null

    this.state = {
      resourcesLoaded: false,
    }

    this.updateValues = this.updateValues.bind(this)
    this.graphContainerRef = React.createRef()
    this.axisLabelsContainerRef = React.createRef()
  }

  // -2 done to make room for the border when width is an integer
  // but the actual width is slightly less
  get parentHeight() {
    return this.axisLabelsContainerRef?.current?.clientHeight || 0
  }

  get parentWidth() {
    return this.axisLabelsContainerRef?.current?.clientWidth || 0
  }

  get isHorizontal() {
    const {
      numberlineAxis: { responseBoxPosition },
    } = this.props

    return responseBoxPosition === 'top' || responseBoxPosition === 'bottom'
  }

  get choiceMaxWidth() {
    const { list } = this.props
    const { maxWidth, maxHeight } = response
    const responseDimensions = list.map((value) =>
      measureText(value.text, {
        padding: '0 10px 0 0',
      })
    )
    const maxContentWidth = Math.min(
      maxBy(responseDimensions, (dimension) => dimension?.width)?.width,
      maxWidth
    )

    const maxContentHeight = Math.min(
      maxBy(responseDimensions, (dimension) => dimension?.scrollHeight)
        ?.scrollHeight,
      maxHeight
    )

    if (!this.isHorizontal && defaultTitleWidth > maxContentWidth) {
      return [defaultTitleWidth, maxContentHeight]
    }

    return [maxContentWidth, maxContentHeight]
  }

  get adjustedHeightWidth() {
    const {
      layout,
      numberlineAxis: { responseBoxPosition },
      disableResponse,
    } = this.props

    const [choiceWidth] = this.choiceMaxWidth

    return getAdjustedHeightAndWidth(
      this.parentWidth,
      this.parentHeight,
      layout,
      this.MIN_WIDTH,
      this.MIN_HEIGHT,
      responseBoxPosition,
      choiceWidth,
      disableResponse,
      50
    )
  }

  componentDidMount() {
    const {
      canvas,
      numberlineAxis,
      pointParameters,
      layout,
      gridParams,
      graphData,
      setElementsStash,
      disableResponse,
      view,
      setQuestionData,
    } = this.props

    const adjustedHeightWidth = this.adjustedHeightWidth

    if (view === EDIT) {
      setQuestionData(
        next(graphData, (draft) => {
          draft.prevContSize = adjustedHeightWidth
        })
      )
    }
    this._graph = makeBorder(this._graphId, graphData.graphType)

    if (this._graph) {
      this._graph.setDisableResponse(disableResponse)

      this._graph.resizeContainer(
        adjustedHeightWidth.width,
        adjustedHeightWidth.height
      )
      this._graph.setGraphParameters({
        ...defaultGraphParameters(),
        ...canvas,
      })
      this._graph.setPointParameters({
        ...defaultPointParameters(),
        ...pointParameters,
      })
      this._graph.setGridParameters({
        ...defaultGridParameters(),
        ...gridParams,
      })
      const _layout = {
        ...layout,
        ...adjustedHeightWidth,
      }
      this._graph.updateNumberlineSettings(canvas, numberlineAxis, _layout)

      this._graph.setMarksDeleteHandler()

      this.setElementsToGraph()

      this.setGraphUpdateEventHandler()
      setElementsStash(this._graph.getMarks(), this.getStashId())
    }
  }

  componentDidUpdate(prevProps) {
    const {
      canvas,
      numberlineAxis,
      layout,
      disableResponse,
      previewTab,
      changePreviewTab,
      elements,
      view,
      graphData,
      setQuestionData,
    } = this.props

    const adjustedHeightWidth = this.adjustedHeightWidth
    if (
      !isEqual(graphData.prevContSize, adjustedHeightWidth) &&
      view === EDIT
    ) {
      setQuestionData(
        next(graphData, (draft) => {
          draft.prevContSize = adjustedHeightWidth
        })
      )
    }

    if (this._graph) {
      this._graph.setDisableResponse(disableResponse)

      if (
        !isEqual(canvas, prevProps.canvas) ||
        !isEqual(numberlineAxis, prevProps.numberlineAxis) ||
        !isEqual(layout, prevProps.layout)
      ) {
        const _layout = {
          ...layout,
          ...adjustedHeightWidth,
        }
        this._graph.updateNumberlineSettings(canvas, numberlineAxis, _layout)
      }

      this.setElementsToGraph(prevProps)
    }

    const { disableResponse: prevDisableResponse } = prevProps
    if (disableResponse && prevDisableResponse !== disableResponse) {
      // reset the graph when editResponse is disabled
      this._graph.reset()
    }

    if (
      (previewTab === CHECK || previewTab === SHOW) &&
      !isEqual(elements, prevProps.elements)
    ) {
      changePreviewTab(CLEAR)
    }
  }

  updateValues() {
    const conf = this._graph.getMarks()
    const { setValue, setElementsStash, numberlineAxis, canvas } = this.props
    const { ticksDistance, minorTicks, snapToTicks = false } = numberlineAxis
    const { xMin, xMax } = canvas
    if (snapToTicks && Array.isArray(conf)) {
      conf.forEach((obj) => {
        obj.position = roundPointToNearestValue({
          ticksDistance,
          minorTicks,
          point: obj.position,
          xMin,
          xMax,
        })
      })
    }
    setValue(conf)
    setElementsStash(conf, this.getStashId())
  }

  graphUpdateHandler = () => {
    this.updateValues()
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
  }

  setElementsToGraph = (prevProps = {}) => {
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
    } = this.props

    // correct answers blocks
    if (elementsIsCorrect) {
      this._graph.removeMarksAnswers()
      this._graph.loadMarksAnswers(getCorrectAnswer(elements))
      return
    }

    if (disableResponse) {
      const compareResult = getCompareResult(evaluation)
      const coloredElements = getColoredElems(elements, compareResult)
      this._graph.removeMarks()
      this._graph.removeMarksAnswers()
      this._graph.loadMarksAnswers(coloredElements)
      return
    }

    if (previewTab === CHECK || previewTab === SHOW) {
      const compareResult = getCompareResult(evaluation)
      const coloredElements = getColoredElems(elements, compareResult)
      this._graph.removeMarks()
      this._graph.removeMarksAnswers()
      this._graph.renderMarks(coloredElements)
      return
    }

    if (
      !isEqual(elements, this._graph.getMarks()) ||
      (previewTab === CLEAR &&
        (prevProps.previewTab === CHECK || prevProps.previewTab === SHOW))
    ) {
      this._graph.removeMarks()
      this._graph.removeMarksAnswers()
      this._graph.renderMarks(elements)
    }
  }

  controls = ['undo', 'redo']

  onUndo = () => {
    const { stash, stashIndex, setStashIndex, setValue } = this.props
    const id = this.getStashId()
    if (stashIndex[id] > 0 && stashIndex[id] <= stash[id].length - 1) {
      setValue(stash[id][stashIndex[id] - 1])
      setStashIndex(stashIndex[id] - 1, id)
    }
  }

  onRedo() {
    const { stash, stashIndex, setStashIndex, setValue } = this.props
    const id = this.getStashId()
    if (stashIndex[id] >= 0 && stashIndex[id] < stash[id].length - 1) {
      setValue(stash[id][stashIndex[id] + 1])
      setStashIndex(stashIndex[id] + 1, id)
    }
  }

  getStashId() {
    const { graphData, altAnswerId, view } = this.props
    const type = altAnswerId || view
    return `${graphData.id}_${type}`
  }

  onSelectControl = (control) => {
    switch (control) {
      case 'undo':
        return this.onUndo()
      case 'redo':
        return this.onRedo()
      default:
        return () => {}
    }
  }

  resourcesOnLoaded = () => {
    const { resourcesLoaded } = this.state
    if (resourcesLoaded) {
      return
    }
    this.setState({ resourcesLoaded: true })
    this.setElementsToGraph()
  }

  getMarkValues = () => {
    const { list, elements } = this.props
    return list.filter((elem) => !elements.some((el) => elem.id === el.id))
  }

  getDragValueOffset = (offset) => {
    if (this.graphContainerRef.current && offset) {
      const element = this.graphContainerRef.current
      const { x, y } = element.getBoundingClientRect()
      const px = offset.x - x - 10
      const py = offset.y - y - 10
      return { x: px, y: py }
    }
    return { x: 0, y: 0 }
  }

  handleDropValue = ({ data, itemRect }) => {
    const { width, height, x: clientX, y: clientY } = itemRect
    const d = this.getDragValueOffset({ x: clientX, y: clientY })
    const y = d.y + height / 2
    const x = d.x + width / 2
    if (this._graph.addMark(data, x, y)) {
      this.updateValues()
    }
  }

  render() {
    const {
      layout,
      numberlineAxis: {
        responseBoxPosition,
        separationDistanceX,
        separationDistanceY,
        shuffleAnswerChoices,
      },
      disableResponse,
      view,
      graphData,
      setQuestionData,
      isPrintPreview,
    } = this.props
    const { isV1Migrated, uiStyle } = graphData
    const shuffleChoices = view !== EDIT && shuffleAnswerChoices
    const adjustedHeightWidth = this.adjustedHeightWidth
    const [choiceWidth] = this.choiceMaxWidth

    let _graphData = graphData
    if (isV1Migrated) {
      _graphData = next(graphData, (__graphData) => {
        if (__graphData.annotations) {
          for (const o of __graphData.annotations) {
            const co = getAdjustedV1AnnotationCoordinatesForRender(
              adjustedHeightWidth,
              layout,
              o,
              v1Dimenstions
            )
            o.position.x = co.x
            o.position.y = co.y
            o.size.width = co.width
            o.size.height = co.height
          }
        }
      })
    }

    // +50 is padding between container and choices
    const responseBoxWidth = this.isHorizontal
      ? '100%'
      : `${choiceWidth + 50}px`

    return (
      <div
        data-cy="axis-labels-container"
        ref={this.axisLabelsContainerRef}
        style={{ width: '100%' }}
      >
        <WithResources
          resources={[
            AppConfig.jqueryPath,
            `${AppConfig.katexPath}/katex.min.js`,
          ]}
          fallBack={<span />}
          onLoaded={this.resourcesOnLoaded}
        >
          <span />
        </WithResources>
        <GraphWrapper>
          {!disableResponse && !isPrintPreview && (
            <Tools
              controls={this.controls}
              onSelectControl={this.onSelectControl}
              onSelect={() => {}}
              fontSize={uiStyle?.fontSize}
            />
          )}
          <ContainerWithResponses
            className="jsxbox-with-response-box"
            responseBoxPosition={responseBoxPosition}
          >
            <div
              className={`jsxbox-with-response-box-response-options ${this._graphId}`}
            >
              {!disableResponse && (
                <ResponseBox
                  fontSize={uiStyle?.fontSize}
                  shuffleChoices={shuffleChoices}
                  values={this.getMarkValues()}
                  separationDistanceX={separationDistanceX}
                  separationDistanceY={separationDistanceY}
                  responseBoxWidth={responseBoxWidth}
                  isHorizontal={this.isHorizontal}
                />
              )}
              <div className="jsxbox-with-annotation">
                <div ref={this.graphContainerRef}>
                  <DropContainer
                    noBorder
                    drop={this.handleDropValue}
                    hover={this.handleDraggingValue}
                    style={adjustedHeightWidth}
                  >
                    <JSXBox
                      id={this._graphId}
                      className="jxgbox"
                      margin={layout.margin}
                    />
                  </DropContainer>
                </div>
                <AnnotationRnd
                  question={_graphData}
                  setQuestionData={setQuestionData}
                  disableDragging={view !== EDIT}
                  adjustedHeightWidth={adjustedHeightWidth}
                  layout={layout}
                  bounds={`#${this._graphId}`}
                  v1Dimenstions={v1Dimenstions}
                  noBorder={view !== EDIT}
                />
              </div>
            </div>
          </ContainerWithResponses>
          <DragPreview showPoint centerPoint />
        </GraphWrapper>
      </div>
    )
  }
}

AxisLabelsContainer.propTypes = {
  canvas: PropTypes.object.isRequired,
  numberlineAxis: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired,
  pointParameters: PropTypes.object.isRequired,
  evaluation: PropTypes.any,
  setValue: PropTypes.func.isRequired,
  elements: PropTypes.array.isRequired,
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
}

AxisLabelsContainer.defaultProps = {
  evaluation: null,
  stash: {},
  stashIndex: {},
  altAnswerId: null,
  disableResponse: false,
  previewTab: CLEAR,
  changePreviewTab: () => {},
  elementsIsCorrect: false,
}

export default connect(
  (state, props) => ({
    stash: state.graphTools.stash,
    stashIndex: state.graphTools.stashIndex,
    zoomLevel: props.view === 'edit' ? 1 : state.ui.zoomLevel,
  }),
  {
    setElementsStash: setElementsStashAction,
    setStashIndex: setStashIndexAction,
  }
)(AxisLabelsContainer)
