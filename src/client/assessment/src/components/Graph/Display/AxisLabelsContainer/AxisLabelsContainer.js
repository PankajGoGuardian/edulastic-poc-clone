import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graph as checkAnswerMethod } from '@edulastic/evaluators';
import { GraphWrapper, JSXBox } from './styled';
import {
  defaultAxesParameters, defaultGraphParameters, defaultGridParameters,
  defaultPointParameters
} from '../../Builder/settings';
import { makeBorder } from '../../Builder';

const getColoredElems = (elements, compareResult) => {
  // todo: need implementation
  console.log(compareResult);
  return elements;
};

const getColoredAnswer = (answerArr) => {
  // todo: need implementation
  console.log(answerArr);
  return answerArr;
};

const getCompareResult = (evaluation) => {
  if (!evaluation && !evaluation.evaluation) {
    return null;
  }

  let compareResult = null;

  Object.keys(evaluation.evaluation).forEach((key) => {
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

class AxisLabelsContainer extends Component {
  constructor(props) {
    super(props);

    this._graphId = `jxgbox${Math.random().toString(36)}`;
    this._graph = null;

    this.onReset = this.onReset.bind(this);
    this.getConfig = this.getConfig.bind(this);
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
      list,
      showAnswer,
      validation
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

      this._graph.makeNumberlineAxis(canvas, numberlineAxis, layout, graphType);
      this._graph.renderMarks(list, [canvas.xMin, canvas.xMax], numberlineAxis);

      if (showAnswer) {
        this._graph.setAnswer(getColoredAnswer(validation ? validation.valid_response.value : []));
      } else {
        this._graph.removeAnswers();
      }
    }

    this.mapElementsToGraph();

    this.setGraphUpdateEventHandler();
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
      elements
    } = this.props;

    if (this._graph) {
      if (canvas.xMin !== prevProps.canvas.xMin
        || canvas.xMax !== prevProps.canvas.xMax
        || canvas.yMin !== prevProps.canvas.yMin
        || canvas.yMax !== prevProps.canvas.yMax
        || canvas.margin !== prevProps.canvas.margin
      ) {
        this._graph.updateGraphParameters(canvas, numberlineAxis, layout, graphType);
      }

      if (numberlineAxis.leftArrow !== prevProps.numberlineAxis.leftArrow
        || numberlineAxis.rightArrow !== prevProps.numberlineAxis.rightArrow
        || numberlineAxis.showTicks !== prevProps.numberlineAxis.showTicks
        || numberlineAxis.fontSize !== prevProps.numberlineAxis.fontSize
      ) {
        this._graph.updateGraphSettings(numberlineAxis, graphType);
      }

      if (pointParameters.snapToGrid !== prevProps.pointParameters.snapToGrid
        || pointParameters.snapSizeX !== prevProps.pointParameters.snapSizeX
        || pointParameters.snapSizeY !== prevProps.pointParameters.snapSizeY
        || pointParameters.showInfoBox !== prevProps.pointParameters.showInfoBox
        || pointParameters.withLabel !== prevProps.pointParameters.withLabel
      ) {
        this._graph.setPointParameters({
          ...defaultPointParameters(),
          ...pointParameters
        });
      }

      if (
        xAxesParameters.ticksDistance !== prevProps.xAxesParameters.ticksDistance
        || xAxesParameters.name !== prevProps.xAxesParameters.name
        || xAxesParameters.showTicks !== prevProps.xAxesParameters.showTicks
        || xAxesParameters.drawLabels !== prevProps.xAxesParameters.drawLabels
        || xAxesParameters.maxArrow !== prevProps.xAxesParameters.maxArrow
        || xAxesParameters.minArrow !== prevProps.xAxesParameters.minArrow
        || xAxesParameters.commaInLabel !== prevProps.xAxesParameters.commaInLabel
        || xAxesParameters.strokeColor !== prevProps.xAxesParameters.strokeColor
        || xAxesParameters.tickEndings !== prevProps.xAxesParameters.tickEndings
        || yAxesParameters.ticksDistance !== prevProps.yAxesParameters.ticksDistance
        || yAxesParameters.name !== prevProps.yAxesParameters.name
        || yAxesParameters.showTicks !== prevProps.yAxesParameters.showTicks
        || yAxesParameters.drawLabels !== prevProps.yAxesParameters.drawLabels
        || yAxesParameters.maxArrow !== prevProps.yAxesParameters.maxArrow
        || yAxesParameters.minArrow !== prevProps.yAxesParameters.minArrow
        || yAxesParameters.commaInLabel !== prevProps.yAxesParameters.commaInLabel
        || yAxesParameters.visible !== prevProps.yAxesParameters.visible
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
        layout.width !== prevProps.layout.width
        || layout.height !== prevProps.layout.height
      ) {
        this._graph.resizeContainer(layout.width, layout.height);
        this._graph.updateGraphParameters(canvas, numberlineAxis, layout, graphType);
      }

      if (
        gridParams.gridY !== prevProps.gridParams.gridY
        || gridParams.gridX !== prevProps.gridParams.gridX
      ) {
        this._graph.setGridParameters({
          ...defaultGridParameters(),
          ...gridParams
        });
      }

      if (JSON.stringify(elements) !== JSON.stringify(prevProps.elements)) {
        this._graph.reset();
        this.mapElementsToGraph();
      }

      if (numberlineAxis.showMin !== prevProps.numberlineAxis.showMin
        || numberlineAxis.showMax !== prevProps.numberlineAxis.showMax
        || numberlineAxis.ticksDistance !== prevProps.numberlineAxis.ticksDistance
        || numberlineAxis.snapToTicks !== prevProps.numberlineAxis.snapToTicks) {
        this._graph.updateGraphParameters(canvas, numberlineAxis, layout, graphType);
      }

      if (list && !prevProps.list) {
        this._graph.renderMarks(list, [canvas.xMin, canvas.xMax], numberlineAxis);
      }

      if (list && list.length === prevProps.list.length && list !== prevProps.list) {
        // Shuffle or text edit
        this._graph.updateMarks(list, prevProps.list);
      }
      if (list && list.length !== prevProps.list.length) {
        // Mark added or removed
        this._graph.marksSizeChanged(list, [canvas.xMin, canvas.xMax], numberlineAxis);
      }
    }
  }

  onReset() {
    this._graph.reset();
    this.getConfig();
  }

  getConfig() {
    const conf = this._graph.getConfig();
    const { setValue, changePreviewTab, checkAnswer } = this.props;
    setValue(conf);

    if (checkAnswer) {
      changePreviewTab('clear');
    }
  }

  setGraphUpdateEventHandler = () => {
    // todo: need implementation
    // this._graph.events.on(CONSTANT.EVENT_NAMES.CHANGE_MOVE, () => this.getConfig());
    // this._graph.events.on(CONSTANT.EVENT_NAMES.CHANGE_NEW, () => this.getConfig());
  };

  mapElementsToGraph = () => {
    const {
      elements,
      checkAnswer,
      showAnswer,
      evaluation,
      validation
    } = this.props;

    let newElems = elements;

    if (checkAnswer) {
      if (evaluation && evaluation.length) {
        const compareResult = getCompareResult(evaluation);
        newElems = getColoredElems(elements, compareResult);
      } else {
        const compareResult = getCompareResult(checkAnswerMethod({
          userResponse: elements,
          validation
        }));
        newElems = getColoredElems(elements, compareResult);
      }
    } else if (showAnswer) {
      const compareResult = getCompareResult(checkAnswerMethod({
        userResponse: elements,
        validation
      }));
      newElems = getColoredElems(elements, compareResult);
    }

    this._graph.loadFromConfig(newElems);
  };

  render() {
    const {
      layout
    } = this.props;

    return (
      <div style={{ overflow: 'auto' }}>
        <GraphWrapper>
          <div>
            <JSXBox
              id={this._graphId}
              className="jxgbox"
              margin={layout.margin}
            />
          </div>
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
  validation: PropTypes.object.isRequired,
  elements: PropTypes.array.isRequired,
  showAnswer: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  changePreviewTab: PropTypes.func
};

AxisLabelsContainer.defaultProps = {
  list: [],
  evaluation: null,
  showAnswer: false,
  checkAnswer: false,
  changePreviewTab: () => {}
};

export default AxisLabelsContainer;
