import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { cloneDeep, isEqual } from "lodash";

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
  JSXBoxWithDropValues
} from "./styled";
import Tools from "../../common/Tools";
import DragDropValues from "./DragDropValues";

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

class PlacementContainer extends PureComponent {
  constructor(props) {
    super(props);

    this._graphId = `jxgbox${Math.random()
      .toString(36)
      .replace(".", "")}`;
    this._graph = null;

    this.state = { resourcesLoaded: false };

    this.onReset = this.onReset.bind(this);
    this.updateValues = this.updateValues.bind(this);
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
      setElementsStash,
      graphType,
      disableResponse
    } = this.props;

    const { resourcesLoaded } = this.state;

    this._graph = makeBorder(this._graphId, graphType);

    if (this._graph) {
      if (!disableResponse) {
        this._graph.createEditButton(this.handleElementSettingsMenuOpen, true);
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

      this._graph.setDragDropDeleteHandler();

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
      disableResponse,
      previewTab,
      changePreviewTab,
      elements
    } = this.props;

    const { resourcesLoaded } = this.state;

    if (this._graph) {
      this._graph.setDisableResponse(disableResponse);
      if (prevProps.disableResponse && !disableResponse) {
        this._graph.createEditButton(this.handleElementSettingsMenuOpen, true);
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
    }

    if ((previewTab === CHECK || previewTab === SHOW) && !isEqual(elements, prevProps.elements)) {
      changePreviewTab(CLEAR);
    }
  }

  onReset() {
    this._graph.reset();
    this.updateValues();
  }

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
      case "reset":
        return this.onReset();
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
    }
  };

  onAddDragDropValue = (dragDropValue, x, y) => {
    if (this._graph.addDragDropValue(dragDropValue, x, y)) {
      this.updateValues();
    }
  };

  getDragDropValues = () => {
    const { list, elements } = this.props;
    return list.filter(elem => !elements.some(el => elem.id === el.id));
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
    const { layout, annotation, controls, disableResponse, view, graphData, setQuestionData } = this.props;
    const hasAnnotation =
      annotation && (annotation.labelTop || annotation.labelLeft || annotation.labelRight || annotation.labelBottom);

    const margin = layout.margin ? layout.margin : hasAnnotation ? 20 : 0;

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
              toolsAreVisible={false}
              controls={controls}
              bgShapes={false}
              getIconByToolName={() => ""}
              getHandlerByControlName={this.getHandlerByControlName}
              onSelect={() => {}}
              fontSize={layout.fontSize}
            />
          )}
          <JSXBoxWithDropValues className="jsxbox-with-drag-drop">
            {!disableResponse && (
              <DragDropValues
                height={layout.height}
                margin={margin}
                values={this.getDragDropValues()}
                onAddDragDropValue={this.onAddDragDropValue}
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
              <JSXBox data-cy="jxgbox" id={this._graphId} className="jxgbox" margin={margin} />
              <AnnotationRnd question={graphData} setQuestionData={setQuestionData} disableDragging={view !== EDIT} />
            </JSXBoxWrapper>
          </JSXBoxWithDropValues>
        </GraphWrapper>
      </div>
    );
  }
}

PlacementContainer.propTypes = {
  canvas: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired,
  pointParameters: PropTypes.object.isRequired,
  xAxesParameters: PropTypes.object.isRequired,
  yAxesParameters: PropTypes.object.isRequired,
  gridParams: PropTypes.object.isRequired,
  bgImgOptions: PropTypes.object.isRequired,
  backgroundShapes: PropTypes.object,
  evaluation: PropTypes.any,
  graphType: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  elements: PropTypes.array.isRequired,
  annotation: PropTypes.object,
  controls: PropTypes.array,
  view: PropTypes.string.isRequired,
  setElementsStash: PropTypes.func.isRequired,
  setStashIndex: PropTypes.func.isRequired,
  stash: PropTypes.object,
  stashIndex: PropTypes.object,
  graphData: PropTypes.string.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  questionId: PropTypes.string.isRequired,
  altAnswerId: PropTypes.string,
  disableResponse: PropTypes.bool,
  previewTab: PropTypes.string,
  changePreviewTab: PropTypes.func,
  elementsIsCorrect: PropTypes.bool,
  list: PropTypes.array
};

PlacementContainer.defaultProps = {
  backgroundShapes: { values: [], showPoints: true },
  evaluation: null,
  annotation: null,
  controls: [],
  stash: {},
  stashIndex: {},
  altAnswerId: null,
  disableResponse: false,
  previewTab: CLEAR,
  changePreviewTab: () => {},
  elementsIsCorrect: false,
  list: []
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
)(PlacementContainer);
