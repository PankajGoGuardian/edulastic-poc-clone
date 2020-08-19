import React, { PureComponent, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { isEqual } from "lodash";
import next from "immer";
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
import GraphEditTools from "../../components/GraphEditTools";
import AnnotationRnd from "../../../Annotations/AnnotationRnd";

import { GraphWrapper, JSXBox } from "./styled";

import { getAdjustedHeightAndWidth, getAdjustedV1AnnotationCoordinatesForRender } from "../../common/utils";
import { Tools } from "../../../../widgets/Charts/components/Tools";

const v1Dimenstions = {
  v1Height: 432,
  v1Width: 750
};

const getColoredElems = (elements, compareResult) => {
  if (compareResult && compareResult.details && compareResult.details.length > 0) {
    const newElems = elements.map(el => {
      const detail = compareResult.details.find(det => det.shape.id === el.id);

      const red = Colors.red[CONSTANT.TOOLS.POINT];
      const green = Colors.green[CONSTANT.TOOLS.POINT];

      switch (el.type) {
        case CONSTANT.TOOLS.NUMBERLINE_PLOT_POINT:
          return {
            colors: detail && detail.result ? green : red,
            pointColor: detail && detail.result ? green : red,
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
        case CONSTANT.TOOLS.NUMBERLINE_PLOT_POINT:
          return {
            colors: Colors.green[CONSTANT.TOOLS.POINT],
            pointColor: Colors.green[CONSTANT.TOOLS.POINT],
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

class NumberLinePlotContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.MIN_WIDTH = 500;
    this.MIN_HEIGHT = 215;

    this._graphId = `jxgbox${Math.random()
      .toString(36)
      .replace(".", "")}`;
    this._graph = null;

    this.state = {
      selectedControl: ""
    };

    this.updateValues = this.updateValues.bind(this);

    this.numberLinePlotRef = React.createRef();
  }

  get parentWidth() {
    // -2 done to make room for the border when width is an integer but the actual width is slightly less
    return (this.numberLinePlotRef?.current?.clientWidth || 2) - 2;
  }

  get parentHeight() {
    // -2 done to make room for the border when width is an integer but the actual width is slightly less
    return (this.numberLinePlotRef?.current?.clientHeight || 2) - 2;
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
      setQuestionData,
      disableResponse,
      view
    } = this.props;

    this._graph = makeBorder(this._graphId, graphData.graphType);

    const adjustedHeightWidth = getAdjustedHeightAndWidth(
      this.parentWidth,
      this.parentHeight,
      layout,
      this.MIN_WIDTH,
      this.MIN_HEIGHT
    );
    if (view === EDIT) {
      setQuestionData(
        next(graphData, draft => {
          draft.prevContSize = adjustedHeightWidth;
        })
      );
    }

    if (this._graph) {
      this._graph.setDisableResponse(disableResponse);

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

      this._graph.setTool(CONSTANT.TOOLS.NUMBERLINE_PLOT_POINT);

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
      disableResponse,
      previewTab,
      changePreviewTab,
      elements,
      gridParams,
      graphData,
      setQuestionData,
      pointParameters,
      view
    } = this.props;

    const adjustedHeightWidth = getAdjustedHeightAndWidth(
      this.parentWidth,
      this.parentHeight,
      layout,
      this.MIN_WIDTH,
      this.MIN_HEIGHT
    );

    const { disableResponse: prevDisableResponse } = prevProps;
    if (disableResponse && prevDisableResponse !== disableResponse) {
      this.onReset();
    }

    if (!isEqual(graphData.prevContSize, adjustedHeightWidth) && view === EDIT) {
      setQuestionData(
        next(graphData, draft => {
          draft.prevContSize = adjustedHeightWidth;
        })
      );
    }

    if (this._graph) {
      this._graph.setDisableResponse(disableResponse);

      if (
        !isEqual(canvas, prevProps.canvas) ||
        !isEqual(numberlineAxis, prevProps.numberlineAxis) ||
        !isEqual(layout, prevProps.layout)
      ) {
        const _layout = {
          ...layout,
          ...adjustedHeightWidth
        };
        this._graph.updateNumberlineSettings(canvas, numberlineAxis, _layout);
        this._graph.segmentsReset();
        this._graph.loadSegments(elements);
      }

      if (
        pointParameters.snapToGrid !== prevProps.pointParameters.snapToGrid ||
        pointParameters.snapSizeX !== prevProps.pointParameters.snapSizeX ||
        pointParameters.snapSizeY !== prevProps.pointParameters.snapSizeY ||
        pointParameters.showInfoBox !== prevProps.pointParameters.showInfoBox ||
        pointParameters.withLabel !== prevProps.pointParameters.withLabel
      ) {
        this._graph.setPointParameters({
          ...defaultPointParameters(),
          ...pointParameters
        });
      }

      if (
        gridParams.gridY !== prevProps.gridParams.gridY ||
        gridParams.gridX !== prevProps.gridParams.gridX ||
        gridParams.showGrid !== prevProps.gridParams.showGrid
      ) {
        this._graph.setGridParameters({
          ...defaultGridParameters(),
          ...gridParams
        });
      }

      this.setElementsToGraph(prevProps);

      this._graph.resizeContainer(adjustedHeightWidth.width, adjustedHeightWidth.height);
    }

    if ((previewTab === CHECK || previewTab === SHOW) && !isEqual(elements, prevProps.elements)) {
      changePreviewTab(CLEAR);
    }
  }

  onSelectControl = name => {
    if (name === "undo") {
      this.onUndo();
      return;
    }
    if (name === "redo") {
      this.onRedo();
      return;
    }
    if (name === "clear") {
      this.onReset();
      return;
    }
    const { selectedControl } = this.state;
    if (selectedControl === name) {
      this.setState({ selectedControl: "" });
      this._graph.setTool(CONSTANT.TOOLS.NUMBERLINE_PLOT_POINT);
    } else {
      this.setState({ selectedControl: name });
      this._graph.setTool(name);
    }
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
    this._graph.events.on(CONSTANT.EVENT_NAMES.CHANGE_UPDATE, () => this.updateValues());
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

  render() {
    const { layout, disableResponse, view, graphData, setQuestionData, isPrintPreview } = this.props;
    const { selectedControl } = this.state;
    const {
      controlbar: { controls = [] },
      isV1Migrated
    } = graphData;

    const adjustedHeightWidth = getAdjustedHeightAndWidth(
      this.parentWidth,
      this.parentHeight,
      layout,
      this.MIN_WIDTH,
      this.MIN_HEIGHT
    );

    const _layout = {
      ...layout,
      ...adjustedHeightWidth
    };

    let _graphData = graphData;
    if (isV1Migrated) {
      _graphData = next(graphData, __graphData => {
        if (__graphData.annotations) {
          for (const o of __graphData.annotations) {
            const co = getAdjustedV1AnnotationCoordinatesForRender(adjustedHeightWidth, layout, o, v1Dimenstions);
            o.position.x = co.x;
            o.position.y = co.y;
            o.size.width = co.width;
            o.size.height = co.height;
          }
        }
      });
    }

    return (
      <div
        data-cy="numberline-plot-container"
        ref={this.numberLinePlotRef}
        style={{ overflowX: "hidden", width: "100%" }}
        className="__prevent-page-break"
      >
        {!disableResponse && !isPrintPreview && (
          <Tools tools={selectedControl} controls={controls} setTool={this.onSelectControl} justifyContent="flex-end" />
        )}
        <GraphWrapper>
          <div style={{ position: "relative" }}>
            <JSXBox id={this._graphId} margin={layout.margin} className="jxgbox __prevent-page-break" />
            {view === EDIT && !disableResponse && (
              <Fragment>
                <GraphEditTools
                  side="left"
                  hideEquationTool
                  graphData={graphData}
                  setQuestionData={setQuestionData}
                  layout={_layout}
                />
                <GraphEditTools
                  side="right"
                  hideSettingTool
                  graphData={graphData}
                  setQuestionData={setQuestionData}
                  layout={_layout}
                />
              </Fragment>
            )}
            <AnnotationRnd
              question={_graphData}
              setQuestionData={setQuestionData}
              disableDragging={view !== EDIT}
              adjustedHeightWidth={adjustedHeightWidth}
              layout={layout}
              noBorder={view !== EDIT}
              bounds={`#${this._graphId}`}
              v1Dimenstions={v1Dimenstions}
            />
          </div>
        </GraphWrapper>
      </div>
    );
  }
}

NumberLinePlotContainer.propTypes = {
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
  view: PropTypes.string.isRequired,
  setElementsStash: PropTypes.func.isRequired,
  setStashIndex: PropTypes.func.isRequired,
  stash: PropTypes.object,
  stashIndex: PropTypes.object,
  graphData: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  setQuestionData: PropTypes.func.isRequired,
  altAnswerId: PropTypes.string,
  disableResponse: PropTypes.bool,
  previewTab: PropTypes.string,
  changePreviewTab: PropTypes.func,
  elementsIsCorrect: PropTypes.bool
};

NumberLinePlotContainer.defaultProps = {
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
)(NumberLinePlotContainer);
