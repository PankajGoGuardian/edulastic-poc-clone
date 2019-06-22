import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { isEqual } from "lodash";
import { graph as checkAnswerMethod } from "@edulastic/evaluators";
import { WithResources } from "@edulastic/common";
import { GraphWrapper, JSXBox } from "./styled";
import {
  defaultAxesParameters,
  defaultGraphParameters,
  defaultGridParameters,
  defaultPointParameters
} from "../../Builder/settings";
import { makeBorder } from "../../Builder";
import Tools from "../QuadrantsContainer/Tools";
import { setElementsStashAction, setStashIndexAction } from "../../../../actions/graphTools";
import AnnotationRnd from "../../Annotations/AnnotationRnd";

const getColoredElems = (elements, compareResult) => {
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
};

const getColoredAnswer = answerArr => {
  if (Array.isArray(answerArr)) {
    return answerArr.map(el => ({
      className: "show",
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

    this._graphId = `jxgbox${Math.random().toString(36)}`;
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
      setElementsStash
    } = this.props;
    this._graph = makeBorder(this._graphId, graphType);

    if (this._graph) {
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

      this._graph.updateNumberlineSettings(canvas, numberlineAxis, layout, true, this.setMarks);

      this._graph.setMarksDeleteHandler();

      this.setElementsToGraph();

      setElementsStash(this._graph.getMarks(), this.getStashId());
    }
  }

  componentDidUpdate(prevProps) {
    const { canvas, numberlineAxis, layout, list, setValue } = this.props;

    if (this._graph) {
      if (
        !isEqual(canvas, prevProps.canvas) ||
        !isEqual(numberlineAxis, prevProps.numberlineAxis) ||
        !isEqual(layout, prevProps.layout)
      ) {
        this._graph.updateNumberlineSettings(canvas, numberlineAxis, layout, false, this.setMarks);
      }

      this.setElementsToGraph(prevProps);

      if (!isEqual(prevProps.list, list) && !this.elementsIsEmpty()) {
        const conf = this._graph.getMarks();
        setValue(conf);
      }
    }
  }

  setMarks = () => {
    const conf = this._graph.getMarks();
    const { setValue, checkAnswer, changePreviewTab, setElementsStash } = this.props;
    setValue(conf);
    setElementsStash(conf, this.getStashId());

    if (checkAnswer) {
      changePreviewTab("clear");
    }
  };

  setElementsToGraph = (prevProps = {}) => {
    const { resourcesLoaded } = this.state;
    if (!resourcesLoaded) {
      return;
    }

    const { elements, checkAnswer, showAnswer, evaluation, validation, list, layout } = this.props;

    if (checkAnswer || showAnswer) {
      if (showAnswer) {
        this._graph.removeMarksAnswers();
        this._graph.loadMarksAnswers(list, getColoredAnswer(validation ? validation.valid_response.value : []));
      }

      this._graph.removeMarks();

      if (!this.elementsIsEmpty()) {
        let coloredElements;
        if (evaluation && checkAnswer) {
          const compareResult = getCompareResult(evaluation);
          coloredElements = getColoredElems(elements, compareResult);
        } else {
          const compareResult = getCompareResult(checkAnswerMethod({ userResponse: elements, validation }).evaluation);
          coloredElements = getColoredElems(elements, compareResult);
        }

        this._graph.renderMarks(list, coloredElements, layout);
      } else {
        this._graph.renderMarks(list, [], layout);
      }
    } else if (!isEqual(elements, this._graph.getMarks()) || this.elementsIsEmpty() || !isEqual(prevProps.list, list)) {
      this._graph.removeMarks();
      this._graph.removeMarksAnswers();
      this._graph.renderMarks(list, elements, layout);
    }
  };

  elementsIsEmpty = () => {
    const { elements } = this.props;
    return !elements || elements.length === 0;
  };

  controls = ["undo", "redo"];

  onUndo = () => {
    const { stash, stashIndex, setStashIndex, setValue, list, layout } = this.props;
    const id = this.getStashId();
    if (stashIndex[id] > 0 && stashIndex[id] <= stash[id].length - 1) {
      this._graph.removeMarks();
      this._graph.renderMarks(list, stash[id][stashIndex[id] - 1], layout);
      setValue(stash[id][stashIndex[id] - 1]);
      setStashIndex(stashIndex[id] - 1, id);
    }
  };

  onRedo() {
    const { stash, stashIndex, setStashIndex, setValue, list, layout } = this.props;
    const id = this.getStashId();
    if (stashIndex[id] >= 0 && stashIndex[id] < stash[id].length - 1) {
      this._graph.removeMarks();
      this._graph.renderMarks(list, stash[id][stashIndex[id] - 1], layout);
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
    const { layout, numberlineAxis, questionId } = this.props;

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
          <Tools
            controls={this.controls}
            getIconByToolName={() => ""}
            getHandlerByControlName={this.getHandlerByControlName}
            onSelect={() => {}}
            fontSize={numberlineAxis.fontSize}
          />
          <JSXBox id={this._graphId} className="jxgbox" margin={layout.margin} />
          <AnnotationRnd questionId={questionId} disableDragging={false} />
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
  validation: PropTypes.object.isRequired,
  elements: PropTypes.array.isRequired,
  showAnswer: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  changePreviewTab: PropTypes.func,
  view: PropTypes.string.isRequired,
  setElementsStash: PropTypes.func.isRequired,
  setStashIndex: PropTypes.func.isRequired,
  stash: PropTypes.object,
  stashIndex: PropTypes.object,
  questionId: PropTypes.string.isRequired,
  altAnswerId: PropTypes.string
};

AxisLabelsContainer.defaultProps = {
  list: [],
  evaluation: null,
  showAnswer: false,
  checkAnswer: false,
  changePreviewTab: () => {},
  stash: {},
  stashIndex: {},
  altAnswerId: null
};

export default connect(
  state => ({
    stash: state.graphTools.stash,
    stashIndex: state.graphTools.stashIndex,
    view: state.view.view
  }),
  {
    setElementsStash: setElementsStashAction,
    setStashIndex: setStashIndexAction
  }
)(AxisLabelsContainer);
