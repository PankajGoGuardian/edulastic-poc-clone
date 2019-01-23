import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graph as checkAnswerMethod } from '@edulastic/evaluators';
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
} from '@edulastic/icons';
import { GraphWrapper, JSXBox } from '../AxisLabelsContainer/styled';
import {
  defaultAxesParameters, defaultGraphParameters, defaultGridParameters,
  defaultPointParameters
} from '../../Builder/settings';
import { makeBorder } from '../../Builder';
import { CONSTANT } from '../../Builder/config';
import SegmentsTools from '../GraphContainer/SegmentsTools';

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

class AxisSegmentsContainer extends Component {
  constructor(props) {
    super(props);

    this._graphId = `jxgbox${Math.random().toString(36)}`;
    this._graph = null;

    this.state = {
      selectedTool: this.getDefaultTool()
    };

    this.onReset = this.onReset.bind(this);
    this.getConfig = this.getConfig.bind(this);
  }

  getDefaultTool() {
    const { tools } = this.props;

    return {
      name: tools[0],
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
      graphType,
      showAnswer,
      validation
    } = this.props;

    this._graph = makeBorder(this._graphId);
    this._graph.setTool(CONSTANT.TOOLS.SEGMENTS_POINT, graphType, canvas.responsesAllowed);

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

      this._graph.makeNumberlineAxis(canvas, numberlineAxis, layout);
      this._graph.setPointParameters({
        snapSizeX: numberlineAxis.ticksDistance
      });

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
      gridParams,
      graphType,
      tools,
      elements
    } = this.props;
    if (JSON.stringify(tools) !== JSON.stringify(prevProps.tools)) {
      this.setDefaultToolState();
      this._graph.setTool(tools[0], graphType, canvas.responsesAllowed);
    }
    if (this._graph) {
      if (canvas.xMin !== prevProps.canvas.xMin
        || canvas.xMax !== prevProps.canvas.xMax
        || canvas.yMin !== prevProps.canvas.yMin
        || canvas.yMax !== prevProps.canvas.yMax
        || canvas.margin !== prevProps.canvas.margin
      ) {
        this._graph.updateGraphParameters(canvas, numberlineAxis, layout);
      }

      if (numberlineAxis.leftArrow !== prevProps.numberlineAxis.leftArrow
        || numberlineAxis.rightArrow !== prevProps.numberlineAxis.rightArrow
        || numberlineAxis.showTicks !== prevProps.numberlineAxis.showTicks
        || numberlineAxis.fontSize !== prevProps.numberlineAxis.fontSize
      ) {
        this._graph.updateGraphSettings(numberlineAxis);
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
        this._graph.updateGraphParameters(canvas, numberlineAxis, layout);
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
        this._graph.updateGraphParameters(canvas, numberlineAxis, layout);
      }
    }
  }

  onSelectTool = ({ name, index, groupIndex }, graphType, responsesAllowed) => {
    this.setState({ selectedTool: { name, index, groupIndex } });
    this._graph.setTool(name, graphType, responsesAllowed);
  }

  onReset() {
    const { tools } = this.props;

    this.setState({
      selectedTool: this.getDefaultTool()
    });

    this._graph.setTool(tools[0]);
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

  getIconByToolName = (toolName, options) => {
    if (!toolName) {
      return '';
    }

    const { width } = options;

    const iconsByToolName = {
      segmentsPoint: () => <IconPoint {...options} />,
      bothIncludedSegment: () => {
        const newOptions = {
          ...options,
          width: width + 40
        };

        return <IconBothIncludedSegment {...newOptions} />;
      },
      bothNotIncludedSegment: () => {
        const newOptions = {
          ...options,
          width: width + 40
        };

        return <IconBothNotIncludedSegment {...newOptions} />;
      },
      onlyRightIncludedSegment: () => {
        const newOptions = {
          ...options,
          width: width + 40
        };

        return <IconOnlyRightIncludedSegment {...newOptions} />;
      },
      onlyLeftIncludedSegment: () => {
        const newOptions = {
          ...options,
          width: width + 40
        };

        return <IconOnlyLeftIncludedSegment {...newOptions} />;
      },
      infinityToIncludedSegment: () => {
        const newOptions = {
          ...options,
          width: width + 40
        };

        return <IconInfinityToIncludedSegment {...newOptions} />;
      },
      includedToInfinitySegment: () => {
        const newOptions = {
          ...options,
          width: width + 40
        };

        return <IconIncludedToInfinitySegment {...newOptions} />;
      },
      infinityToNotIncludedSegment: () => {
        const newOptions = {
          ...options,
          width: width + 40
        };

        return <IconInfinityToNotIncludedSegment {...newOptions} />;
      },
      notIncludedToInfinitySegment: () => {
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
      }
    };

    return iconsByToolName[toolName]();
  };

  render() {
    const {
      layout,
      graphType,
      canvas
    } = this.props;
    const { selectedTool } = this.state;
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
          <SegmentsTools
            tool={selectedTool}
            getIconByToolName={this.getIconByToolName}
            onSelect={this.onSelectTool}
            fontSize={layout.fontSize}
            graphType={graphType}
            responsesAllowed={canvas.responsesAllowed}
          />
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
  list: PropTypes.array,
  evaluation: PropTypes.any,
  setValue: PropTypes.func.isRequired,
  validation: PropTypes.object.isRequired,
  elements: PropTypes.array.isRequired,
  showAnswer: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  changePreviewTab: PropTypes.func
};

AxisSegmentsContainer.defaultProps = {
  list: [],
  evaluation: null,
  showAnswer: false,
  checkAnswer: false,
  changePreviewTab: () => {}
};

export default AxisSegmentsContainer;
