import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { cloneDeep, isEqual } from "lodash";

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
} from "@edulastic/icons";

import { WithResources } from "@edulastic/common";

import { CHECK, CLEAR, EDIT, SHOW } from "../../../../constants/constantsForQuestions";
import { setElementsStashAction, setStashIndexAction } from "../../../../actions/graphTools";

import { makeBorder } from "../../Builder";
import { CONSTANT, Colors } from "../../Builder/config";
import {
  defaultGraphParameters,
  defaultPointParameters,
  defaultAxesParameters,
  defaultGridParameters
} from "../../Builder/settings";

import AnnotationRnd from "../../../Annotations/AnnotationRnd";

import {
  GraphWrapper,
  JSXBox,
  LabelTop,
  LabelBottom,
  LabelLeft,
  LabelRight,
  Title,
  JSXBoxWrapper,
  JSXBoxWithDrawingObjectsWrapper
} from "./styled";
import Tools from "../../common/Tools";
import Equations from "./Equations";
import DrawingObjects from "./DrawingObjects";
import { ElementSettingsMenu } from "./ElementSettingsMenu";

const getColoredElems = (elements, compareResult) => {
  if (compareResult && compareResult.details && compareResult.details.length > 0) {
    let newElems = cloneDeep(elements);
    const subElems = [];

    newElems = newElems.map(el => {
      if (!el.subElement) {
        const detail = compareResult.details.find(det => det.id === el.id);
        let newEl = {};
        let result = false;

        if (detail && detail.result) {
          newEl = {
            colors: Colors.green[el.type],
            ...el
          };
          result = true;
        } else {
          newEl = {
            colors: Colors.red[el.type],
            ...el
          };
        }

        if (el.subElementsIds) {
          Object.values(el.subElementsIds).forEach(val => {
            subElems.push({
              id: val,
              result
            });
          });
        }
        return newEl;
      }
      return el;
    });

    newElems = newElems.map(el => {
      if (el.subElement) {
        const detail = subElems.find(det => det.id === el.id);
        let newEl = {};
        if (detail && detail.result) {
          newEl = {
            colors: Colors.green[el.type],
            ...el
          };
        } else {
          newEl = {
            colors: Colors.red[el.type],
            ...el
          };
        }
        return newEl;
      }
      return el;
    });
    return newElems;
  }
  return elements;
};

const getCorrectAnswer = answerArr => {
  if (Array.isArray(answerArr)) {
    return answerArr.map(el => ({
      colors: Colors.green[el.type],
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
    if (evaluation[key].commonResult) {
      compareResult = evaluation[key];
    }
  });

  if (compareResult) {
    return compareResult;
  }

  return evaluation[0];
};

class GraphContainer extends PureComponent {
  constructor(props) {
    super(props);

    this._graphId = `jxgbox${Math.random()
      .toString(36)
      .replace(".", "")}`;
    this._graph = null;

    this.state = {
      selectedTool: this.getDefaultTool(),
      selectedDrawingObject: null,
      elementSettingsAreOpened: false,
      elementId: null,
      resourcesLoaded: false
    };

    this.onSelectTool = this.onSelectTool.bind(this);
    this.onReset = this.onReset.bind(this);
    this.updateValues = this.updateValues.bind(this);
  }

  getDefaultTool() {
    const { toolbar } = this.props;
    const { tools } = toolbar;

    return {
      name: tools[0],
      index: 0,
      groupIndex: -1
    };
  }

  handleElementSettingsMenuOpen = elementId => this.setState({ elementSettingsAreOpened: true, elementId });

  handleElementSettingsMenuClose = (labelText, labelVisibility, pointVisibility, color) => {
    const { setValue, setElementsStash } = this.props;
    const { elementId } = this.state;
    const config = this._graph.getConfig();
    const updateElement = config.filter(element => element.id === elementId)[0];

    if (updateElement) {
      updateElement.label = labelText;
      updateElement.pointIsVisible = pointVisibility;
      updateElement.labelIsVisible = labelVisibility;
      updateElement.baseColor = color;

      if (updateElement.subElementsIds) {
        Object.values(updateElement.subElementsIds).forEach(subElementId => {
          const subElement = config.filter(element => element.id === subElementId)[0];
          subElement.baseColor = color;
        });
      }

      setValue(config);
      setElementsStash(config, this.getStashId());
    }

    this.setState({ elementSettingsAreOpened: false });
  };

  resetColors = () => {
    const { setValue } = this.props;
    const config = this._graph.getConfig();

    config.forEach(cfg => (cfg.baseColor = "#00b2ff"));
    setValue(config);
  };

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
      toolbar,
      setElementsStash,
      graphData,
      disableResponse
    } = this.props;

    const { tools } = toolbar;
    const { resourcesLoaded } = this.state;

    this._graph = makeBorder(this._graphId, graphData.graphType);

    if (!this.drawingObjectsAreVisible()) {
      this._graph.setTool(tools[0]);
    }

    if (this._graph) {
      if (!disableResponse) {
        this._graph.createEditButton(this.handleElementSettingsMenuOpen, this.drawingObjectsAreVisible());
      }
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
      this._graph.setBgImage(bgImgOptions);
      if (resourcesLoaded) {
        this._graph.setBgObjects(backgroundShapes.values, backgroundShapes.showPoints);
      }

      this.setElementsToGraph();
    }

    this.setGraphUpdateEventHandler();
    setElementsStash(this._graph.getConfig(), this.getStashId());
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
      toolbar,
      disableResponse,
      previewTab,
      changePreviewTab,
      elements
    } = this.props;

    const { tools, drawingPrompt } = toolbar;
    const { resourcesLoaded } = this.state;

    if (JSON.stringify(tools) !== JSON.stringify(prevProps.toolbar.tools)) {
      this.setDefaultToolState();
      this._graph.setTool(tools[0]);
    }

    if (this._graph) {
      this._graph.setDisableResponse(disableResponse);
      if (prevProps.disableResponse && !disableResponse) {
        this._graph.createEditButton(this.handleElementSettingsMenuOpen, this.drawingObjectsAreVisible());
      }

      if (
        canvas.xMin !== prevProps.canvas.xMin ||
        canvas.xMax !== prevProps.canvas.xMax ||
        canvas.yMin !== prevProps.canvas.yMin ||
        canvas.yMax !== prevProps.canvas.yMax
      ) {
        this._graph.setGraphParameters({
          ...defaultGraphParameters(),
          ...canvas
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
        xAxesParameters.showAxis !== prevProps.xAxesParameters.showAxis ||
        yAxesParameters.ticksDistance !== prevProps.yAxesParameters.ticksDistance ||
        yAxesParameters.name !== prevProps.yAxesParameters.name ||
        yAxesParameters.showTicks !== prevProps.yAxesParameters.showTicks ||
        yAxesParameters.drawLabels !== prevProps.yAxesParameters.drawLabels ||
        yAxesParameters.maxArrow !== prevProps.yAxesParameters.maxArrow ||
        yAxesParameters.minArrow !== prevProps.yAxesParameters.minArrow ||
        yAxesParameters.commaInLabel !== prevProps.yAxesParameters.commaInLabel ||
        yAxesParameters.showAxis !== prevProps.yAxesParameters.showAxis
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

      if (layout.width !== prevProps.layout.width || layout.height !== prevProps.layout.height) {
        this._graph.resizeContainer(layout.width, layout.height);
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

      if (
        bgImgOptions.urlImg !== prevProps.bgImgOptions.urlImg ||
        bgImgOptions.opacity !== prevProps.bgImgOptions.opacity ||
        bgImgOptions.coords[0] !== prevProps.bgImgOptions.coords[0] ||
        bgImgOptions.coords[1] !== prevProps.bgImgOptions.coords[1] ||
        bgImgOptions.size[0] !== prevProps.bgImgOptions.size[0] ||
        bgImgOptions.size[1] !== prevProps.bgImgOptions.size[1]
      ) {
        this._graph.removeBgImage();
        this._graph.setBgImage(bgImgOptions);
      }

      if (
        JSON.stringify(backgroundShapes.values) !== JSON.stringify(prevProps.backgroundShapes.values) ||
        backgroundShapes.showPoints !== prevProps.backgroundShapes.showPoints
      ) {
        this._graph.resetBg();
        if (resourcesLoaded) {
          this._graph.setBgObjects(backgroundShapes.values, backgroundShapes.showPoints);
        }
      }

      this.setElementsToGraph(prevProps);

      if (prevProps.toolbar.drawingPrompt === "byObjects" && drawingPrompt === "byTools") {
        this.resetColors();
      }
    }

    if ((previewTab === CHECK || previewTab === SHOW) && !isEqual(elements, prevProps.elements)) {
      changePreviewTab(CLEAR);
    }
  }

  onSelectTool({ name, index, groupIndex }) {
    this.setState({ selectedTool: { name, index, groupIndex } });
    this._graph.setTool(name);
  }

  onReset() {
    const { toolbar } = this.props;
    const { tools } = toolbar;

    this.setState({
      selectedTool: this.getDefaultTool()
    });

    this._graph.setTool(tools[0]);
    this._graph.reset();
    this.updateValues();
  }

  onUndo = () => {
    if (this._graph.cleanToolTempPoints()) {
      return;
    }
    const { stash, stashIndex, setStashIndex, setValue } = this.props;
    const id = this.getStashId();
    if (stashIndex[id] > 0 && stashIndex[id] <= stash[id].length - 1) {
      setValue(stash[id][stashIndex[id] - 1]);
      setStashIndex(stashIndex[id] - 1, id);
    }
  };

  onRedo() {
    if (this._graph.cleanToolTempPoints()) {
      return;
    }
    const { stash, stashIndex, setStashIndex, setValue } = this.props;
    const id = this.getStashId();
    if (stashIndex[id] >= 0 && stashIndex[id] < stash[id].length - 1) {
      setValue(stash[id][stashIndex[id] + 1]);
      setStashIndex(stashIndex[id] + 1, id);
    }
  }

  onDelete() {
    this.selectDrawingObject(null);
    this.setState({ selectedTool: { name: "delete", index: -1, groupIndex: -1 } });
    this._graph.setTool("trash");
  }

  getStashId() {
    const { graphData, altAnswerId, view, bgShapes } = this.props;
    const type = bgShapes ? "bgShapes" : altAnswerId || view;
    return `${graphData.id}_${type}`;
  }

  getHandlerByControlName = control => {
    switch (control) {
      case "undo":
        return this.onUndo();
      case "redo":
        return this.onRedo();
      case "reset":
        return this.onReset();
      case "delete":
        return this.onDelete();
      default:
        return () => {};
    }
  };

  updateValues() {
    const conf = this._graph.getConfig();
    const { setValue, setElementsStash } = this.props;

    setValue(conf);
    setElementsStash(conf, this.getStashId());
  }

  graphUpdateHandler = () => {
    this.updateValues();
    this.selectDrawingObject(null);
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

    const { elements, evaluation, disableResponse, elementsIsCorrect, previewTab, setValue } = this.props;

    // correct answers blocks
    if (elementsIsCorrect) {
      this._graph.resetAnswers();
      this._graph.loadAnswersFromConfig(getCorrectAnswer(elements));
      return;
    }

    if (disableResponse) {
      const compareResult = getCompareResult(evaluation);
      const coloredElements = getColoredElems(elements, compareResult);
      this._graph.reset();
      this._graph.resetAnswers();
      this._graph.loadAnswersFromConfig(coloredElements);
      return;
    }

    if (previewTab === CHECK || previewTab === SHOW) {
      const compareResult = getCompareResult(evaluation);
      const coloredElements = getColoredElems(elements, compareResult);
      this._graph.reset();
      this._graph.resetAnswers();
      this._graph.loadFromConfig(coloredElements);
      return;
    }

    if (
      !isEqual(elements, this._graph.getConfig()) ||
      (previewTab === CLEAR && (prevProps.previewTab === CHECK || prevProps.previewTab === SHOW))
    ) {
      this._graph.reset();
      this._graph.resetAnswers();
      this._graph.loadFromConfig(elements);
      setValue(this._graph.getConfig());
    }
  };

  getIconByToolName = (toolName, options) => {
    if (!toolName) {
      return "";
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
      ellipse: () => "ellipse",
      hyperbola: () => "hyperbola",
      tangent: () => "tangent",
      secant: () => "secant",
      exponent: () => "exponent",
      logarithm: () => "logarithm",
      polynom: () => "polynom",
      parabola: () => <IconParabola {...options} />,
      sine: () => {
        const newOptions = {
          ...options,
          width: width + 10
        };

        return <IconSine {...newOptions} />;
      },
      polygon: () => <IconPolygon {...options} />,
      mark: () => <IconLabel {...options} />,
      label: () => {
        const newOptions = {
          ...options,
          width: width + 10,
          height: height - 2
        };

        return <IconLabel {...newOptions} />;
      },
      annotation: () => "annotation",
      area: () => "area"
    };

    return iconsByToolName[toolName]();
  };

  setEquations = equations => {
    const { setValue, setElementsStash, elements } = this.props;
    let newElements = cloneDeep(elements);
    newElements = newElements.filter(el => el.type !== CONSTANT.TOOLS.EQUATION);
    newElements.push(...equations);
    setValue(newElements);
    setElementsStash(newElements, this.getStashId());
  };

  allTools = [
    "point",
    "line",
    "ray",
    "segment",
    "vector",
    "circle",
    "ellipse",
    "sine",
    "tangent",
    "secant",
    "exponent",
    "logarithm",
    "polynom",
    "hyperbola",
    "polygon",
    "parabola",
    "annotation",
    "area"
  ];

  allControls = ["undo", "redo", "reset", "delete"];

  drawingObjectsAreVisible = () => {
    const { view, toolbar } = this.props;
    const { drawingPrompt } = toolbar;
    return view !== EDIT && drawingPrompt === "byObjects";
  };

  getDrawingObjects = () => {
    const { toolbar, elements } = this.props;
    const { drawingObjects } = toolbar;
    const { selectedDrawingObject } = this.state;

    return drawingObjects.map(item => ({
      ...item,
      disabled: elements.findIndex(el => el.id === item.id) > -1,
      selected: !!(selectedDrawingObject && selectedDrawingObject.id === item.id)
    }));
  };

  selectDrawingObject = drawingObject => {
    this.setState({ selectedDrawingObject: drawingObject });
    this._graph.setDrawingObject(drawingObject);
  };

  resourcesOnLoaded = () => {
    const { backgroundShapes } = this.props;
    const { resourcesLoaded } = this.state;
    if (resourcesLoaded) {
      return;
    }
    this.setState({ resourcesLoaded: true });
    this._graph.resetBg();
    this._graph.setBgObjects(backgroundShapes.values, backgroundShapes.showPoints);
    this.setElementsToGraph();
  };

  render() {
    const {
      toolbar,
      layout,
      annotation,
      controls,
      bgShapes,
      elements,
      disableResponse,
      view,
      advancedElementSettings,
      graphData,
      setQuestionData
    } = this.props;
    const { tools, drawingPrompt } = toolbar;
    const { selectedTool, elementSettingsAreOpened, elementId } = this.state;
    const hasAnnotation =
      annotation && (annotation.labelTop || annotation.labelLeft || annotation.labelRight || annotation.labelBottom);
    const equations = elements.filter(el => el.type === CONSTANT.TOOLS.EQUATION);

    return (
      <div data-cy="axis-quadrants-container" style={{ overflow: "auto", width: "100%" }}>
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
          {annotation && annotation.title && <Title dangerouslySetInnerHTML={{ __html: annotation.title }} />}
          {!disableResponse && (
            <Tools
              toolsAreVisible={!this.drawingObjectsAreVisible()}
              tools={bgShapes ? this.allTools : tools}
              controls={bgShapes ? this.allControls : controls}
              tool={selectedTool}
              bgShapes={bgShapes}
              getIconByToolName={this.getIconByToolName}
              getHandlerByControlName={this.getHandlerByControlName}
              onSelect={this.onSelectTool}
              fontSize={bgShapes ? 12 : layout.fontSize}
            />
          )}
          {!this.drawingObjectsAreVisible() && !disableResponse && (
            <Equations equations={equations} setEquations={this.setEquations} />
          )}
          <JSXBoxWithDrawingObjectsWrapper>
            {this.drawingObjectsAreVisible() && !disableResponse && (
              <DrawingObjects
                selectDrawingObject={this.selectDrawingObject}
                drawingObjects={this.getDrawingObjects()}
              />
            )}
            <JSXBoxWrapper width={+layout.width + 40}>
              {annotation && annotation.labelTop && (
                <LabelTop dangerouslySetInnerHTML={{ __html: annotation.labelTop }} />
              )}
              {annotation && annotation.labelRight && (
                <LabelRight dangerouslySetInnerHTML={{ __html: annotation.labelRight }} />
              )}
              {annotation && annotation.labelLeft && (
                <LabelLeft dangerouslySetInnerHTML={{ __html: annotation.labelLeft }} />
              )}
              {annotation && annotation.labelBottom && (
                <LabelBottom dangerouslySetInnerHTML={{ __html: annotation.labelBottom }} />
              )}
              <JSXBox
                data-cy="jxgbox"
                id={this._graphId}
                className="jxgbox"
                margin={layout.margin ? layout.margin : hasAnnotation ? 20 : 0}
              />
              <AnnotationRnd question={graphData} setQuestionData={setQuestionData} disableDragging={view !== EDIT} />
              {elementSettingsAreOpened && this._graph && (
                <ElementSettingsMenu
                  showColorPicker={drawingPrompt === "byObjects" && view === "edit"}
                  advancedElementSettings={advancedElementSettings}
                  element={this._graph.getConfig().filter(element => element.id === elementId)[0]}
                  handleClose={this.handleElementSettingsMenuClose}
                />
              )}
            </JSXBoxWrapper>
          </JSXBoxWithDrawingObjectsWrapper>
        </GraphWrapper>
      </div>
    );
  }
}

GraphContainer.propTypes = {
  canvas: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired,
  pointParameters: PropTypes.object.isRequired,
  xAxesParameters: PropTypes.object.isRequired,
  yAxesParameters: PropTypes.object.isRequired,
  gridParams: PropTypes.object.isRequired,
  bgImgOptions: PropTypes.object.isRequired,
  backgroundShapes: PropTypes.object,
  evaluation: PropTypes.any,
  toolbar: PropTypes.object,
  setValue: PropTypes.func.isRequired,
  elements: PropTypes.array.isRequired,
  bgShapes: PropTypes.bool.isRequired,
  annotation: PropTypes.object,
  controls: PropTypes.array,
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
  elementsIsCorrect: PropTypes.bool,
  advancedElementSettings: PropTypes.bool
};

GraphContainer.defaultProps = {
  backgroundShapes: { values: [], showPoints: true },
  advancedElementSettings: false,
  evaluation: null,
  annotation: null,
  controls: [],
  stash: {},
  stashIndex: {},
  altAnswerId: null,
  toolbar: {
    tools: [],
    drawingPrompt: "byTools",
    drawingObjects: []
  },
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
)(GraphContainer);
