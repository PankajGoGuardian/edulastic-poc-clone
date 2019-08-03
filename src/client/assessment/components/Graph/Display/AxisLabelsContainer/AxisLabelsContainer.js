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
import { AUTO_HEIGHT_VALUE, AUTO_VALUE } from "../../Builder/config/constants";

import AnnotationRnd from "../../../Annotations/AnnotationRnd";

import Tools from "../../common/Tools";
import { GraphWrapper, JSXBox } from "./styled";

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

    this._graphId = `jxgbox${Math.random()
      .toString(36)
      .replace(".", "")}`;
    this._graph = null;

    this.state = {
      resourcesLoaded: false
    };
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
      graphType,
      setElementsStash,
      setCalculatedHeight,
      disableResponse,
      view
    } = this.props;
    this._graph = makeBorder(this._graphId, graphType);

    if (this._graph) {
      this._graph.setDisableResponse(disableResponse);

      let { height } = layout;
      if (height === AUTO_VALUE) {
        height = layout.autoCalcHeight || AUTO_HEIGHT_VALUE;
      } else if (Number.isNaN(Number.parseFloat(height))) {
        height = 0;
      }
      this._graph.resizeContainer(layout.width, height);

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
      this._graph.updateNumberlineSettings(canvas, _numberlineAxis, layout, true, this.setMarks, setCalculatedHeight);

      this._graph.setMarksDeleteHandler();

      this.setElementsToGraph();

      setElementsStash(this._graph.getMarks(), this.getStashId());
    }
  }

  componentDidUpdate(prevProps) {
    const {
      canvas,
      numberlineAxis,
      layout,
      list,
      setValue,
      setCalculatedHeight,
      disableResponse,
      previewTab,
      changePreviewTab,
      elements,
      view
    } = this.props;

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
        this._graph.updateNumberlineSettings(
          canvas,
          _numberlineAxis,
          layout,
          false,
          this.setMarks,
          setCalculatedHeight
        );
      }

      this.setElementsToGraph(prevProps);

      if (!isEqual(prevProps.list, list) && !this.elementsIsEmpty()) {
        const conf = this._graph.getMarks();
        setValue(conf);
      }
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

  setMarks = () => {
    const conf = this._graph.getMarks();
    const { setValue, setElementsStash } = this.props;
    setValue(conf);
    setElementsStash(conf, this.getStashId());
  };

  setElementsToGraph = (prevProps = {}) => {
    const { resourcesLoaded } = this.state;
    if (!resourcesLoaded) {
      return;
    }

    const { elements, evaluation, list, disableResponse, elementsIsCorrect, previewTab } = this.props;

    // correct answers blocks
    if (elementsIsCorrect) {
      this._graph.removeMarksAnswers();
      this._graph.loadMarksAnswers(list, getCorrectAnswer(elements));
      return;
    }

    if (disableResponse) {
      this._graph.removeMarks();
      this._graph.removeMarksAnswers();
      if (!this.elementsIsEmpty()) {
        const compareResult = getCompareResult(evaluation);
        const coloredElements = getColoredElems(elements, compareResult);
        this._graph.loadMarksAnswers(list, coloredElements);
      } else {
        this._graph.loadMarksAnswers(list, []);
      }
      return;
    }

    if (previewTab === CHECK || previewTab === SHOW) {
      this._graph.removeMarks();
      this._graph.removeMarksAnswers();
      if (!this.elementsIsEmpty()) {
        const compareResult = getCompareResult(evaluation);
        const coloredElements = getColoredElems(elements, compareResult);
        this._graph.renderMarks(list, coloredElements);
      } else {
        this._graph.renderMarks(list, []);
      }
      return;
    }

    if (
      !isEqual(elements, this._graph.getMarks()) ||
      this.elementsIsEmpty() ||
      !isEqual(prevProps.list, list) ||
      (previewTab === CLEAR && (prevProps.previewTab === CHECK || prevProps.previewTab === SHOW))
    ) {
      this._graph.removeMarks();
      this._graph.removeMarksAnswers();
      this._graph.renderMarks(list, elements);
    }
  };

  elementsIsEmpty = () => {
    const { elements } = this.props;
    return !elements || elements.length === 0;
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
    const { questionId, altAnswerId, view } = this.props;
    const type = altAnswerId || view;
    return `${questionId}_${type}`;
  }

  getHandlerByControlName = control => {
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

  render() {
    const { layout, numberlineAxis, questionId, disableResponse, view } = this.props;

    return (
      <div data-cy="axis-labels-container" style={{ overflow: "auto" }}>
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
          {!disableResponse && (
            <Tools
              controls={this.controls}
              getIconByToolName={() => ""}
              getHandlerByControlName={this.getHandlerByControlName}
              onSelect={() => {}}
              fontSize={numberlineAxis.fontSize}
            />
          )}
          <div style={{ position: "relative" }}>
            <JSXBox id={this._graphId} className="jxgbox" margin={layout.margin} />
            <AnnotationRnd questionId={questionId} disableDragging={view !== EDIT} />
          </div>
        </GraphWrapper>
      </div>
    );
  }
}

AxisLabelsContainer.propTypes = {
  graphType: PropTypes.string.isRequired,
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
  questionId: PropTypes.string.isRequired,
  altAnswerId: PropTypes.string,
  setCalculatedHeight: PropTypes.func.isRequired,
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
