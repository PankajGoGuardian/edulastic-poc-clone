import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { isEqual } from "lodash";

import { WithResources } from "@edulastic/common";

import { CHECK, CLEAR, EDIT, SHOW } from "../../../../constants/constantsForQuestions";
import { setElementsStashAction, setStashIndexAction } from "../../../../actions/graphTools";

import {
  defaultAxesParameters,
  defaultGraphParameters,
  defaultGridParameters,
  defaultPointParameters
} from "../../Builder/settings";
import { makeBorder } from "../../Builder";
import { CONSTANT } from "../../Builder/config";

import AnnotationRnd from "../../../Annotations/AnnotationRnd";

import Tools from "../../common/Tools";
import ResponseBox, { defaultTitleWidth as responseBoxTitleWidth } from "./ResponseBox";
import { GraphWrapper, JSXBox, ContainerWithResponses, StyledToolsContainer } from "./styled";
import { getAdjustedHeightAndWidth } from "../../common/utils";

const getColoredElems = (elements, compareResult) => {
  if (compareResult && compareResult.details && compareResult.details.length > 0) {
    const { details } = compareResult;
    return elements.map(el => {
      const detail = details && details.find(det => det.label.id === el.id);
      let newEl = {};

      if (detail && detail.result) {
        newEl = {
          className: "correct",
          ...el
        };
      } else {
        newEl = {
          className: "incorrect",
          ...el
        };
      }
      return newEl;
    });
  }
  return elements;
};

const getCorrectAnswer = answerArr => {
  if (Array.isArray(answerArr)) {
    return answerArr.map(el => ({
      className: "correct",
      ...el
    }));
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

class AxisLabelsContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.MIN_WIDTH = 500;
    this.MIN_HEIGHT = 150;

    this._graphId = `jxgbox${Math.random()
      .toString(36)
      .replace(".", "")}`;
    this._graph = null;

    this.state = {
      resourcesLoaded: false
    };

    this.parentWidth = 0;
    this.parentHeight = 0;

    this.updateValues = this.updateValues.bind(this);

    this.axisLabelsContainerRef = React.createRef();
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
      disableResponse,
      view,
      numberlineAxis: { responseBoxPosition }
    } = this.props;

    this.parentWidth = this.axisLabelsContainerRef?.current?.clientWidth;
    this.parentHeight = this.axisLabelsContainerRef?.current?.clientHeight;

    const adjustedHeightWidth = getAdjustedHeightAndWidth(
      this.parentWidth,
      this.parentHeight,
      layout,
      this.MIN_WIDTH,
      this.MIN_HEIGHT,
      responseBoxPosition,
      responseBoxTitleWidth
    );

    this._graph = makeBorder(this._graphId, graphData.graphType);

    if (this._graph) {
      this._graph.setDisableResponse(disableResponse);

      this._graph.resizeContainer(adjustedHeightWidth.width, adjustedHeightWidth.height);

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

      const _numberlineAxis = {
        ...numberlineAxis,
        shuffleAnswerChoices: view !== EDIT && numberlineAxis.shuffleAnswerChoices
      };
      const _layout = {
        ...layout,
        ...adjustedHeightWidth
      };
      this._graph.updateNumberlineSettings(canvas, _numberlineAxis, _layout);

      this._graph.setMarksDeleteHandler();

      this.setElementsToGraph();

      this.setGraphUpdateEventHandler();
      setElementsStash(this._graph.getMarks(), this.getStashId());
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
      numberlineAxis: { responseBoxPosition }
    } = this.props;

    const adjustedHeightWidth = getAdjustedHeightAndWidth(
      this.parentWidth,
      this.parentHeight,
      layout,
      this.MIN_WIDTH,
      this.MIN_HEIGHT,
      responseBoxPosition,
      responseBoxTitleWidth
    );

    if (this._graph) {
      this._graph.setDisableResponse(disableResponse);

      if (
        !isEqual(canvas, prevProps.canvas) ||
        !isEqual(numberlineAxis, prevProps.numberlineAxis) ||
        !isEqual(layout, prevProps.layout)
      ) {
        const _numberlineAxis = {
          ...numberlineAxis,
          shuffleAnswerChoices: view !== EDIT && numberlineAxis.shuffleAnswerChoices
        };

        const _layout = {
          ...layout,
          ...adjustedHeightWidth
        };
        this._graph.updateNumberlineSettings(canvas, _numberlineAxis, _layout);
      }

      this.setElementsToGraph(prevProps);
    }

    const { disableResponse: prevDisableResponse } = prevProps;
    if (disableResponse && prevDisableResponse != disableResponse) {
      // reset the graph when editResponse is disabled
      this._graph.reset();
    }

    if ((previewTab === CHECK || previewTab === SHOW) && !isEqual(elements, prevProps.elements)) {
      changePreviewTab(CLEAR);
    }
  }

  updateValues() {
    const conf = this._graph.getMarks();
    const { setValue, setElementsStash } = this.props;
    setValue(conf);
    setElementsStash(conf, this.getStashId());
  }

  graphUpdateHandler = () => {
    this.updateValues();
  };

  setGraphUpdateEventHandler = () => {
    this._graph.events.on(CONSTANT.EVENT_NAMES.CHANGE_MOVE, this.graphUpdateHandler);
    this._graph.events.on(CONSTANT.EVENT_NAMES.CHANGE_NEW, this.graphUpdateHandler);
    this._graph.events.on(CONSTANT.EVENT_NAMES.CHANGE_UPDATE, this.graphUpdateHandler);
    this._graph.events.on(CONSTANT.EVENT_NAMES.CHANGE_DELETE, this.graphUpdateHandler);
  };

  setElementsToGraph = (prevProps = {}) => {
    const { resourcesLoaded } = this.state;
    if (!resourcesLoaded) {
      return;
    }

    const { elements, evaluation, disableResponse, elementsIsCorrect, previewTab } = this.props;

    let _elements = elements.map(item => {
      let point = item.point;
      if (item.point.indexOf("<p>") === 0) {
        point = `<p title="${item.point.substring(3, item.point.length - 4)}">${item.point.substring(
          3,
          item.point.length - 4
        )}</p>`;
      }
      return {
        ...item,
        point
      };
    });

    // correct answers blocks
    if (elementsIsCorrect) {
      this._graph.removeMarksAnswers();
      this._graph.loadMarksAnswers(getCorrectAnswer(_elements));
      return;
    }

    if (disableResponse) {
      const compareResult = getCompareResult(evaluation);
      const coloredElements = getColoredElems(_elements, compareResult);
      this._graph.removeMarks();
      this._graph.removeMarksAnswers();
      this._graph.loadMarksAnswers(coloredElements);
      return;
    }

    if (previewTab === CHECK || previewTab === SHOW) {
      const compareResult = getCompareResult(evaluation);
      const coloredElements = getColoredElems(_elements, compareResult);
      this._graph.removeMarks();
      this._graph.removeMarksAnswers();
      this._graph.renderMarks(coloredElements);
      return;
    }

    if (
      !isEqual(_elements, this._graph.getMarks()) ||
      (previewTab === CLEAR && (prevProps.previewTab === CHECK || prevProps.previewTab === SHOW))
    ) {
      this._graph.removeMarks();
      this._graph.removeMarksAnswers();
      this._graph.renderMarks(_elements);
    }
  };

  controls = ["undo", "redo"];

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

  getStashId() {
    const { graphData, altAnswerId, view } = this.props;
    const type = altAnswerId || view;
    return `${graphData.id}_${type}`;
  }

  onSelectControl = control => {
    switch (control) {
      case "undo":
        return this.onUndo();
      case "redo":
        return this.onRedo();
      default:
        return () => {};
    }
  };

  resourcesOnLoaded = () => {
    const { resourcesLoaded } = this.state;
    if (resourcesLoaded) {
      return;
    }
    this.setState({ resourcesLoaded: true });
    this.setElementsToGraph();
  };

  onAddMark = (mark, x, y) => {
    if (this._graph.addMark(mark, x, y)) {
      this.updateValues();
    }
  };

  getMarkValues = () => {
    const { list, elements } = this.props;
    return list.filter(elem => !elements.some(el => elem.id === el.id));
  };

  render() {
    const {
      layout,
      numberlineAxis: { responseBoxPosition, separationDistanceX, separationDistanceY },
      disableResponse,
      view,
      graphData,
      setQuestionData,
      list
    } = this.props;

    const adjustedHeightWidth = getAdjustedHeightAndWidth(
      this.parentWidth,
      this.parentHeight,
      layout,
      this.MIN_WIDTH,
      this.MIN_HEIGHT,
      responseBoxPosition,
      responseBoxTitleWidth
    );

    return (
      <div data-cy="axis-labels-container" ref={this.axisLabelsContainerRef}>
        <WithResources
          resources={[
            "https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js",
            "https://cdn.jsdelivr.net/npm/katex@0.10.2/dist/katex.min.js"
          ]}
          fallBack={<span />}
          onLoaded={this.resourcesOnLoaded}
        >
          <span />
        </WithResources>
        <GraphWrapper>
          <ContainerWithResponses className="jsxbox-with-response-box" responseBoxPosition={responseBoxPosition}>
            <div className={`jsxbox-with-response-box-response-options ${this._graphId}`}>
              {!disableResponse && (
                <ResponseBox
                  bounds={`.jsxbox-with-response-box-response-options.${this._graphId}`}
                  values={this.getMarkValues()}
                  onAddMark={this.onAddMark}
                  markCount={(list || []).length}
                  separationDistanceX={separationDistanceX}
                  separationDistanceY={separationDistanceY}
                  position={responseBoxPosition}
                  minWidth={Math.min(adjustedHeightWidth.width, this.parentWidth)}
                  minHeight={adjustedHeightWidth.height}
                />
              )}
              <div style={{ position: "relative", overflow: "auto" }}>
                {!disableResponse && (
                  <StyledToolsContainer>
                    <Tools
                      controls={this.controls}
                      onSelectControl={this.onSelectControl}
                      onSelect={() => {}}
                      fontSize={layout?.fontSize}
                    />
                  </StyledToolsContainer>
                )}
                <JSXBox id={this._graphId} className="jxgbox" margin={layout.margin} />
                <AnnotationRnd question={graphData} setQuestionData={setQuestionData} disableDragging={view !== EDIT} />
              </div>
            </div>
          </ContainerWithResponses>
        </GraphWrapper>
      </div>
    );
  }
}

AxisLabelsContainer.propTypes = {
  canvas: PropTypes.object.isRequired,
  numberlineAxis: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired,
  pointParameters: PropTypes.object.isRequired,
  xAxesParameters: PropTypes.object.isRequired,
  yAxesParameters: PropTypes.object.isRequired,
  gridParams: PropTypes.object.isRequired,
  list: PropTypes.array,
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
  elementsIsCorrect: PropTypes.bool
};

AxisLabelsContainer.defaultProps = {
  list: [],
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
)(AxisLabelsContainer);
