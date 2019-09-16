import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { CLEAR } from "../../../constants/constantsForQuestions";
import { QuadrantsContainer } from "./QuadrantsContainer";
import { AxisLabelsContainer } from "./AxisLabelsContainer";
import { AxisSegmentsContainer } from "./AxisSegmentsContainer";
import { setQuestionDataAction } from "../../../../author/src/actions/question";
import { PlacementContainer } from "./PlacementContainer";

const safeParseFloat = val => {
  if (val) {
    return parseFloat(val);
  }
  return 1;
};

const getFontSizeVal = name => {
  switch (name) {
    case "small":
      return 12;
    case "normal":
      return 14;
    case "large":
      return 17;
    case "extra_large":
      return 20;
    case "huge":
      return 24;
    default:
      return 14;
  }
};

const getSnapSize = (snapTo, axisDistance) => {
  if (snapTo === "grid" || Number.isNaN(parseInt(snapTo, 10))) {
    if (axisDistance) return axisDistance;
    return 1; // default
  }
  return snapTo;
};

class GraphDisplay extends Component {
  state = {
    graphIsValid: false
  };

  componentDidMount() {
    this.validateGraph();
  }

  componentDidUpdate(prevProps) {
    const { graphData } = this.props;
    if (graphData !== prevProps.graphData) {
      this.validateGraph();
    }
  }

  validateNumberline = () => {
    const { graphData } = this.props;
    const { canvas, uiStyle } = graphData;
    const { graphIsValid } = this.state;

    const parsedGraphData = {
      width: uiStyle.layoutWidth ? parseInt(uiStyle.layoutWidth, 10) : uiStyle.layoutWidth,
      height: uiStyle.layoutHeight ? parseInt(uiStyle.layoutHeight, 10) : uiStyle.layoutHeight,
      xMin: canvas.xMin ? parseFloat(canvas.xMin, 10) : canvas.xMin,
      xMax: canvas.xMax ? parseFloat(canvas.xMax, 10) : canvas.xMax
    };

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
        this.setState({ graphIsValid: false });
      }
    } else if (!graphIsValid) {
      this.setState({ graphIsValid: true });
    }
  };

  validateQuadrants = () => {
    const { graphData } = this.props;
    const { canvas, uiStyle } = graphData;
    const { graphIsValid } = this.state;

    const parsedGraphData = {
      width: uiStyle.layoutWidth ? parseInt(uiStyle.layoutWidth, 10) : uiStyle.layoutWidth,
      height: uiStyle.layoutHeight ? parseInt(uiStyle.layoutHeight, 10) : uiStyle.layoutHeight,
      xMin: canvas.xMin ? parseFloat(canvas.xMin, 10) : canvas.xMin,
      xMax: canvas.xMax ? parseFloat(canvas.xMax, 10) : canvas.xMax,
      yMin: canvas.yMin ? parseFloat(canvas.yMin, 10) : canvas.yMin,
      yMax: canvas.yMax ? parseFloat(canvas.yMax, 10) : canvas.yMax
    };

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
        this.setState({ graphIsValid: false });
      }
    } else if (!graphIsValid) {
      this.setState({ graphIsValid: true });
    }
  };

  validateGraph = () => {
    const { graphData } = this.props;
    const { graphType } = graphData;

    switch (graphType) {
      case "axisSegments":
      case "axisLabels":
        this.validateNumberline();
        break;
      case "quadrants":
      case "firstQuadrant":
      case "quadrantsPlacement":
      default:
        this.validateQuadrants();
    }
  };

  getGraphContainer = () => {
    const { graphData, bgShapes } = this.props;
    const { graphType } = graphData;

    switch (graphType) {
      case "axisSegments":
        return AxisSegmentsContainer;
      case "axisLabels":
        return AxisLabelsContainer;
      case "quadrantsPlacement":
        return !bgShapes ? PlacementContainer : QuadrantsContainer;
      case "quadrants":
      case "firstQuadrant":
      default:
        return QuadrantsContainer;
    }
  };

  getGraphContainerProps = () => {
    const { graphData } = this.props;
    const { graphType } = graphData;

    switch (graphType) {
      case "axisSegments":
        return this.getAxisSegmentsProps();
      case "axisLabels":
        return this.getAxisLabelsProps();
      case "quadrants":
      case "firstQuadrant":
      case "quadrantsPlacement":
      default:
        return this.getQuadrantsProps();
    }
  };

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
      setQuestionData
    } = this.props;

    const {
      uiStyle,
      canvas,
      backgroundImage,
      background_shapes,
      toolbar,
      controlbar,
      annotation,
      graphType,
      list
    } = graphData;

    const { showGrid = true, xShowAxis = true, yShowAxis = true } = uiStyle;

    return {
      canvas: {
        xMin: parseFloat(canvas.xMin) - 1,
        xMax: parseFloat(canvas.xMax) + 1,
        yMin: parseFloat(canvas.yMin) - 1,
        yMax: parseFloat(canvas.yMax) + 1
      },
      layout: {
        width: uiStyle.layoutWidth,
        margin: uiStyle.layoutMargin,
        height: uiStyle.layoutHeight,
        snapTo: uiStyle.layoutSnapto,
        fontSize: getFontSizeVal(uiStyle.currentFontSize)
      },
      pointParameters: {
        snapToGrid: true,
        snapSizeX: getSnapSize(uiStyle.layoutSnapto, parseFloat(uiStyle.xDistance)),
        snapSizeY: getSnapSize(uiStyle.layoutSnapto, parseFloat(uiStyle.yDistance)),
        showInfoBox: uiStyle.displayPositionOnHover,
        withLabel: false
      },
      xAxesParameters: {
        ticksDistance: safeParseFloat(uiStyle.xTickDistance),
        name: uiStyle.xShowAxisLabel ? uiStyle.xAxisLabel : "",
        showTicks: !uiStyle.xHideTicks,
        drawLabels: uiStyle.xDrawLabel,
        maxArrow: uiStyle.xMaxArrow,
        minArrow: uiStyle.xMinArrow,
        commaInLabel: uiStyle.xCommaInLabel,
        showAxis: xShowAxis
      },
      yAxesParameters: {
        ticksDistance: safeParseFloat(uiStyle.yTickDistance),
        name: uiStyle.yShowAxisLabel ? uiStyle.yAxisLabel : "",
        showTicks: !uiStyle.yHideTicks,
        drawLabels: uiStyle.yDrawLabel,
        maxArrow: uiStyle.yMaxArrow,
        minArrow: uiStyle.yMinArrow,
        commaInLabel: uiStyle.yCommaInLabel,
        showAxis: yShowAxis
      },
      gridParams: {
        gridX: safeParseFloat(uiStyle.xDistance),
        gridY: safeParseFloat(uiStyle.yDistance),
        showGrid
      },
      bgImgOptions: {
        urlImg: backgroundImage.src,
        opacity: backgroundImage.opacity / 100,
        coords: [backgroundImage.x, backgroundImage.y],
        size: [backgroundImage.width, backgroundImage.height]
      },
      backgroundShapes: {
        values: bgShapes ? [] : background_shapes || [],
        showPoints: !!backgroundImage.showShapePoints
      },
      evaluation,
      toolbar,
      controls: controlbar ? controlbar.controls : [],
      setValue: onChange,
      elements,
      graphType: bgShapes && graphType === "quadrantsPlacement" ? "quadrants" : graphType,
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
      graphData
    };
  };

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
      setQuestionData
    } = this.props;

    const { uiStyle, canvas, toolbar, numberlineAxis } = graphData;

    return {
      canvas: {
        xMin: parseFloat(canvas.xMin),
        xMax: parseFloat(canvas.xMax),
        yMin: parseFloat(canvas.yMin),
        yMax: parseFloat(canvas.yMax),
        numberline: true,
        margin: parseFloat(canvas.margin),
        responsesAllowed: parseInt(canvas.responsesAllowed, 10) || 1,
        title: canvas.title
      },
      numberlineAxis: {
        leftArrow: numberlineAxis && numberlineAxis.leftArrow,
        rightArrow: numberlineAxis && numberlineAxis.rightArrow,
        showTicks: numberlineAxis && numberlineAxis.showTicks,
        snapToTicks: numberlineAxis && numberlineAxis.snapToTicks,
        showMin: numberlineAxis && numberlineAxis.showMin,
        showMax: numberlineAxis && numberlineAxis.showMax,
        ticksDistance: numberlineAxis && numberlineAxis.ticksDistance,
        fontSize: numberlineAxis && parseInt(numberlineAxis.fontSize, 10),
        stackResponses: numberlineAxis && numberlineAxis.stackResponses,
        stackResponsesSpacing: numberlineAxis && parseInt(numberlineAxis.stackResponsesSpacing, 10),
        renderingBase: numberlineAxis && numberlineAxis.renderingBase,
        specificPoints: numberlineAxis && numberlineAxis.specificPoints,
        fractionsFormat: numberlineAxis && numberlineAxis.fractionsFormat,
        minorTicks: numberlineAxis && parseFloat(numberlineAxis.minorTicks),
        showLabels: numberlineAxis && numberlineAxis.showLabels,
        labelShowMax: numberlineAxis && numberlineAxis.labelShowMax,
        labelShowMin: numberlineAxis && numberlineAxis.labelShowMin
      },
      layout: {
        width: uiStyle.layoutWidth,
        margin: uiStyle.layoutMargin,
        height: uiStyle.layoutHeight,
        snapTo: uiStyle.layoutSnapto,
        fontSize: getFontSizeVal(uiStyle.currentFontSize),
        titlePosition: parseInt(uiStyle.titlePosition, 10),
        linePosition: numberlineAxis.stackResponses ? 75 : parseInt(uiStyle.linePosition, 10),
        pointBoxPosition: parseInt(uiStyle.pointBoxPosition, 10)
      },
      pointParameters: {
        snapToGrid: true,
        snapSizeX: getSnapSize(uiStyle.layoutSnapto, parseFloat(uiStyle.xDistance)),
        snapSizeY: getSnapSize(uiStyle.layoutSnapto, parseFloat(uiStyle.yDistance)),
        showInfoBox: uiStyle.displayPositionOnHover,
        withLabel: false
      },
      xAxesParameters: {
        ticksDistance: safeParseFloat(uiStyle.xTickDistance),
        name: uiStyle.xShowAxisLabel ? uiStyle.xAxisLabel : "",
        showTicks: !uiStyle.xHideTicks,
        drawLabels: uiStyle.xDrawLabel,
        maxArrow: uiStyle.xMaxArrow,
        minArrow: uiStyle.xMinArrow,
        commaInLabel: uiStyle.xCommaInLabel,
        strokeColor: uiStyle.xStrokeColor ? uiStyle.xStrokeColor : "#00b0ff",
        tickEndings: uiStyle.xTickEndings ? uiStyle.xTickEndings : false
      },
      yAxesParameters: {
        ticksDistance: safeParseFloat(uiStyle.yTickDistance),
        name: uiStyle.yShowAxisLabel ? uiStyle.yAxisLabel : "",
        showTicks: !uiStyle.yHideTicks,
        drawLabels: uiStyle.yDrawLabel,
        maxArrow: uiStyle.yMaxArrow,
        minArrow: uiStyle.yMinArrow,
        commaInLabel: uiStyle.yCommaInLabel,
        minorTicks: uiStyle.yMinorTicks ? uiStyle.yMinorTicks : 0
      },
      gridParams: {
        gridY: safeParseFloat(uiStyle.yDistance),
        gridX: safeParseFloat(uiStyle.xDistance),
        showGrid: false
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
      graphData
    };
  };

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
      setQuestionData
    } = this.props;

    const { uiStyle, canvas, numberlineAxis, list } = graphData;

    return {
      canvas: {
        xMin: parseFloat(canvas.xMin),
        xMax: parseFloat(canvas.xMax),
        yMin: parseFloat(canvas.yMin),
        yMax: parseFloat(canvas.yMax),
        numberline: true,
        margin: parseFloat(canvas.margin),
        title: canvas.title
      },
      numberlineAxis: {
        leftArrow: numberlineAxis && numberlineAxis.leftArrow,
        rightArrow: numberlineAxis && numberlineAxis.rightArrow,
        showTicks: numberlineAxis && numberlineAxis.showTicks,
        snapToTicks: numberlineAxis && numberlineAxis.snapToTicks,
        showMin: numberlineAxis && numberlineAxis.showMin,
        showMax: numberlineAxis && numberlineAxis.showMax,
        ticksDistance: numberlineAxis && numberlineAxis.ticksDistance,
        fontSize: numberlineAxis && parseInt(numberlineAxis.fontSize, 10),
        labelsFrequency: numberlineAxis && parseInt(numberlineAxis.labelsFrequency, 10),
        separationDistanceX: numberlineAxis && parseInt(numberlineAxis.separationDistanceX, 10),
        separationDistanceY: numberlineAxis && parseInt(numberlineAxis.separationDistanceY, 10),
        renderingBase: numberlineAxis && numberlineAxis.renderingBase,
        specificPoints: numberlineAxis && numberlineAxis.specificPoints,
        fractionsFormat: numberlineAxis && numberlineAxis.fractionsFormat,
        minorTicks: numberlineAxis && parseFloat(numberlineAxis.minorTicks),
        showLabels: numberlineAxis && numberlineAxis.showLabels,
        labelShowMax: numberlineAxis && numberlineAxis.labelShowMax,
        labelShowMin: numberlineAxis && numberlineAxis.labelShowMin,
        shuffleAnswerChoices: numberlineAxis && numberlineAxis.shuffleAnswerChoices,
        responseBoxPosition: (numberlineAxis && numberlineAxis.responseBoxPosition) || "bottom"
      },
      layout: {
        width: parseInt(uiStyle.layoutWidth, 10),
        margin: uiStyle.layoutMargin,
        height: uiStyle.layoutHeight === "auto" ? 150 : parseInt(uiStyle.layoutHeight, 10),
        snapTo: uiStyle.layoutSnapto,
        fontSize: getFontSizeVal(uiStyle.currentFontSize),
        titlePosition: parseInt(uiStyle.titlePosition, 10),
        linePosition: parseInt(uiStyle.linePosition, 10),
        pointBoxPosition: parseInt(uiStyle.pointBoxPosition, 10)
      },
      pointParameters: {
        snapToGrid: true,
        snapSizeX: getSnapSize(uiStyle.layoutSnapto, parseFloat(uiStyle.xDistance)),
        snapSizeY: getSnapSize(uiStyle.layoutSnapto, parseFloat(uiStyle.yDistance)),
        showInfoBox: uiStyle.displayPositionOnHover,
        withLabel: false
      },
      xAxesParameters: {
        ticksDistance: safeParseFloat(uiStyle.xTickDistance),
        name: uiStyle.xShowAxisLabel ? uiStyle.xAxisLabel : "",
        showTicks: !uiStyle.xHideTicks,
        drawLabels: uiStyle.xDrawLabel,
        maxArrow: uiStyle.xMaxArrow,
        minArrow: uiStyle.xMinArrow,
        commaInLabel: uiStyle.xCommaInLabel,
        strokeColor: uiStyle.xStrokeColor ? uiStyle.xStrokeColor : "#00b0ff",
        tickEndings: uiStyle.xTickEndings ? uiStyle.xTickEndings : false
      },
      yAxesParameters: {
        ticksDistance: safeParseFloat(uiStyle.yTickDistance),
        name: uiStyle.yShowAxisLabel ? uiStyle.yAxisLabel : "",
        showTicks: !uiStyle.yHideTicks,
        drawLabels: uiStyle.yDrawLabel,
        maxArrow: uiStyle.yMaxArrow,
        minArrow: uiStyle.yMinArrow,
        commaInLabel: uiStyle.yCommaInLabel,
        minorTicks: uiStyle.yMinorTicks ? uiStyle.yMinorTicks : 0
      },
      gridParams: {
        gridY: safeParseFloat(uiStyle.yDistance),
        gridX: safeParseFloat(uiStyle.xDistance),
        showGrid: false
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
      graphData
    };
  };

  render() {
    const { graphIsValid } = this.state;

    const GraphContainer = this.getGraphContainer();

    return (
      <Fragment>
        {graphIsValid ? (
          <Fragment>
            <GraphContainer {...this.getGraphContainerProps()} />
          </Fragment>
        ) : (
          <div>Wrong parameters</div>
        )}
      </Fragment>
    );
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
  advancedElementSettings: PropTypes.bool
};

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
  elementsIsCorrect: false
};

export default connect(
  null,
  {
    setQuestionData: setQuestionDataAction
  }
)(GraphDisplay);
