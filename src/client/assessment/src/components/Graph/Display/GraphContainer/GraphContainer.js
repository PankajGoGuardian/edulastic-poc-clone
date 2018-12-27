import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  IconGraphRay as IconRay,
  IconGraphLine as IconLine,
  IconGraphLabel as IconLabel,
  IconGraphPoint as IconPoint,
  IconGraphSine as IconSine,
  IconGraphParabola as IconParabola,
  IconGraphCircle as IconCircle,
  IconGraphVector as IconVector,
  IconGraphSegment as IconSegment,
  IconGraphPolygon as IconPolygon
} from '@edulastic/icons';
import Tools from './Tools';
import { makeBorder } from '../../Builder/index';
import { CONSTANT } from '../../Builder/config/index';
import {
  defaultGraphParameters,
  defaultPointParameters,
  defaultAxesParameters,
  defaultGridParameters
} from '../../Builder/settings';
import { GraphWrapper, JSXBox } from './styled';


class GraphContainer extends Component {
  constructor(props) {
    super(props);

    this._graphId = `jxgbox${Math.random().toString(36)}`;
    this._graph = null;

    this.state = {
      selectedTool: this.getDefaultTool()
    };

    this.onSelectTool = this.onSelectTool.bind(this);
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
      pointParameters,
      xAxesParameters,
      yAxesParameters,
      layout,
      gridParams,
      bgImgOptions,
      backgroundShapes,
      showAnswer,
      answer
    } = this.props;

    this._graph = makeBorder(this._graphId);

    this._graph.setTool(CONSTANT.TOOLS.POINT);

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
      this._graph.setBgImage(bgImgOptions);
      this._graph.setBgObjects(backgroundShapes.values, backgroundShapes.showPoints);

      if (showAnswer === true) {
        this._graph.setAnswer(answer);
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
      pointParameters,
      xAxesParameters,
      yAxesParameters,
      layout,
      gridParams,
      bgImgOptions,
      backgroundShapes,
      tools,
      value,
      showAnswer
    } = this.props;
    if (JSON.stringify(tools) !== JSON.stringify(prevProps.tools)) {
      this.setDefaultToolState();
      this._graph.setTool(tools[0]);
    }
    if (this._graph) {
      if (canvas.xMin !== prevProps.canvas.xMin
        || canvas.xMax !== prevProps.canvas.xMax
        || canvas.yMin !== prevProps.canvas.yMin
        || canvas.yMax !== prevProps.canvas.yMax
      ) {
        this._graph.setGraphParameters({
          ...defaultGraphParameters(),
          ...canvas
        });
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
        || yAxesParameters.ticksDistance !== prevProps.yAxesParameters.ticksDistance
        || yAxesParameters.name !== prevProps.yAxesParameters.name
        || yAxesParameters.showTicks !== prevProps.yAxesParameters.showTicks
        || yAxesParameters.drawLabels !== prevProps.yAxesParameters.drawLabels
        || yAxesParameters.maxArrow !== prevProps.yAxesParameters.maxArrow
        || yAxesParameters.minArrow !== prevProps.yAxesParameters.minArrow
        || yAxesParameters.commaInLabel !== prevProps.yAxesParameters.commaInLabel
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
      if (
        bgImgOptions.urlImg !== prevProps.bgImgOptions.urlImg
        || bgImgOptions.opacity !== prevProps.bgImgOptions.opacity
        || bgImgOptions.coords[0] !== prevProps.bgImgOptions.coords[0]
        || bgImgOptions.coords[1] !== prevProps.bgImgOptions.coords[1]
        || bgImgOptions.size[0] !== prevProps.bgImgOptions.size[0]
        || bgImgOptions.size[1] !== prevProps.bgImgOptions.size[1]
      ) {
        this._graph.removeBgImage();
        this._graph.setBgImage(bgImgOptions);
      }

      if (JSON.stringify(backgroundShapes.values) !== JSON.stringify(prevProps.backgroundShapes.values)
        || backgroundShapes.showPoints !== prevProps.backgroundShapes.showPoints) {
        this._graph.resetBg();
        this._graph.setBgObjects(backgroundShapes.values, backgroundShapes.showPoints);
      }
      if (showAnswer && JSON.stringify(value) !== JSON.stringify(prevProps.value)) {
        this._graph.reset();
        this.mapElementsToGraph();
      }
    }
  }

  onSelectTool({ name, index, groupIndex }) {
    this.setState({ selectedTool: { name, index, groupIndex } });
    this._graph.setTool(name);
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
    this._graph.events.on(CONSTANT.EVENT_NAMES.CHANGE_MOVE, () => this.getConfig());
    this._graph.events.on(CONSTANT.EVENT_NAMES.CHANGE_NEW, () => this.getConfig());
  };

  mapElementsToGraph = () => {
    const { value } = this.props;
    this._graph.loadFromConfig(value);
  };

  getIconByToolName = (toolName, options) => {
    if (!toolName) {
      return '';
    }

    const { width, height } = options;

    const iconsByToolName = {
      point: () => <IconPoint {...options} />,
      line: () => {
        const newOptions = {
          ...options,
          width: width + 10,
          height: height + 5
        };

        return <IconLine {...newOptions} />;
      },
      ray: () => {
        const newOptions = {
          ...options,
          width: width + 10,
          height: height + 5
        };

        return <IconRay {...newOptions} />;
      },
      segment: () => {
        const newOptions = {
          ...options,
          width: width + 10,
          height: height + 5
        };

        return <IconSegment {...newOptions} />;
      },
      vector: () => {
        const newOptions = {
          ...options,
          width: width + 10,
          height: height + 5
        };

        return <IconVector {...newOptions} />;
      },
      circle: () => <IconCircle {...options} />,
      parabola: () => <IconParabola {...options} />,
      sine: () => {
        const newOptions = {
          ...options,
          width: width + 10
        };

        return <IconSine {...newOptions} />;
      },
      polygon: () => <IconPolygon {...options} />,
      label: () => {
        const newOptions = {
          ...options,
          width: width + 10,
          height: height - 2
        };

        return <IconLabel {...newOptions} />;
      }
    };

    return iconsByToolName[toolName]();
  };

  render() {
    const {
      tools,
      layout
    } = this.props;
    const {
      selectedTool
    } = this.state;

    return (
      <div style={{ overflow: 'auto' }}>
        <GraphWrapper>
          <Tools
            tools={tools}
            tool={selectedTool}
            getIconByToolName={this.getIconByToolName}
            onSelect={this.onSelectTool}
            onReset={this.onReset}
            fontSize={layout.fontSize}
          />
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

GraphContainer.propTypes = {
  canvas: PropTypes.object.isRequired,
  pointParameters: PropTypes.object.isRequired,
  xAxesParameters: PropTypes.object.isRequired,
  yAxesParameters: PropTypes.object.isRequired,
  tools: PropTypes.array.isRequired,
  layout: PropTypes.object.isRequired,
  gridParams: PropTypes.object.isRequired,
  bgImgOptions: PropTypes.object.isRequired,
  value: PropTypes.array.isRequired,
  setValue: PropTypes.func.isRequired,
  backgroundShapes: PropTypes.object
};

GraphContainer.defaultProps = {
  backgroundShapes: { values: [], showPoints: true }
};

export default GraphContainer;
