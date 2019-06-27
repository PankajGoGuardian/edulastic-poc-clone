import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { cloneDeep } from "lodash";
import styled from "styled-components";

import { Stimulus } from "@edulastic/common";

import { QuadrantsContainer } from "./QuadrantsContainer";
import { AxisLabelsContainer } from "./AxisLabelsContainer";
import { AxisSegmentsContainer } from "./AxisSegmentsContainer";
import { setQuestionDataAction } from "../../../../author/src/actions/question";

const QuestionTitleWrapper = styled.div`
  display: flex;
`;

const QuestionNumber = styled.div`
  font-weight: 700;
  margin-right: 4px;
`;

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
    const { canvas, ui_style } = graphData;
    const { graphIsValid } = this.state;

    const parsedGraphData = {
      width: ui_style.layout_width ? parseInt(ui_style.layout_width, 10) : ui_style.layout_width,
      height: ui_style.layout_height ? parseInt(ui_style.layout_height, 10) : ui_style.layout_height,
      xMin: canvas.x_min ? parseFloat(canvas.x_min, 10) : canvas.x_min,
      xMax: canvas.x_max ? parseFloat(canvas.x_max, 10) : canvas.x_max
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
    const { canvas, ui_style } = graphData;
    const { graphIsValid } = this.state;

    const parsedGraphData = {
      width: ui_style.layout_width ? parseInt(ui_style.layout_width, 10) : ui_style.layout_width,
      height: ui_style.layout_height ? parseInt(ui_style.layout_height, 10) : ui_style.layout_height,
      xMin: canvas.x_min ? parseFloat(canvas.x_min, 10) : canvas.x_min,
      xMax: canvas.x_max ? parseFloat(canvas.x_max, 10) : canvas.x_max,
      yMin: canvas.y_min ? parseFloat(canvas.y_min, 10) : canvas.y_min,
      yMax: canvas.y_max ? parseFloat(canvas.y_max, 10) : canvas.y_max
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
      default:
        this.validateQuadrants();
    }
  };

  getGraphContainer = () => {
    const { graphData } = this.props;
    const { graphType } = graphData;

    switch (graphType) {
      case "axisSegments":
        return AxisSegmentsContainer;
      case "axisLabels":
        return AxisLabelsContainer;
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
      default:
        return this.getQuadrantsProps();
    }
  };

  getQuadrantsProps = () => {
    const {
      view,
      graphData,
      evaluation,
      onChange,
      showAnswer,
      checkAnswer,
      changePreviewTab,
      elements,
      bgShapes,
      altAnswerId,
      disableResponse
    } = this.props;

    const {
      ui_style,
      canvas,
      background_image,
      background_shapes,
      toolbar,
      controlbar,
      validation,
      annotation,
      id,
      graphType
    } = graphData;

    const { showGrid = true, xShowAxis = true, yShowAxis = true } = ui_style;

    return {
      canvas: {
        xMin: parseFloat(canvas.x_min),
        xMax: parseFloat(canvas.x_max),
        yMin: parseFloat(canvas.y_min),
        yMax: parseFloat(canvas.y_max)
      },
      layout: {
        width: ui_style.layout_width,
        margin: ui_style.layout_margin,
        height: ui_style.layout_height,
        snapTo: ui_style.layout_snapto,
        fontSize: getFontSizeVal(ui_style.currentFontSize)
      },
      pointParameters: {
        snapToGrid: true,
        snapSizeX: getSnapSize(ui_style.layout_snapto, parseFloat(ui_style.xDistance)),
        snapSizeY: getSnapSize(ui_style.layout_snapto, parseFloat(ui_style.yDistance)),
        showInfoBox: ui_style.displayPositionOnHover,
        withLabel: false
      },
      xAxesParameters: {
        ticksDistance: safeParseFloat(ui_style.xTickDistance),
        name: ui_style.xShowAxisLabel ? ui_style.xAxisLabel : "",
        showTicks: !ui_style.xHideTicks,
        drawLabels: ui_style.xDrawLabel,
        maxArrow: ui_style.xMaxArrow,
        minArrow: ui_style.xMinArrow,
        commaInLabel: ui_style.xCommaInLabel,
        showAxis: xShowAxis
      },
      yAxesParameters: {
        ticksDistance: safeParseFloat(ui_style.yTickDistance),
        name: ui_style.yShowAxisLabel ? ui_style.yAxisLabel : "",
        showTicks: !ui_style.yHideTicks,
        drawLabels: ui_style.yDrawLabel,
        maxArrow: ui_style.yMaxArrow,
        minArrow: ui_style.yMinArrow,
        commaInLabel: ui_style.yCommaInLabel,
        showAxis: yShowAxis
      },
      gridParams: {
        gridX: safeParseFloat(ui_style.xDistance),
        gridY: safeParseFloat(ui_style.yDistance),
        showGrid
      },
      bgImgOptions: {
        urlImg: background_image.src,
        opacity: background_image.opacity / 100,
        coords: [background_image.x, background_image.y],
        size: [background_image.width, background_image.height]
      },
      backgroundShapes: {
        values: bgShapes ? [] : background_shapes || [],
        showPoints: !!background_image.showShapePoints
      },
      evaluation,
      toolbar,
      controls: controlbar ? controlbar.controls : [],
      setValue: onChange,
      validation,
      elements,
      showAnswer,
      checkAnswer,
      changePreviewTab,
      graphType,
      bgShapes,
      annotation,
      questionId: id,
      altAnswerId,
      view,
      disableResponse
    };
  };

  getAxisSegmentsProps = () => {
    const {
      graphData,
      evaluation,
      onChange,
      showAnswer,
      checkAnswer,
      changePreviewTab,
      elements,
      altAnswerId,
      disableResponse
    } = this.props;

    const { ui_style, canvas, toolbar, numberlineAxis, validation, graphType, id } = graphData;

    return {
      canvas: {
        xMin: parseFloat(canvas.x_min),
        xMax: parseFloat(canvas.x_max),
        yMin: parseFloat(canvas.y_min),
        yMax: parseFloat(canvas.y_max),
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
        width: ui_style.layout_width,
        margin: ui_style.layout_margin,
        height: ui_style.layout_height,
        snapTo: ui_style.layout_snapto,
        fontSize: getFontSizeVal(ui_style.currentFontSize),
        titlePosition: parseInt(ui_style.title_position, 10),
        linePosition: numberlineAxis.stackResponses ? 75 : parseInt(ui_style.line_position, 10),
        pointBoxPosition: parseInt(ui_style.point_box_position, 10)
      },
      pointParameters: {
        snapToGrid: true,
        snapSizeX: getSnapSize(ui_style.layout_snapto, parseFloat(ui_style.xDistance)),
        snapSizeY: getSnapSize(ui_style.layout_snapto, parseFloat(ui_style.yDistance)),
        showInfoBox: ui_style.displayPositionOnHover,
        withLabel: false
      },
      xAxesParameters: {
        ticksDistance: safeParseFloat(ui_style.xTickDistance),
        name: ui_style.xShowAxisLabel ? ui_style.xAxisLabel : "",
        showTicks: !ui_style.xHideTicks,
        drawLabels: ui_style.xDrawLabel,
        maxArrow: ui_style.xMaxArrow,
        minArrow: ui_style.xMinArrow,
        commaInLabel: ui_style.xCommaInLabel,
        strokeColor: ui_style.xStrokeColor ? ui_style.xStrokeColor : "#00b0ff",
        tickEndings: ui_style.xTickEndings ? ui_style.xTickEndings : false
      },
      yAxesParameters: {
        ticksDistance: safeParseFloat(ui_style.yTickDistance),
        name: ui_style.yShowAxisLabel ? ui_style.yAxisLabel : "",
        showTicks: !ui_style.yHideTicks,
        drawLabels: ui_style.yDrawLabel,
        maxArrow: ui_style.yMaxArrow,
        minArrow: ui_style.yMinArrow,
        commaInLabel: ui_style.yCommaInLabel,
        minorTicks: ui_style.yMinorTicks ? ui_style.yMinorTicks : 0
      },
      gridParams: {
        gridY: safeParseFloat(ui_style.yDistance),
        gridX: safeParseFloat(ui_style.xDistance),
        showGrid: false
      },
      evaluation,
      tools: toolbar ? toolbar.tools : [],
      setValue: onChange,
      validation,
      elements,
      showAnswer,
      checkAnswer,
      changePreviewTab,
      graphType,
      questionId: id,
      altAnswerId,
      disableResponse
    };
  };

  getAxisLabelsProps = () => {
    const {
      graphData,
      evaluation,
      onChange,
      showAnswer,
      checkAnswer,
      changePreviewTab,
      elements,
      altAnswerId,
      disableResponse
    } = this.props;

    const { ui_style, canvas, numberlineAxis, validation, list, graphType, id } = graphData;

    return {
      canvas: {
        xMin: parseFloat(canvas.x_min),
        xMax: parseFloat(canvas.x_max),
        yMin: parseFloat(canvas.y_min),
        yMax: parseFloat(canvas.y_max),
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
        labelShowMin: numberlineAxis && numberlineAxis.labelShowMin
      },
      layout: {
        width: ui_style.layout_width,
        margin: ui_style.layout_margin,
        height: ui_style.layout_height,
        autoCalcHeight: ui_style.autoCalcHeight,
        snapTo: ui_style.layout_snapto,
        fontSize: getFontSizeVal(ui_style.currentFontSize),
        titlePosition: parseInt(ui_style.title_position, 10),
        linePosition: parseInt(ui_style.line_position, 10),
        pointBoxPosition: parseInt(ui_style.point_box_position, 10)
      },
      pointParameters: {
        snapToGrid: true,
        snapSizeX: getSnapSize(ui_style.layout_snapto, parseFloat(ui_style.xDistance)),
        snapSizeY: getSnapSize(ui_style.layout_snapto, parseFloat(ui_style.yDistance)),
        showInfoBox: ui_style.displayPositionOnHover,
        withLabel: false
      },
      xAxesParameters: {
        ticksDistance: safeParseFloat(ui_style.xTickDistance),
        name: ui_style.xShowAxisLabel ? ui_style.xAxisLabel : "",
        showTicks: !ui_style.xHideTicks,
        drawLabels: ui_style.xDrawLabel,
        maxArrow: ui_style.xMaxArrow,
        minArrow: ui_style.xMinArrow,
        commaInLabel: ui_style.xCommaInLabel,
        strokeColor: ui_style.xStrokeColor ? ui_style.xStrokeColor : "#00b0ff",
        tickEndings: ui_style.xTickEndings ? ui_style.xTickEndings : false
      },
      yAxesParameters: {
        ticksDistance: safeParseFloat(ui_style.yTickDistance),
        name: ui_style.yShowAxisLabel ? ui_style.yAxisLabel : "",
        showTicks: !ui_style.yHideTicks,
        drawLabels: ui_style.yDrawLabel,
        maxArrow: ui_style.yMaxArrow,
        minArrow: ui_style.yMinArrow,
        commaInLabel: ui_style.yCommaInLabel,
        minorTicks: ui_style.yMinorTicks ? ui_style.yMinorTicks : 0
      },
      gridParams: {
        gridY: safeParseFloat(ui_style.yDistance),
        gridX: safeParseFloat(ui_style.xDistance),
        showGrid: false
      },
      list,
      graphType,
      evaluation,
      setValue: onChange,
      validation,
      elements,
      showAnswer,
      checkAnswer,
      changePreviewTab,
      questionId: id,
      altAnswerId,
      disableResponse,
      setCalculatedHeight: this.setCalculatedHeight
    };
  };

  setCalculatedHeight = height => {
    const { setQuestionData, graphData } = this.props;
    const newGraphData = cloneDeep(graphData);
    newGraphData.ui_style = {
      ...newGraphData.ui_style,
      autoCalcHeight: height
    };
    setQuestionData(newGraphData);
  };

  render() {
    const { graphData } = this.props;
    const { stimulus } = graphData;
    const { graphIsValid } = this.state;

    const GraphContainer = this.getGraphContainer();

    return (
      <Fragment>
        {graphIsValid ? (
          <Fragment>
            <Stimulus data-cy="questionHeader" dangerouslySetInnerHTML={{ __html: stimulus }} />
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
  graphData: PropTypes.object.isRequired,
  smallSize: PropTypes.bool,
  onChange: PropTypes.func,
  changePreviewTab: PropTypes.func,
  elements: PropTypes.array,
  evaluation: PropTypes.any,
  showAnswer: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  clearAnswer: PropTypes.bool,
  bgShapes: PropTypes.bool,
  altAnswerId: PropTypes.string,
  showQuestionNumber: PropTypes.bool,
  qIndex: PropTypes.number,
  disableResponse: PropTypes.bool
};

GraphDisplay.defaultProps = {
  smallSize: false,
  onChange: () => { },
  changePreviewTab: () => { },
  elements: [],
  evaluation: null,
  showAnswer: false,
  checkAnswer: false,
  clearAnswer: false,
  bgShapes: false,
  altAnswerId: null,
  showQuestionNumber: false,
  qIndex: null,
  disableResponse: false
};

export default connect(
  null,
  {
    setQuestionData: setQuestionDataAction
  }
)(GraphDisplay);
