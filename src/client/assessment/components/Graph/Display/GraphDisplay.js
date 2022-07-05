import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withTheme } from 'styled-components'
import { compose } from 'redux'
import { round, isEqual } from 'lodash'
import loadable from '@loadable/component'
import Progress from '@edulastic/common/src/components/Progress'
import { defaultSymbols } from '@edulastic/constants'

import { fractionStringToNumber, getFontSize } from '../../../utils/helpers'
import { CLEAR } from '../../../constants/constantsForQuestions'
import { setQuestionDataAction } from '../../../../author/src/actions/question'
import { smallestZoomLevel } from '../../../../common/utils/static/zoom'
import { ifZoomed } from '../../../../common/utils/helpers'
import { MIN_SNAP_SIZE } from '../Builder/config/constants'
import GraphInView from './GraphInView'

const QuadrantsContainer = loadable(() =>
  import('./QuadrantsContainer/QuadrantsContainer')
)

const PlacementContainer = loadable(() =>
  import('./PlacementContainer/PlacementContainer')
)

const AxisSegmentsContainer = loadable(() =>
  import('./AxisSegmentsContainer/AxisSegmentsContainer')
)

const AxisLabelsContainer = loadable(() =>
  import('./AxisLabelsContainer/AxisLabelsContainer')
)

const NumberLinePlot = loadable(() =>
  import('./NumberLinePlot/NumberLinePlotContainer')
)

const graphDimensionsMultiplierHashMap = {
  sm: 1.5,
  md: 1.75,
  lg: 2.5,
  xl: 3,
}

const MIN_GAP = 30

const safeParseFloat = (val) => {
  if (val) {
    return parseFloat(val)
  }
  return 1
}

const getSnapSize = (snapTo, axisDistance) => {
  if (snapTo) {
    if (axisDistance) return axisDistance
    return 1 // default
  }
  return MIN_SNAP_SIZE
}

class GraphDisplay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      graphIsValid: false,
    }
  }

  componentDidMount() {
    this.validateGraph()
  }

  componentDidUpdate(prevProps) {
    const { graphData } = this.props
    if (graphData !== prevProps.graphData) {
      this.validateGraph()
    }
  }

  getGraphDimensions = (defaultStyle, numberlineAxis = {}) => {
    const { theme = {} } = this.props
    const zoomLevel = theme?.zoomLevel || smallestZoomLevel

    let multiplier = 1
    let fontSize = numberlineAxis?.fontSize || 14

    if (ifZoomed(zoomLevel)) {
      multiplier = graphDimensionsMultiplierHashMap[zoomLevel]
      fontSize = theme?.fontSize || fontSize
    }

    // jsxGraph requires number for fontSize
    if (fontSize?.toString()?.includes('rem')) {
      const bodyFontSize = window.getComputedStyle(document.body).fontSize
      fontSize = parseFloat(bodyFontSize) * parseFloat(fontSize)
    }

    if (fontSize?.toString()?.includes('px')) {
      fontSize = parseFloat(fontSize)
    }

    return {
      width: defaultStyle.layoutWidth,
      height: defaultStyle.layoutHeight,
      fontSize,
      multiplier,
    }
  }

  validateNumberline = () => {
    const { graphData } = this.props
    const { canvas, uiStyle } = graphData
    const { graphIsValid } = this.state

    const { width = 0, height = 0 } = this.getGraphDimensions(uiStyle)

    const parsedGraphData = {
      width: width ? parseInt(width, 10) : width,
      height: height ? parseInt(height, 10) : height,
      xMin: canvas.xMin ? parseFloat(canvas.xMin, 10) : canvas.xMin,
      xMax: canvas.xMax ? parseFloat(canvas.xMax, 10) : canvas.xMax,
    }

    if (
      parsedGraphData.width === 0 ||
      parsedGraphData.height === 0 ||
      parsedGraphData.xMin >= parsedGraphData.xMax ||
      parsedGraphData.xMin.length === 0 ||
      parsedGraphData.xMax.length === 0 ||
      parsedGraphData.width.length === 0 ||
      parsedGraphData.height.length === 0
    ) {
      if (graphIsValid) {
        this.setState({ graphIsValid: false })
      }
    } else if (!graphIsValid) {
      this.setState({ graphIsValid: true })
    }
  }

  validateQuadrants = () => {
    const { graphData } = this.props
    const { canvas, uiStyle } = graphData
    const { graphIsValid } = this.state

    const { width = 0, height = 0 } = this.getGraphDimensions(uiStyle)

    const parsedGraphData = {
      width: width ? parseInt(width, 10) : width,
      height: height ? parseInt(height, 10) : height,
      xMin: canvas.xMin ? parseFloat(canvas.xMin, 10) : canvas.xMin,
      xMax: canvas.xMax ? parseFloat(canvas.xMax, 10) : canvas.xMax,
      yMin: canvas.yMin ? parseFloat(canvas.yMin, 10) : canvas.yMin,
      yMax: canvas.yMax ? parseFloat(canvas.yMax, 10) : canvas.yMax,
    }

    if (
      parsedGraphData.width === 0 ||
      parsedGraphData.height === 0 ||
      parsedGraphData.xMin >= parsedGraphData.xMax ||
      parsedGraphData.yMin >= parsedGraphData.yMax ||
      parsedGraphData.xMin.length === 0 ||
      parsedGraphData.xMax.length === 0 ||
      parsedGraphData.yMin.length === 0 ||
      parsedGraphData.yMax.length === 0 ||
      parsedGraphData.width.length === 0 ||
      parsedGraphData.height.length === 0
    ) {
      if (graphIsValid) {
        this.setState({ graphIsValid: false })
      }
    } else if (!graphIsValid) {
      this.setState({ graphIsValid: true })
    }
  }

  validateGraph = () => {
    const { graphData } = this.props
    const { graphType } = graphData

    switch (graphType) {
      case 'axisSegments':
      case 'numberLinePlot':
      case 'axisLabels':
        this.validateNumberline()
        break
      case 'quadrants':
      case 'firstQuadrant':
      case 'quadrantsPlacement':
      default:
        this.validateQuadrants()
    }
  }

  getGraphContainer = () => {
    const { graphData, bgShapes } = this.props
    const { graphType } = graphData

    switch (graphType) {
      case 'axisSegments':
        return AxisSegmentsContainer
      case 'numberLinePlot':
        return NumberLinePlot
      case 'axisLabels':
        return AxisLabelsContainer
      case 'quadrantsPlacement':
        return !bgShapes ? PlacementContainer : QuadrantsContainer
      case 'quadrants':
      case 'firstQuadrant':
      default:
        return QuadrantsContainer
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { inLCB, isExpressGrader, tReady, windowHeight } = this.props
    const { graphIsValid } = this.state
    // a perf optimization done in LCB view to avoid unresponsive question view.
    // without this, for every update graph re-rendering causing freezing
    // we are checking graphData.activity,graphData.elements,bgShapes for change
    // TODO: re-factor graph components to be more efficient in other parts of app
    if (
      inLCB &&
      !isExpressGrader &&
      this.props?.graphData &&
      isEqual(
        nextProps?.graphData?.activity,
        this.props?.graphData?.activity
      ) &&
      isEqual(nextProps?.bgShapes, this.props?.bgShapes) &&
      tReady === nextProps.tReady &&
      windowHeight === nextProps.windowHeight &&
      graphIsValid === nextState.graphIsValid
    ) {
      return false
    }

    return true
  }

  getGraphContainerProps = () => {
    const { graphData } = this.props
    const { graphType } = graphData

    switch (graphType) {
      case 'axisSegments':
        return this.getAxisSegmentsProps()
      case 'numberLinePlot':
        return this.getNumberlinePlotProps()
      case 'axisLabels':
        return this.getAxisLabelsProps()
      case 'quadrants':
      case 'firstQuadrant':
      case 'quadrantsPlacement':
      default:
        return this.getQuadrantsProps()
    }
  }

  getCanvas = (width, height) => {
    const { graphData } = this.props
    const { uiStyle, canvas } = graphData
    const { xRadians, yRadians } = uiStyle

    // Canvas Size
    let xMin = xRadians
      ? round(Math.PI * parseFloat(canvas.xMin), 2)
      : parseFloat(canvas.xMin)
    let xMax = xRadians
      ? round(Math.PI * parseFloat(canvas.xMax), 2)
      : parseFloat(canvas.xMax)
    let yMin = yRadians
      ? round(Math.PI * parseFloat(canvas.yMin), 2)
      : parseFloat(canvas.yMin)
    let yMax = yRadians
      ? round(Math.PI * parseFloat(canvas.yMax), 2)
      : parseFloat(canvas.yMax)

    // Grid Distance
    const xDistance = xRadians
      ? round(Math.PI / safeParseFloat(uiStyle.xDistance), 2)
      : safeParseFloat(uiStyle.xDistance)
    const yDistance = yRadians
      ? round(Math.PI / safeParseFloat(uiStyle.yDistance), 2)
      : safeParseFloat(uiStyle.yDistance)

    if (!xRadians) {
      const xGap = width / ((xMax - xMin) / xDistance)
      if (xGap < MIN_GAP) {
        xMin -= MIN_GAP / xGap
        xMax += MIN_GAP / xGap
      }
    }

    if (!yRadians) {
      const yGap = height / ((yMax - yMin) / yDistance)
      if (yGap < MIN_GAP) {
        yMin -= MIN_GAP / yGap
        yMax += MIN_GAP / yGap
      }
    }

    return [xMin, xMax, yMin, yMax, xDistance, yDistance]
  }

  getQuadrantsProps = () => {
    const {
      view,
      previewTab,
      changePreviewTab,
      graphData,
      evaluation,
      onChange,
      elements,
      bgShapes,
      altAnswerId,
      disableResponse,
      elementsIsCorrect,
      advancedElementSettings,
      setQuestionData,
      onChangeKeypad,
      symbols,
      pointsOnEquEnabled,
    } = this.props

    const {
      uiStyle,
      backgroundImage,
      background_shapes,
      toolbar,
      controlbar,
      annotation,
      graphType,
      list,
      showConnect,
    } = graphData

    const {
      showGrid = true,
      xShowAxis = true,
      yShowAxis = true,
      drawLabelZero = true,
      xRadians,
      yRadians,
    } = uiStyle

    const { width = 0, height = 0 } = this.getGraphDimensions(uiStyle)
    const [xMin, xMax, yMin, yMax, xDistance, yDistance] = this.getCanvas(
      width,
      height
    )

    return {
      canvas: {
        xMin: xMin - xDistance,
        xMax: xMax + xDistance,
        yMin: yMin - yDistance,
        yMax: yMax + yDistance,
      },
      layout: {
        width,
        margin: uiStyle.layoutMargin,
        height,
        snapTo: uiStyle.layoutSnapto,
        fontSize: getFontSize(uiStyle.fontSize, false),
      },
      pointParameters: {
        snapToGrid: true,
        snapSizeX: getSnapSize(uiStyle.layoutSnapto, xDistance),
        snapSizeY: getSnapSize(uiStyle.layoutSnapto, yDistance),
        showInfoBox: uiStyle.displayPositionOnHover,
        withLabel: false,
        size: uiStyle.displayPositionPoint === false ? 0 : 3,
      },
      xAxesParameters: {
        ticksDistance: safeParseFloat(uiStyle.xTickDistance),
        name: uiStyle.xShowAxisLabel ? uiStyle.xAxisLabel : '',
        showTicks: !uiStyle.xHideTicks,
        drawLabels: uiStyle.xDrawLabel,
        maxArrow: uiStyle.xMaxArrow,
        minArrow: uiStyle.xMinArrow,
        arrowSize: 5,
        commaInLabel: uiStyle.xCommaInLabel,
        showAxis: xShowAxis,
        drawZero: drawLabelZero,
        useRadians: xRadians,
      },
      yAxesParameters: {
        ticksDistance: safeParseFloat(uiStyle.yTickDistance),
        name: uiStyle.yShowAxisLabel ? uiStyle.yAxisLabel : '',
        showTicks: !uiStyle.yHideTicks,
        drawLabels: uiStyle.yDrawLabel,
        maxArrow: uiStyle.yMaxArrow,
        minArrow: uiStyle.yMinArrow,
        arrowSize: 5,
        commaInLabel: uiStyle.yCommaInLabel,
        showAxis: yShowAxis,
        drawZero: drawLabelZero && !xShowAxis,
        useRadians: yRadians,
      },
      gridParams: {
        gridX: xDistance,
        gridY: yDistance,
        showGrid,
      },
      bgImgOptions: {
        urlImg: backgroundImage.src,
        opacity: backgroundImage.opacity / 100,
        coords: [backgroundImage.x, backgroundImage.y],
        size: [backgroundImage.width, backgroundImage.height],
      },
      backgroundShapes: {
        values: bgShapes ? [] : background_shapes || [],
        showPoints: !!backgroundImage.showShapePoints,
      },
      evaluation,
      toolbar,
      controls: controlbar ? controlbar.controls : [],
      setValue: onChange,
      elements,
      graphType:
        bgShapes && graphType === 'quadrantsPlacement'
          ? 'quadrants'
          : graphType,
      bgShapes,
      annotation,
      altAnswerId,
      view,
      previewTab,
      changePreviewTab,
      disableResponse,
      elementsIsCorrect,
      list,
      advancedElementSettings,
      setQuestionData,
      graphData,
      onChangeKeypad,
      symbols,
      showConnect,
      pointsOnEquEnabled,
    }
  }

  getAxisSegmentsProps = () => {
    const {
      view,
      previewTab,
      changePreviewTab,
      graphData,
      evaluation,
      onChange,
      elements,
      altAnswerId,
      disableResponse,
      elementsIsCorrect,
      setQuestionData,
    } = this.props

    const { uiStyle, canvas, toolbar, numberlineAxis } = graphData

    const { width = 0, height = 0, fontSize } = this.getGraphDimensions(
      uiStyle,
      numberlineAxis
    )

    return {
      canvas: {
        xMin: parseFloat(canvas.xMin),
        xMax: parseFloat(canvas.xMax),
        yMin: parseFloat(
          uiStyle.orientation === 'vertical' ? canvas.xMin : canvas.yMin
        ),
        yMax: parseFloat(
          uiStyle.orientation === 'vertical' ? canvas.xMax : canvas.yMax
        ),
        numberline: true,
        margin: parseFloat(canvas.margin),
        responsesAllowed: parseInt(canvas.responsesAllowed, 10) || 1,
        title: canvas.title,
      },
      numberlineAxis: {
        leftArrow: numberlineAxis && numberlineAxis.leftArrow,
        rightArrow: numberlineAxis && numberlineAxis.rightArrow,
        showTicks: numberlineAxis && numberlineAxis.showTicks,
        snapToTicks: numberlineAxis && numberlineAxis.snapToTicks,
        showMin: numberlineAxis && numberlineAxis.showMin,
        showMax: numberlineAxis && numberlineAxis.showMax,
        ticksDistance:
          numberlineAxis &&
          fractionStringToNumber(numberlineAxis.ticksDistance),
        fontSize,
        stackResponses: numberlineAxis && numberlineAxis.stackResponses,
        stackResponsesSpacing:
          numberlineAxis && parseInt(numberlineAxis.stackResponsesSpacing, 10),
        renderingBase: numberlineAxis && numberlineAxis.renderingBase,
        specificPoints: numberlineAxis && numberlineAxis.specificPoints,
        fractionsFormat: numberlineAxis && numberlineAxis.fractionsFormat,
        minorTicks: numberlineAxis && parseFloat(numberlineAxis.minorTicks),
        showLabels: numberlineAxis && numberlineAxis.showLabels,
        labelShowMax: numberlineAxis && numberlineAxis.labelShowMax,
        labelShowMin: numberlineAxis && numberlineAxis.labelShowMin,
      },
      layout: {
        width,
        margin: uiStyle.layoutMargin,
        height,
        snapTo: uiStyle.layoutSnapto,
        orientation: uiStyle.orientation || 'horizontal',
        fontSize: getFontSize(uiStyle.fontSize, false),
        titlePosition: parseInt(uiStyle.titlePosition, 10),
        linePosition: numberlineAxis.stackResponses
          ? 75
          : parseInt(uiStyle.linePosition, 10),
        pointBoxPosition: parseInt(uiStyle.pointBoxPosition, 10),
      },
      pointParameters: {
        snapToGrid: true,
        snapSizeX: getSnapSize(
          uiStyle.layoutSnapto,
          parseFloat(uiStyle.xDistance)
        ),
        snapSizeY: getSnapSize(
          uiStyle.layoutSnapto,
          parseFloat(uiStyle.yDistance)
        ),
        showInfoBox: uiStyle.displayPositionOnHover,
        withLabel: false,
      },
      xAxesParameters: {
        ticksDistance: safeParseFloat(uiStyle.xTickDistance),
        name: uiStyle.xShowAxisLabel ? uiStyle.xAxisLabel : '',
        showTicks: !uiStyle.xHideTicks,
        drawLabels: uiStyle.xDrawLabel,
        maxArrow: uiStyle.xMaxArrow,
        minArrow: uiStyle.xMinArrow,
        commaInLabel: uiStyle.xCommaInLabel,
        strokeColor: uiStyle.xStrokeColor ? uiStyle.xStrokeColor : '#434B5D',
        tickEndings: uiStyle.xTickEndings ? uiStyle.xTickEndings : false,
      },
      yAxesParameters: {
        ticksDistance: safeParseFloat(uiStyle.yTickDistance),
        name: uiStyle.yShowAxisLabel ? uiStyle.yAxisLabel : '',
        showTicks: !uiStyle.yHideTicks,
        drawLabels: uiStyle.yDrawLabel,
        maxArrow: uiStyle.yMaxArrow,
        minArrow: uiStyle.yMinArrow,
        commaInLabel: uiStyle.yCommaInLabel,
        minorTicks: uiStyle.yMinorTicks ? uiStyle.yMinorTicks : 0,
      },
      gridParams: {
        gridY: safeParseFloat(uiStyle.yDistance),
        gridX: safeParseFloat(uiStyle.xDistance),
        showGrid: false,
      },
      evaluation,
      tools: toolbar ? toolbar.tools : [],
      setValue: onChange,
      elements,
      altAnswerId,
      view,
      previewTab,
      changePreviewTab,
      disableResponse,
      elementsIsCorrect,
      setQuestionData,
      graphData,
    }
  }

  getNumberlinePlotProps = () => {
    const {
      view,
      previewTab,
      changePreviewTab,
      graphData,
      evaluation,
      onChange,
      elements,
      altAnswerId,
      disableResponse,
      elementsIsCorrect,
      setQuestionData,
      bgShapes,
    } = this.props

    const {
      uiStyle,
      canvas,
      toolbar,
      numberlineAxis,
      background_shapes,
      backgroundImage,
    } = graphData

    return {
      canvas: {
        xMin: parseFloat(canvas.xMin),
        xMax: parseFloat(canvas.xMax),
        yMin: parseFloat(canvas.yMin),
        yMax: parseFloat(canvas.yMax),
        numberline: true,
        margin: parseFloat(canvas.margin),
        title: canvas.title,
      },
      numberlineAxis: {
        leftArrow: numberlineAxis && numberlineAxis.leftArrow,
        rightArrow: numberlineAxis && numberlineAxis.rightArrow,
        showTicks: numberlineAxis && numberlineAxis.showTicks,
        snapToTicks: numberlineAxis && numberlineAxis.snapToTicks,
        snapToGrid: numberlineAxis && numberlineAxis.snapToGrid,
        showMin: numberlineAxis && numberlineAxis.showMin,
        showMax: numberlineAxis && numberlineAxis.showMax,
        ticksDistance:
          numberlineAxis &&
          fractionStringToNumber(numberlineAxis.ticksDistance),
        fontSize: numberlineAxis && parseInt(numberlineAxis.fontSize, 10),
        stackResponses: numberlineAxis && numberlineAxis.stackResponses,
        stackResponsesSpacing:
          numberlineAxis && parseInt(numberlineAxis.stackResponsesSpacing, 10),
        renderingBase: numberlineAxis && numberlineAxis.renderingBase,
        specificPoints: numberlineAxis && numberlineAxis.specificPoints,
        fractionsFormat: numberlineAxis && numberlineAxis.fractionsFormat,
        minorTicks: numberlineAxis && parseFloat(numberlineAxis.minorTicks),
        tickColors: (numberlineAxis && numberlineAxis.tickColors) || {
          strokeColor: '#878A91',
        },
        showLabels: numberlineAxis && numberlineAxis.showLabels,
        labelShowMax: numberlineAxis && numberlineAxis.labelShowMax,
        strokeColor:
          (numberlineAxis && numberlineAxis.lineStrokeColor) || '#878A91',
        labelShowMin: numberlineAxis && numberlineAxis.labelShowMin,
      },
      layout: {
        width: uiStyle.layoutWidth,
        margin: uiStyle.layoutMargin,
        height: uiStyle.layoutHeight,
        snapTo: uiStyle.layoutSnapto,
        fontSize: getFontSize(uiStyle.fontSize, false),
        titlePosition: parseInt(uiStyle.titlePosition, 10),
        linePosition: numberlineAxis.stackResponses
          ? 75
          : parseInt(uiStyle.linePosition, 10),
        yDistance: safeParseFloat(uiStyle.yDistance),
        pointBoxPosition: parseInt(uiStyle.pointBoxPosition, 10),
        maxPointsCount: parseInt(uiStyle.maxPointsCount, 10) || 11,
      },
      pointParameters: {
        snapToGrid: true,
        snapSizeX: getSnapSize(
          uiStyle.layoutSnapto,
          parseFloat(uiStyle.xDistance)
        ),
        snapSizeY: getSnapSize(
          uiStyle.layoutSnapto,
          parseFloat(uiStyle.yDistance)
        ),
        showInfoBox: uiStyle.displayPositionOnHover,
        face: uiStyle.pointFace,
        size: parseInt(uiStyle.pointSize, 10),
        strokeWidth: parseInt(uiStyle.pointStrokeWidth, 10),
        withLabel: false,
      },
      xAxesParameters: {
        ticksDistance: safeParseFloat(uiStyle.xTickDistance),
        name: uiStyle.xShowAxisLabel ? uiStyle.xAxisLabel : '',
        showTicks: !uiStyle.xHideTicks,
        drawLabels: uiStyle.xDrawLabel,
        maxArrow: uiStyle.xMaxArrow,
        minArrow: uiStyle.xMinArrow,
        drawZero: uiStyle.drawLabelZero,
        commaInLabel: uiStyle.xCommaInLabel,
        strokeColor: uiStyle.xStrokeColor ? uiStyle.xStrokeColor : '#434B5D',
        tickEndings: uiStyle.xTickEndings ? uiStyle.xTickEndings : false,
      },
      yAxesParameters: {
        ticksDistance: safeParseFloat(uiStyle.yTickDistance),
        name: uiStyle.yShowAxisLabel ? uiStyle.yAxisLabel : '',
        showTicks: !uiStyle.yHideTicks,
        drawLabels: uiStyle.yDrawLabel,
        maxArrow: uiStyle.yMaxArrow,
        minArrow: uiStyle.yMinArrow,
        commaInLabel: uiStyle.yCommaInLabel,
        minorTicks: uiStyle.yMinorTicks ? uiStyle.yMinorTicks : 0,
      },
      gridParams: {
        gridY: safeParseFloat(uiStyle.yDistance),
        gridX: safeParseFloat(uiStyle.xDistance),
        showGrid: uiStyle.showGrid ? uiStyle.showGrid : true,
      },
      backgroundShapes: {
        values: bgShapes ? [] : background_shapes || [],
        showPoints: !!backgroundImage.showShapePoints,
      },
      evaluation,
      tools: toolbar ? toolbar.tools : [],
      setValue: onChange,
      elements,
      bgShapes,
      altAnswerId,
      view,
      previewTab,
      changePreviewTab,
      disableResponse,
      elementsIsCorrect,
      setQuestionData,
      graphData,
    }
  }

  getAxisLabelsProps = () => {
    const {
      view,
      previewTab,
      changePreviewTab,
      graphData,
      evaluation,
      onChange,
      elements,
      altAnswerId,
      disableResponse,
      elementsIsCorrect,
      setQuestionData,
    } = this.props

    const { uiStyle, canvas, numberlineAxis, list } = graphData
    const { fontSize, multiplier } = this.getGraphDimensions(
      uiStyle,
      numberlineAxis
    )
    const width = uiStyle.layoutWidth
    const height = uiStyle.layoutHeight

    return {
      canvas: {
        xMin: parseFloat(canvas.xMin),
        xMax: parseFloat(canvas.xMax),
        yMin: parseFloat(canvas.yMin),
        yMax: parseFloat(canvas.yMax),
        numberline: true,
        margin: parseFloat(canvas.margin),
        title: canvas.title,
      },
      numberlineAxis: {
        leftArrow: numberlineAxis && numberlineAxis.leftArrow,
        rightArrow: numberlineAxis && numberlineAxis.rightArrow,
        showTicks: numberlineAxis && numberlineAxis.showTicks,
        snapToTicks: numberlineAxis && numberlineAxis.snapToTicks,
        showMin: numberlineAxis && numberlineAxis.showMin,
        showMax: numberlineAxis && numberlineAxis.showMax,
        ticksDistance:
          numberlineAxis &&
          fractionStringToNumber(numberlineAxis.ticksDistance),
        fontSize,
        labelsFrequency:
          numberlineAxis && parseInt(numberlineAxis.labelsFrequency, 10),
        separationDistanceX:
          numberlineAxis && parseInt(numberlineAxis.separationDistanceX, 10),
        separationDistanceY:
          numberlineAxis && parseInt(numberlineAxis.separationDistanceY, 10),
        renderingBase: numberlineAxis && numberlineAxis.renderingBase,
        specificPoints: numberlineAxis && numberlineAxis.specificPoints,
        fractionsFormat: numberlineAxis && numberlineAxis.fractionsFormat,
        minorTicks: numberlineAxis && parseFloat(numberlineAxis.minorTicks),
        showLabels: numberlineAxis && numberlineAxis.showLabels,
        labelShowMax: numberlineAxis && numberlineAxis.labelShowMax,
        labelShowMin: numberlineAxis && numberlineAxis.labelShowMin,
        shuffleAnswerChoices:
          numberlineAxis && numberlineAxis.shuffleAnswerChoices,
        responseBoxPosition:
          (numberlineAxis && numberlineAxis.responseBoxPosition) || 'bottom',
        strokeColor: uiStyle.xStrokeColor || '#434B5D',
        highlightStrokeColor: uiStyle.xStrokeHoverColor || '#434B5D',
        tickColors: {
          strokeColor: '#434B5D',
          highlightStrokeColor: '#434B5D',
        },
      },
      layout: {
        width: parseInt(width, 10),
        margin: uiStyle.layoutMargin,
        height: height === 'auto' ? 150 : parseInt(height, 10),
        snapTo: uiStyle.layoutSnapto,
        fontSize: getFontSize(uiStyle.fontSize, false),
        titlePosition: parseInt(uiStyle.titlePosition, 10),
        linePosition: parseInt(uiStyle.linePosition, 10),
        pointBoxPosition: parseInt(uiStyle.pointBoxPosition, 10),
      },
      pointParameters: {
        snapToGrid: true,
        snapSizeX: getSnapSize(
          uiStyle.layoutSnapto,
          parseFloat(uiStyle.xDistance)
        ),
        snapSizeY: getSnapSize(
          uiStyle.layoutSnapto,
          parseFloat(uiStyle.yDistance)
        ),
        showInfoBox: uiStyle.displayPositionOnHover,
        withLabel: false,
      },
      gridParams: {
        gridY: safeParseFloat(uiStyle.yDistance),
        gridX: safeParseFloat(uiStyle.xDistance),
        showGrid: false,
      },
      list,
      evaluation,
      setValue: onChange,
      elements,
      altAnswerId,
      view,
      previewTab,
      changePreviewTab,
      disableResponse,
      elementsIsCorrect,
      setQuestionData,
      graphData,
      zoom: multiplier,
    }
  }

  render() {
    const { graphIsValid } = this.state
    const { theme, zoomLevel, isPrint, isPrintPreview } = this.props
    const zl = parseFloat(zoomLevel) || 1
    const GraphContainer = this.getGraphContainer()

    return (
      <GraphInView isPartial className="__prevent-page-break">
        {graphIsValid ? (
          <>
            {/* zoomLevel change css transform: scale() style,
              after changing this style 
              you need to do full reinit of component with jsxgraph object */}
            {zl === 1 && (
              <GraphContainer
                fallback={<Progress />}
                theme={theme}
                {...this.getGraphContainerProps()}
                isPrintPreview={isPrint || isPrintPreview}
              />
            )}
            {zl === 1.5 && (
              <GraphContainer
                fallback={<Progress />}
                theme={theme}
                {...this.getGraphContainerProps()}
                isPrintPreview={isPrint || isPrintPreview}
              />
            )}
            {zl === 1.75 && (
              <GraphContainer
                fallback={<Progress />}
                theme={theme}
                {...this.getGraphContainerProps()}
                isPrintPreview={isPrint || isPrintPreview}
              />
            )}
            {zl === 2.5 && (
              <GraphContainer
                fallback={<Progress />}
                theme={theme}
                {...this.getGraphContainerProps()}
                isPrintPreview={isPrint || isPrintPreview}
              />
            )}
            {zl === 3 && (
              <GraphContainer
                fallback={<Progress />}
                theme={theme}
                {...this.getGraphContainerProps()}
                isPrintPreview={isPrint || isPrintPreview}
              />
            )}
          </>
        ) : (
          <div>Wrong parameters</div>
        )}
      </GraphInView>
    )
  }
}

GraphDisplay.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  graphData: PropTypes.object.isRequired,
  smallSize: PropTypes.bool,
  onChange: PropTypes.func,
  changePreviewTab: PropTypes.func,
  elements: PropTypes.array,
  evaluation: PropTypes.any,
  bgShapes: PropTypes.bool,
  altAnswerId: PropTypes.string,
  showQuestionNumber: PropTypes.bool,
  qIndex: PropTypes.number,
  disableResponse: PropTypes.bool,
  elementsIsCorrect: PropTypes.bool,
  advancedElementSettings: PropTypes.bool,
  zoomLevel: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChangeKeypad: PropTypes.func,
  symbols: PropTypes.array,
}

GraphDisplay.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  advancedElementSettings: false,
  onChange: () => {},
  changePreviewTab: () => {},
  elements: [],
  evaluation: null,
  bgShapes: false,
  altAnswerId: null,
  showQuestionNumber: false,
  qIndex: null,
  disableResponse: false,
  elementsIsCorrect: false,
  zoomLevel: 1,
  onChangeKeypad: () => {},
  symbols: defaultSymbols,
}

const enhance = compose(
  withTheme,
  connect(
    (state) => ({
      zoomLevel: state.ui.zoomLevel,
    }),
    {
      setQuestionData: setQuestionDataAction,
    }
  )
)

export default enhance(GraphDisplay)
