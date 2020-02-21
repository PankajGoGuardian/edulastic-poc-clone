import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { cloneDeep, isEqual } from "lodash";

import { WithResources } from "@edulastic/common";

import { CHECK, CLEAR, EDIT, SHOW } from "../../../../constants/constantsForQuestions";
import { setElementsStashAction, setStashIndexAction } from "../../../../actions/graphTools";

import { makeBorder } from "../../Builder";
import { CONSTANT } from "../../Builder/config";
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
  JSXBoxWithDropValues,
  StyledToolsContainer
} from "./styled";
import Tools from "../../common/Tools";
import DragDropValues from "./DragDropValues";
import AppConfig from "../../../../../../../app-config";

const valueHeightHashMap = {
  "1": {
    width: 150,
    height: 50
  },
  "1.5": {
    width: 175,
    height: 70
  },
  "1.75": {
    width: 200,
    height: 90
  },
  "2.5": {
    width: 250,
    height: 120
  },
  "3": {
    width: 300,
    height: 150
  }
};

const getColoredElems = (elements, compareResult, theme) => {
  const {rightIconColor} = theme.widgets.graphPlacement;
  const {wrongIconColor} = theme.widgets.graphPlacement;

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
            ...el,
            priorityColor: rightIconColor,
            customOptions: {
              isCorrect: true
            }
          };
          result = true;
        } else {
          newEl = {
            ...el,
            priorityColor: wrongIconColor,
            customOptions: {
              isCorrect: false
            }
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
            ...el,
            priorityColor: rightIconColor,
            customOptions: {
              isCorrect: true
            }
          };
        } else {
          newEl = {
            ...el,
            priorityColor: wrongIconColor,
            customOptions: {
              isCorrect: false
            }
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

const getCorrectAnswer = (answerArr, theme) => {
  const {rightIconColor} = theme.widgets.graphPlacement;

  if (Array.isArray(answerArr)) {
    return answerArr.map(el => ({
      ...el,
      priorityColor: rightIconColor,
      customOptions: {
        isCorrect: true
      }
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
      disableResponse,
      theme
    } = this.props;

    const { resourcesLoaded } = this.state;

    this._graph = makeBorder(this._graphId, graphType);

    const defaultColor = theme.widgets.chart.labelStrokeColor;
    const bgColor = theme.widgets.graphPlacement.backgroundShapes;

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
        const bgShapeValues = backgroundShapes.values.map(el => ({
          ...el,
          priorityColor: bgColor
        }));
        this._graph.setBgObjects(bgShapeValues, backgroundShapes.showPoints);
      }

      this._graph.setDragDropDeleteHandler();
      this._graph.setPriorityColor(defaultColor);

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
      elements,
      theme
    } = this.props;

    const { resourcesLoaded } = this.state;

    const bgColor = theme.widgets.graphPlacement.backgroundShapes;

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
        pointParameters.withLabel !== prevProps.pointParameters.withLabel ||
        pointParameters.size !== prevProps.pointParameters.size
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
        xAxesParameters.drawZero !== prevProps.xAxesParameters.drawZero ||
        yAxesParameters.ticksDistance !== prevProps.yAxesParameters.ticksDistance ||
        yAxesParameters.name !== prevProps.yAxesParameters.name ||
        yAxesParameters.showTicks !== prevProps.yAxesParameters.showTicks ||
        yAxesParameters.drawLabels !== prevProps.yAxesParameters.drawLabels ||
        yAxesParameters.maxArrow !== prevProps.yAxesParameters.maxArrow ||
        yAxesParameters.minArrow !== prevProps.yAxesParameters.minArrow ||
        yAxesParameters.commaInLabel !== prevProps.yAxesParameters.commaInLabel ||
        yAxesParameters.showAxis !== prevProps.yAxesParameters.showAxis ||
        yAxesParameters.drawZero !== prevProps.yAxesParameters.drawZero
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
          const bgShapeValues = backgroundShapes.values.map(el => ({
            ...el,
            priorityColor: bgColor
          }));
          this._graph.setBgObjects(bgShapeValues, backgroundShapes.showPoints);
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

  onSelectControl = control => {
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
      this._graph.loadAnswersFromConfig(getCorrectAnswer(elements, this.props.theme));
      return;
    }

    if (disableResponse) {
      const compareResult = getCompareResult(evaluation);
      const coloredElements = getColoredElems(elements, compareResult, this.props.theme);
      this._graph.reset();
      this._graph.resetAnswers();
      this._graph.loadAnswersFromConfig(coloredElements);
      return;
    }

    if (previewTab === CHECK || previewTab === SHOW) {
      const compareResult = getCompareResult(evaluation);
      const coloredElements = getColoredElems(elements, compareResult, this.props.theme);
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

  onDrawDragDropValue = (dragDropValue, x, y) => {
    this._graph.drawDragDropValue(dragDropValue, x, y);
  };

  getDragDropValues = () => {
    const { list, elements } = this.props;
    return list.filter(elem => !elements.some(el => elem.id === el.id));
  };

  resourcesOnLoaded = () => {
    const { resourcesLoaded } = this.state;
    const { backgroundShapes, theme } = this.props;
    const bgColor = theme.widgets.graphPlacement.backgroundShapes;

    if (resourcesLoaded) {
      return;
    }
    this.setState({ resourcesLoaded: true });

    const bgShapeValues = backgroundShapes.values.map(el => ({
      ...el,
      priorityColor: bgColor
    }));
    this._graph.resetBg();
    this._graph.setBgObjects(bgShapeValues, backgroundShapes.showPoints);
    this.setElementsToGraph();
  };

  render() {
    const {
      layout,
      annotation,
      controls,
      disableResponse,
      view,
      graphData,
      setQuestionData,
      questionId,
      zoomLevel,
      isPrintPreview
    } = this.props;
    const hasAnnotation =
      annotation && (annotation.labelTop || annotation.labelLeft || annotation.labelRight || annotation.labelBottom);

    const margin = layout.margin ? layout.margin : hasAnnotation ? 20 : 0;

    const dragDropBoundsClassName = `jsxbox-with-drag-drop-${questionId ||
      Math.random()
        .toString()
        .slice(2, 9)}`;

    const valueDimensions = valueHeightHashMap[zoomLevel];

    return (
      <div data-cy="axis-quadrants-container" style={{ width: "100%" }}>
        <WithResources
          resources={[`${AppConfig.jqueryPath}/jquery.min.js`, `${AppConfig.katexPath}/katex.min.js`]}
          fallBack={<span />}
          onLoaded={this.resourcesOnLoaded}
        >
          <span />
        </WithResources>
        <GraphWrapper>
          {annotation && annotation.title && <Title dangerouslySetInnerHTML={{ __html: annotation.title }} />}
          {!disableResponse && !isPrintPreview && (
            <StyledToolsContainer>
              <Tools controls={controls} onSelectControl={this.onSelectControl} fontSize={layout.fontSize} />
            </StyledToolsContainer>
          )}
          <JSXBoxWithDropValues className={dragDropBoundsClassName}>
            {!disableResponse && (
              <DragDropValues
                scale={zoomLevel}
                height={layout.height}
                margin={margin}
                values={this.getDragDropValues()}
                width={valueDimensions.width}
                valueHeight={valueDimensions.height}
                onAddDragDropValue={this.onAddDragDropValue}
                onDrawDragDropValue={this.onDrawDragDropValue}
                dragDropBoundsClassName={dragDropBoundsClassName}
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
    stashIndex: state.graphTools.stashIndex,
    zoomLevel: state.ui.zoomLevel
  }),
  {
    setElementsStash: setElementsStashAction,
    setStashIndex: setStashIndexAction
  }
)(PlacementContainer);
