import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { isEqual } from "lodash";
import { graph as checkAnswerMethod } from "@edulastic/evaluators";
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
  if (!evaluation && !evaluation.evaluation) {
    return null;
  }

  let compareResult = null;

  Object.keys(evaluation.evaluation).forEach(key => {
    if (compareResult) {
      return;
    }
    if (evaluation.evaluation[key].commonResult) {
      compareResult = evaluation.evaluation[key];
    }
  });

  if (compareResult) {
    return compareResult;
  }

  return evaluation.evaluation[0];
};

class AxisLabelsContainer extends PureComponent {
  constructor(props) {
    super(props);

    this._graphId = `jxgbox${Math.random().toString(36)}`;
    this._graph = null;
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
    this._graph = makeBorder(this._graphId);

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

      this._graph.renderTitle({
        position: layout.titlePosition,
        title: canvas.title,
        xMin: canvas.xMin,
        xMax: canvas.xMax,
        yMax: canvas.yMax,
        yMin: canvas.yMin
      });

      this._graph.makeNumberlineAxis(
        canvas,
        numberlineAxis,
        layout,
        graphType,
        { position: layout.linePosition, yMax: canvas.yMax, yMin: canvas.yMin },
        {
          position: layout.pointBoxPosition,
          yMax: canvas.yMax,
          yMin: canvas.yMin
        }
      );

      this._graph.setNumberlineSnapToTicks(numberlineAxis.snapToTicks);

      this.setElementsToGraph();

      setElementsStash(this._graph.getMarks(), this.getStashId());
    }
  }

  componentDidUpdate(prevProps) {
    const {
      canvas,
      numberlineAxis,
      pointParameters,
      xAxesParameters,
      yAxesParameters,
      layout,
      graphType,
      gridParams,
      list,
      setValue
    } = this.props;

    if (this._graph) {
      if (
        canvas.xMin !== prevProps.canvas.xMin ||
        canvas.xMax !== prevProps.canvas.xMax ||
        canvas.yMin !== prevProps.canvas.yMin ||
        canvas.yMax !== prevProps.canvas.yMax ||
        canvas.margin !== prevProps.canvas.margin ||
        canvas.title !== prevProps.canvas.title
      ) {
        this._graph.updateGraphParameters(
          canvas,
          numberlineAxis,
          layout,
          graphType,
          this.setMarks,
          {
            position: layout.linePosition,
            yMax: canvas.yMax,
            yMin: canvas.yMin
          },
          {
            position: layout.pointBoxPosition,
            yMax: canvas.yMax,
            yMin: canvas.yMin
          }
        );
        this._graph.updateTitle({
          position: layout.titlePosition,
          title: canvas.title,
          xMin: canvas.xMin,
          xMax: canvas.xMax,
          yMax: canvas.yMax,
          yMin: canvas.yMin
        });
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
        xAxesParameters.ticksDistance !== prevProps.xAxesParameters.ticksDistance ||
        xAxesParameters.name !== prevProps.xAxesParameters.name ||
        xAxesParameters.showTicks !== prevProps.xAxesParameters.showTicks ||
        xAxesParameters.drawLabels !== prevProps.xAxesParameters.drawLabels ||
        xAxesParameters.maxArrow !== prevProps.xAxesParameters.maxArrow ||
        xAxesParameters.minArrow !== prevProps.xAxesParameters.minArrow ||
        xAxesParameters.commaInLabel !== prevProps.xAxesParameters.commaInLabel ||
        xAxesParameters.strokeColor !== prevProps.xAxesParameters.strokeColor ||
        xAxesParameters.tickEndings !== prevProps.xAxesParameters.tickEndings ||
        yAxesParameters.ticksDistance !== prevProps.yAxesParameters.ticksDistance ||
        yAxesParameters.name !== prevProps.yAxesParameters.name ||
        yAxesParameters.showTicks !== prevProps.yAxesParameters.showTicks ||
        yAxesParameters.drawLabels !== prevProps.yAxesParameters.drawLabels ||
        yAxesParameters.maxArrow !== prevProps.yAxesParameters.maxArrow ||
        yAxesParameters.minArrow !== prevProps.yAxesParameters.minArrow ||
        yAxesParameters.commaInLabel !== prevProps.yAxesParameters.commaInLabel ||
        yAxesParameters.visible !== prevProps.yAxesParameters.visible
      ) {
        this._graph.setAxesParameters({
          x: {
            ...defaultAxesParameters(),
            ...xAxesParameters
          },
          y: {
            ...defaultAxesParameters(),
            ...yAxesParameters
          }
        });
      }

      if (
        layout.width !== prevProps.layout.width ||
        layout.height !== prevProps.layout.height ||
        layout.titlePosition !== prevProps.layout.titlePosition ||
        layout.linePosition !== prevProps.layout.linePosition ||
        layout.pointBoxPosition !== prevProps.layout.pointBoxPosition
      ) {
        this._graph.resizeContainer(layout.width, layout.height);
        this._graph.updateGraphParameters(
          canvas,
          numberlineAxis,
          layout,
          graphType,
          this.setMarks,
          {
            position: layout.linePosition,
            yMax: canvas.yMax,
            yMin: canvas.yMin
          },
          {
            position: layout.pointBoxPosition,
            yMax: canvas.yMax,
            yMin: canvas.yMin
          }
        );
        this._graph.updateTitle({
          position: layout.titlePosition,
          title: canvas.title,
          xMin: canvas.xMin,
          xMax: canvas.xMax,
          yMax: canvas.yMax,
          yMin: canvas.yMin
        });
      }

      if (gridParams.gridY !== prevProps.gridParams.gridY || gridParams.gridX !== prevProps.gridParams.gridX) {
        this._graph.setGridParameters({
          ...defaultGridParameters(),
          ...gridParams
        });
      }

      if (
        numberlineAxis.showMin !== prevProps.numberlineAxis.showMin ||
        numberlineAxis.showMax !== prevProps.numberlineAxis.showMax ||
        numberlineAxis.ticksDistance !== prevProps.numberlineAxis.ticksDistance ||
        numberlineAxis.labelsFrequency !== prevProps.numberlineAxis.labelsFrequency ||
        numberlineAxis.snapToTicks !== prevProps.numberlineAxis.snapToTicks ||
        numberlineAxis.leftArrow !== prevProps.numberlineAxis.leftArrow ||
        numberlineAxis.rightArrow !== prevProps.numberlineAxis.rightArrow ||
        numberlineAxis.separationDistanceX !== prevProps.numberlineAxis.separationDistanceX ||
        numberlineAxis.separationDistanceY !== prevProps.numberlineAxis.separationDistanceY ||
        numberlineAxis.renderingBase !== prevProps.numberlineAxis.renderingBase ||
        numberlineAxis.specificPoints !== prevProps.numberlineAxis.specificPoints ||
        numberlineAxis.fractionsFormat !== prevProps.numberlineAxis.fractionsFormat ||
        numberlineAxis.minorTicks !== prevProps.numberlineAxis.minorTicks ||
        numberlineAxis.labelShowMax !== prevProps.numberlineAxis.labelShowMax ||
        numberlineAxis.labelShowMin !== prevProps.numberlineAxis.labelShowMin ||
        numberlineAxis.showTicks !== prevProps.numberlineAxis.showTicks ||
        numberlineAxis.fontSize !== prevProps.numberlineAxis.fontSize
      ) {
        this._graph.updateGraphParameters(
          canvas,
          numberlineAxis,
          layout,
          graphType,
          this.setMarks,
          {
            position: layout.linePosition,
            yMax: canvas.yMax,
            yMin: canvas.yMin
          },
          {
            position: layout.pointBoxPosition,
            yMax: canvas.yMax,
            yMin: canvas.yMin
          }
        );
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

  getOptions = () => {
    const { canvas, numberlineAxis, layout } = this.props;

    return [
      canvas,
      numberlineAxis,
      this.setMarks,
      {
        position: layout.linePosition,
        yMax: canvas.yMax,
        yMin: canvas.yMin
      },
      {
        position: layout.pointBoxPosition,
        yMax: canvas.yMax,
        yMin: canvas.yMin
      }
    ];
  };

  setElementsToGraph = (prevProps = {}) => {
    const { elements, checkAnswer, showAnswer, evaluation, validation, list } = this.props;

    if (checkAnswer || showAnswer) {
      if (showAnswer && !prevProps.showAnswer) {
        this._graph.removeMarksAnswers();
        this._graph.loadMarksAnswers(
          list,
          ...this.getOptions(),
          getColoredAnswer(validation ? validation.valid_response.value : [])
        );
      }

      this._graph.removeMarks();

      if (!this.elementsIsEmpty()) {
        let coloredElements;
        if (evaluation && evaluation.length) {
          const compareResult = getCompareResult(evaluation);
          coloredElements = getColoredElems(elements, compareResult);
        } else {
          const compareResult = getCompareResult(
            checkAnswerMethod({
              userResponse: elements,
              validation
            })
          );
          coloredElements = getColoredElems(elements, compareResult);
        }

        this._graph.renderMarks(list, ...this.getOptions(), coloredElements);
      } else {
        this._graph.renderMarks(list, ...this.getOptions(), []);
      }
    } else if (!isEqual(elements, this._graph.getMarks()) || this.elementsIsEmpty() || !isEqual(prevProps.list, list)) {
      this._graph.removeMarks();
      this._graph.removeMarksAnswers();
      this._graph.renderMarks(list, ...this.getOptions(), elements);
    }
  };

  elementsIsEmpty = () => {
    const { elements } = this.props;
    return !elements || elements.length === 0;
  };

  controls = ["undo", "redo"];

  onUndo = () => {
    const { stash, stashIndex, setStashIndex, setValue, list } = this.props;
    const id = this.getStashId();
    if (stashIndex[id] > 0 && stashIndex[id] <= stash[id].length - 1) {
      this._graph.removeMarks();
      this._graph.renderMarks(list, ...this.getOptions(), stash[id][stashIndex[id] - 1]);
      setValue(stash[id][stashIndex[id] - 1]);
      setStashIndex(stashIndex[id] - 1, id);
    }
  };

  onRedo() {
    const { stash, stashIndex, setStashIndex, setValue, list } = this.props;
    const id = this.getStashId();
    if (stashIndex[id] >= 0 && stashIndex[id] < stash[id].length - 1) {
      this._graph.removeMarks();
      this._graph.renderMarks(list, ...this.getOptions(), stash[id][stashIndex[id] - 1]);
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

  render() {
    const { layout, numberlineAxis, questionId } = this.props;

    return (
      <div data-cy="axis-labels-container" style={{ overflow: "auto" }}>
        <GraphWrapper>
          <Tools
            controls={this.controls}
            getIconByToolName={() => ""}
            getHandlerByControlName={this.getHandlerByControlName}
            onSelect={() => {}}
            fontSize={numberlineAxis.fontSize}
          />
          <JSXBox id={this._graphId} className="jxgbox" margin={layout.margin} />
          <AnnotationRnd questionId={questionId} />
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
