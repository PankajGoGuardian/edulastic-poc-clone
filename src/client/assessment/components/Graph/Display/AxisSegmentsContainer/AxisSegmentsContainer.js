import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { cloneDeep, isEqual } from "lodash";

import {
  IconGraphPoint as IconPoint,
  IconBothIncludedSegment,
  IconBothNotIncludedSegment,
  IconOnlyLeftIncludedSegment,
  IconOnlyRightIncludedSegment,
  IconInfinityToIncludedSegment,
  IconIncludedToInfinitySegment,
  IconInfinityToNotIncludedSegment,
  IconNotIncludedToInfinitySegment,
  IconTrash
} from "@edulastic/icons";

import { CHECK, CLEAR, EDIT, SHOW } from "../../../../constants/constantsForQuestions";
import { setElementsStashAction, setStashIndexAction } from "../../../../actions/graphTools";

import {
  defaultAxesParameters,
  defaultGraphParameters,
  defaultGridParameters,
  defaultPointParameters
} from "../../Builder/settings";
import { makeBorder } from "../../Builder";
import { CONSTANT, Colors } from "../../Builder/config";

import AnnotationRnd from "../../../Annotations/AnnotationRnd";

import SegmentsTools from "./SegmentsTools";
import { GraphWrapper, JSXBox } from "./styled";

const getColoredElems = (elements, compareResult) => {
  if (compareResult && compareResult.details && compareResult.details.length > 0) {
    let newElems = cloneDeep(elements);
    newElems = newElems.map(el => {
      const detail = compareResult.details.find(det => det.shape.id === el.id);

      const red = Colors.red[CONSTANT.TOOLS.POINT];
      const redHollow = Colors.red[CONSTANT.TOOLS.SEGMENTS_POINT];

      const green = Colors.green[CONSTANT.TOOLS.POINT];
      const greenHollow = Colors.green[CONSTANT.TOOLS.SEGMENTS_POINT];

      switch (el.type) {
        case CONSTANT.TOOLS.SEGMENTS_POINT:
        case CONSTANT.TOOLS.RAY_LEFT_DIRECTION:
        case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION:
          return {
            colors: detail && detail.result ? green : red,
            pointColor: detail && detail.result ? green : red,
            ...el
          };
        case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_INCLUDED:
          return {
            lineColor: detail && detail.result ? green : red,
            leftPointColor: detail && detail.result ? green : red,
            rightPointColor: detail && detail.result ? green : red,
            ...el
          };
        case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_HOLLOW:
          return {
            lineColor: detail && detail.result ? green : red,
            leftPointColor: detail && detail.result ? greenHollow : redHollow,
            rightPointColor: detail && detail.result ? greenHollow : redHollow,
            ...el
          };
        case CONSTANT.TOOLS.SEGMENT_LEFT_POINT_HOLLOW:
          return {
            lineColor: detail && detail.result ? green : red,
            leftPointColor: detail && detail.result ? greenHollow : redHollow,
            rightPointColor: detail && detail.result ? green : red,
            ...el
          };
        case CONSTANT.TOOLS.SEGMENT_RIGHT_POINT_HOLLOW:
          return {
            lineColor: detail && detail.result ? green : red,
            leftPointColor: detail && detail.result ? green : red,
            rightPointColor: detail && detail.result ? greenHollow : redHollow,
            ...el
          };
        case CONSTANT.TOOLS.RAY_LEFT_DIRECTION_RIGHT_HOLLOW:
        case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION_LEFT_HOLLOW:
          return {
            colors: detail && detail.result ? green : red,
            pointColor: detail && detail.result ? greenHollow : redHollow,
            ...el
          };
        default:
          return null;
      }
    });
    return newElems;
  }
  return elements;
};

const getCorrectAnswer = answerArr => {
  if (Array.isArray(answerArr)) {
    return answerArr.map(el => {
      switch (el.type) {
        case CONSTANT.TOOLS.SEGMENTS_POINT:
        case CONSTANT.TOOLS.RAY_LEFT_DIRECTION:
        case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION:
          return {
            colors: Colors.green[CONSTANT.TOOLS.POINT],
            pointColor: Colors.green[CONSTANT.TOOLS.POINT],
            ...el
          };
        case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_INCLUDED:
          return {
            lineColor: Colors.green[CONSTANT.TOOLS.POINT],
            leftPointColor: Colors.green[CONSTANT.TOOLS.POINT],
            rightPointColor: Colors.green[CONSTANT.TOOLS.POINT],
            ...el
          };
        case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_HOLLOW:
          return {
            lineColor: Colors.green[CONSTANT.TOOLS.POINT],
            leftPointColor: Colors.green[CONSTANT.TOOLS.SEGMENTS_POINT],
            rightPointColor: Colors.green[CONSTANT.TOOLS.SEGMENTS_POINT],
            ...el
          };
        case CONSTANT.TOOLS.SEGMENT_LEFT_POINT_HOLLOW:
          return {
            lineColor: Colors.green[CONSTANT.TOOLS.POINT],
            leftPointColor: Colors.green[CONSTANT.TOOLS.SEGMENTS_POINT],
            rightPointColor: Colors.green[CONSTANT.TOOLS.POINT],
            ...el
          };
        case CONSTANT.TOOLS.SEGMENT_RIGHT_POINT_HOLLOW:
          return {
            lineColor: Colors.green[CONSTANT.TOOLS.POINT],
            leftPointColor: Colors.green[CONSTANT.TOOLS.POINT],
            rightPointColor: Colors.green[CONSTANT.TOOLS.SEGMENTS_POINT],
            ...el
          };
        case CONSTANT.TOOLS.RAY_LEFT_DIRECTION_RIGHT_HOLLOW:
        case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION_LEFT_HOLLOW:
          return {
            colors: Colors.green[CONSTANT.TOOLS.POINT],
            pointColor: Colors.green[CONSTANT.TOOLS.SEGMENTS_POINT],
            ...el
          };
        default:
          return null;
      }
    });
  }
  return answerArr;
};

const getCompareResult = evaluation => {
  if (!evaluation) {
    return null;
  }

  let compareResult = null;

  Object.keys(evaluation).forEach(key => {
    if (compareResult) {
      return;
    }
    if (evaluation[key].result) {
      compareResult = evaluation[key];
    }
  });

  if (compareResult) {
    return compareResult;
  }

  return evaluation[0];
};

class AxisSegmentsContainer extends PureComponent {
  constructor(props) {
    super(props);

    this._graphId = `jxgbox${Math.random()
      .toString(36)
      .replace(".", "")}`;
    this._graph = null;

    this.state = {
      selectedTool: this.getDefaultTool()
    };

    this.updateValues = this.updateValues.bind(this);
  }

  getDefaultTool() {
    const { tools } = this.props;

    return {
      name: tools[0] || undefined,
      index: 0,
      groupIndex: -1
    };
  }

  setDefaultToolState() {
    this.setState({ selectedTool: this.getDefaultTool() });
  }

  componentDidMount() {
    const {
      canvas,
      numberlineAxis,
      pointParameters,
      xAxesParameters,
      yAxesParameters,
      layout,
      gridParams,
      graphData,
      setElementsStash,
      disableResponse
    } = this.props;

    this._graph = makeBorder(this._graphId, graphData.graphType);

    if (this._graph) {
      this._graph.setDisableResponse(disableResponse);

      this._graph.resizeContainer(layout.width, layout.height);
      this._graph.setGraphParameters({
        ...defaultGraphParameters(),
        ...canvas
      });
      this._graph.setPointParameters({
        ...defaultPointParameters(),
        ...pointParameters
      });
      this._graph.setAxesParameters({
        x: {
          ...defaultAxesParameters(),
          ...xAxesParameters
        },
        y: {
          ...yAxesParameters
        }
      });
      this._graph.setGridParameters({
        ...defaultGridParameters(),
        ...gridParams
      });

      this._graph.setTool(CONSTANT.TOOLS.SEGMENTS_POINT);

      this._graph.setPointParameters({
        snapSizeX: numberlineAxis.ticksDistance
      });

      this._graph.updateNumberlineSettings(canvas, numberlineAxis, layout);

      this.setElementsToGraph();
    }

    this.setGraphUpdateEventHandler();

    setElementsStash(this._graph.getSegments(), this.getStashId());
  }

  componentDidUpdate(prevProps) {
    const {
      canvas,
      numberlineAxis,
      layout,
      tools,
      disableResponse,
      previewTab,
      changePreviewTab,
      elements
    } = this.props;
    const { disableResponse: prevDisableResponse } = prevProps;
    if (disableResponse && prevDisableResponse !== disableResponse) {
      this.onReset();
    }

    const { selectedTool } = this.state;

    if (JSON.stringify(tools) !== JSON.stringify(prevProps.tools)) {
      this.setDefaultToolState();
      this._graph.setTool(tools[0] || CONSTANT.TOOLS.SEGMENTS_POINT);
    }
    if (this._graph) {
      this._graph.setDisableResponse(disableResponse);
      if (
        numberlineAxis.stackResponses !== prevProps.numberlineAxis.stackResponses ||
        numberlineAxis.stackResponsesSpacing !== prevProps.numberlineAxis.stackResponsesSpacing ||
        canvas.responsesAllowed !== prevProps.canvas.responsesAllowed
      ) {
        this._graph.segmentsReset();
        this._graph.setTool(selectedTool.name || CONSTANT.TOOLS.SEGMENTS_POINT);
        this.updateValues();
      }

      if (
        !isEqual(canvas, prevProps.canvas) ||
        !isEqual(numberlineAxis, prevProps.numberlineAxis) ||
        !isEqual(layout, prevProps.layout)
      ) {
        this._graph.updateNumberlineSettings(canvas, numberlineAxis, layout);
      }

      this.setElementsToGraph(prevProps);
    }

    if ((previewTab === CHECK || previewTab === SHOW) && !isEqual(elements, prevProps.elements)) {
      changePreviewTab(CLEAR);
    }
  }

  onSelectTool = ({ name, index, groupIndex }) => {
    if (name === "undo") {
      this.onUndo();
      return;
    }
    if (name === "redo") {
      this.onRedo();
      return;
    }
    if (name === "reset") {
      this.onReset();
      return;
    }

    this.setState({ selectedTool: { name, index, groupIndex } });
    this._graph.setTool(name);
  };

  onUndo = () => {
    const { stash, stashIndex, setStashIndex, setValue } = this.props;
    const id = this.getStashId();
    if (stashIndex[id] > 0 && stashIndex[id] <= stash[id].length - 1) {
      setValue(stash[id][stashIndex[id] - 1]);
      setStashIndex(stashIndex[id] - 1, id);
    }
  };

  onRedo() {
    const { stash, stashIndex, setStashIndex, setValue } = this.props;
    const id = this.getStashId();
    if (stashIndex[id] >= 0 && stashIndex[id] < stash[id].length - 1) {
      setValue(stash[id][stashIndex[id] + 1]);
      setStashIndex(stashIndex[id] + 1, id);
    }
  }

  onReset() {
    this._graph.segmentsReset();
    this.updateValues();
  }

  getStashId() {
    const { graphData, altAnswerId, view } = this.props;
    const type = altAnswerId || view;
    return `${graphData.id}_${type}`;
  }

  updateValues() {
    const conf = this._graph.getSegments();
    const { setValue, setElementsStash } = this.props;
    setValue(conf);
    setElementsStash(conf, this.getStashId());
  }

  setGraphUpdateEventHandler = () => {
    this._graph.events.on(CONSTANT.EVENT_NAMES.CHANGE_MOVE, () => this.updateValues());
    this._graph.events.on(CONSTANT.EVENT_NAMES.CHANGE_NEW, () => this.updateValues());
    this._graph.events.on(CONSTANT.EVENT_NAMES.CHANGE_DELETE, () => this.updateValues());
  };

  setElementsToGraph = (prevProps = {}) => {
    const { elements, evaluation, disableResponse, elementsIsCorrect, previewTab } = this.props;

    // correct answers blocks
    if (elementsIsCorrect) {
      this._graph.resetAnswers();
      this._graph.loadSegmentsAnswers(getCorrectAnswer(elements));
      return;
    }

    if (disableResponse) {
      const compareResult = getCompareResult(evaluation);
      const coloredElements = getColoredElems(elements, compareResult);
      this._graph.segmentsReset();
      this._graph.resetAnswers();
      this._graph.loadSegmentsAnswers(coloredElements);
      return;
    }

    if (previewTab === CHECK || previewTab === SHOW) {
      const compareResult = getCompareResult(evaluation);
      const coloredElements = getColoredElems(elements, compareResult);
      this._graph.segmentsReset();
      this._graph.resetAnswers();
      this._graph.loadSegments(coloredElements);
      return;
    }

    if (
      !isEqual(elements, this._graph.getSegments()) ||
      (previewTab === CLEAR && (prevProps.previewTab === CHECK || prevProps.previewTab === SHOW))
    ) {
      this._graph.segmentsReset();
      this._graph.resetAnswers();
      this._graph.loadSegments(elements);
    }
  };

  getIconByToolName = (toolName, options) => {
    if (!toolName) {
      return "";
    }

    const { width } = options;

    const iconsByToolName = {
      segments_point: () => <IconPoint {...options} />,
      segment_both_point_included: () => {
        const newOptions = {
          ...options,
          width: width + 40
        };

        return <IconBothIncludedSegment {...newOptions} />;
      },
      segment_both_points_hollow: () => {
        const newOptions = {
          ...options,
          width: width + 40
        };

        return <IconBothNotIncludedSegment {...newOptions} />;
      },
      segment_left_point_hollow: () => {
        const newOptions = {
          ...options,
          width: width + 40
        };

        return <IconOnlyRightIncludedSegment {...newOptions} />;
      },
      segment_right_point_hollow: () => {
        const newOptions = {
          ...options,
          width: width + 40
        };

        return <IconOnlyLeftIncludedSegment {...newOptions} />;
      },
      ray_left_direction: () => {
        const newOptions = {
          ...options,
          width: width + 40
        };

        return <IconInfinityToIncludedSegment {...newOptions} />;
      },
      ray_right_direction: () => {
        const newOptions = {
          ...options,
          width: width + 40
        };

        return <IconIncludedToInfinitySegment {...newOptions} />;
      },
      ray_left_direction_right_hollow: () => {
        const newOptions = {
          ...options,
          width: width + 40
        };

        return <IconInfinityToNotIncludedSegment {...newOptions} />;
      },
      ray_right_direction_left_hollow: () => {
        const newOptions = {
          ...options,
          width: width + 40
        };

        return <IconNotIncludedToInfinitySegment {...newOptions} />;
      },
      trash: () => {
        const newOptions = {
          ...options,
          width: width + 10
        };
        return <IconTrash {...newOptions} />;
      },
      undo: () => "Undo",
      redo: () => "Redo",
      reset: () => "Reset"
    };

    return iconsByToolName[toolName]();
  };

  render() {
    const { layout, canvas, elements, tools, disableResponse, view, graphData, setQuestionData } = this.props;
    const { selectedTool } = this.state;
    const vertical = layout.orientation === "vertical";

    return (
      <div data-cy="axis-labels-container">
        <GraphWrapper vertical={vertical}>
          <div style={{ position: "relative" }}>
            <JSXBox id={this._graphId} className="jxgbox" margin={layout.margin} />
            <AnnotationRnd question={graphData} setQuestionData={setQuestionData} disableDragging={view !== EDIT} />
          </div>
          {!disableResponse && (
            <SegmentsTools
              tool={selectedTool}
              toolbar={tools}
              elementsNumber={(elements || []).length}
              getIconByToolName={this.getIconByToolName}
              onSelect={this.onSelectTool}
              fontSize={layout.fontSize}
              responsesAllowed={canvas.responsesAllowed}
              vertical={vertical}
            />
          )}
        </GraphWrapper>
      </div>
    );
  }
}

AxisSegmentsContainer.propTypes = {
  canvas: PropTypes.object.isRequired,
  numberlineAxis: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired,
  pointParameters: PropTypes.object.isRequired,
  xAxesParameters: PropTypes.object.isRequired,
  yAxesParameters: PropTypes.object.isRequired,
  gridParams: PropTypes.object.isRequired,
  evaluation: PropTypes.any,
  setValue: PropTypes.func.isRequired,
  elements: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
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
  elementsIsCorrect: PropTypes.bool
};

AxisSegmentsContainer.defaultProps = {
  evaluation: null,
  stash: {},
  stashIndex: {},
  altAnswerId: null,
  disableResponse: false,
  previewTab: CLEAR,
  changePreviewTab: () => {},
  elementsIsCorrect: false
};

export default connect(
  state => ({
    stash: state.graphTools.stash,
    stashIndex: state.graphTools.stashIndex
  }),
  {
    setElementsStash: setElementsStashAction,
    setStashIndex: setStashIndexAction
  }
)(AxisSegmentsContainer);
