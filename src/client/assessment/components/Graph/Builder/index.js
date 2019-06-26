import JXG from "jsxgraph";
import getDefaultConfig, { CONSTANT, Colors } from "./config";
import { AUTO_VALUE, AUTO_HEIGHT_VALUE, LOST_HEIGHT_PIXELS } from "./config/constants";
import {
  Point,
  Line,
  Ellipse,
  Circle,
  Sin,
  Polygon,
  Parabola,
  Hyperbola,
  Label,
  QuillInput,
  Mark,
  Numberline,
  NumberlinePoint,
  NumberlineVector,
  NumberlineSegment,
  Title,
  Tangent,
  Secant,
  Exponent,
  Logarithm,
  Polynom,
  Equation,
  Annotation,
  Area,
  DrawingObject
} from "./elements";
import {
  mergeParams,
  graphParameters2Boundingbox,
  defaultBgObjectParameters,
  fillConfigDefaultParameters,
  numberlineGraphParametersToBoundingbox
} from "./settings";
import {
  updatePointParameters,
  updateAxe,
  updateGrid,
  getImageCoordsByPercent,
  flatConfig,
  flat2nestedConfig,
  calcUnitX,
  handleSnap,
  isInPolygon,
  nameGenerator
} from "./utils";
import _events from "./events";

import "jsxgraph/distrib/jsxgraph.css";
import "../common/QuillInput.css";
import "../common/Mark.css";

/**
 * @see https://jsxgraph.org/docs/symbols/JXG.JSXGraph.html#.initBoard
 */
class Board {
  constructor(id, graphType, config = {}) {
    this.graphType = graphType;
    /**
     * Elements on the board
     */
    this.elements = [];
    /**
     * Bg elements on the board
     */
    this.bgElements = [];
    /**
     * Static unitX
     */
    this.staticUnitX = null;
    /**
     * Answers
     */
    this.answers = [];
    /**
     * Bg image
     */
    this.bgImage = null;

    this.numberlineAxis = null;

    this.numberlineTitle = null;

    this.marksContainer = null;

    this.numberlineSnapToTicks = true;
    /**
     * Board settings
     */
    this.parameters = fillConfigDefaultParameters(config);
    /**
     * Current tool
     */
    this.currentTool = null;

    this.numberlineSettings = null;

    this.stackResponses = false;

    this.stackResponsesSpacing = 30;

    this.responsesAllowed = null;

    this.events = _events();

    this.dragged = false;

    this.drawingObject = null;

    this.$board = JXG.JSXGraph.initBoard(id, mergeParams(getDefaultConfig(), this.parameters));
    this.$board.setZoom(1, 1);

    this.creatingHandler = () => {};
    this.setCreatingHandler();

    this.objectNameGenerator = nameGenerator();
  }

  isAnyElementsHasFocus(withPrepare = false) {
    if (!this.elements) {
      return false;
    }

    for (let i = 0; i < this.elements.length; i++) {
      const element = this.elements[i];
      if (element.hasFocus || (withPrepare && element.prepareToFocus)) {
        return true;
      }

      if (element.ancestors) {
        const ancestors = Object.values(element.ancestors);
        for (let j = 0; j < ancestors.length; j++) {
          if (ancestors[j].hasFocus || (withPrepare && ancestors[j].prepareToFocus)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  setElementsFixedAttribute(fixed) {
    if (!this.elements) {
      return;
    }

    this.elements.forEach(element => {
      if (element.type === 100 || element.latexIsBroken) {
        return;
      }
      element.setAttribute({ fixed });
      if (element.ancestors) {
        Object.values(element.ancestors).forEach(ancestor => {
          ancestor.setAttribute({ fixed });
        });
      }
      if (element.borders) {
        element.borders.forEach(border => {
          border.setAttribute({ fixed });
        });
      }
    });
  }

  setDrawingObject(drawingObject) {
    this.drawingObject = drawingObject;
    if (this.drawingObject) {
      this.currentTool = null;
      this.creatingHandler = DrawingObject.onHandler;
    }
  }

  /**
   * Assign element handler by const
   * Constants/Tools
   * @param {string} tool
   */
  setTool(tool) {
    if (this.graphType === "axisLabels") {
      return;
    }
    if (this.currentTool !== tool) {
      if (this.graphType !== "axisSegments") {
        this.abortTool();
      }
    }
    this.currentTool = tool;
    switch (tool) {
      case CONSTANT.TOOLS.POINT:
        this.creatingHandler = Point.onHandler;
        return;
      case CONSTANT.TOOLS.LINE:
      case CONSTANT.TOOLS.RAY:
      case CONSTANT.TOOLS.SEGMENT:
      case CONSTANT.TOOLS.VECTOR:
        this.creatingHandler = Line.onHandler(tool);
        return;
      case CONSTANT.TOOLS.CIRCLE:
        this.creatingHandler = Circle.onHandler();
        return;
      case CONSTANT.TOOLS.SIN:
        this.creatingHandler = Sin.onHandler();
        return;
      case CONSTANT.TOOLS.POLYGON:
        this.creatingHandler = Polygon.onHandler();
        return;
      case CONSTANT.TOOLS.PARABOLA:
        this.creatingHandler = Parabola.onHandler();
        return;
      case CONSTANT.TOOLS.HYPERBOLA:
        this.creatingHandler = Hyperbola.onHandler();
        return;
      case CONSTANT.TOOLS.ELLIPSE:
        this.creatingHandler = Ellipse.onHandler();
        return;
      case CONSTANT.TOOLS.TANGENT:
        this.creatingHandler = Tangent.onHandler();
        break;
      case CONSTANT.TOOLS.SECANT:
        this.creatingHandler = Secant.onHandler();
        break;
      case CONSTANT.TOOLS.EXPONENT:
        this.creatingHandler = Exponent.onHandler();
        break;
      case CONSTANT.TOOLS.LOGARITHM:
        this.creatingHandler = Logarithm.onHandler();
        break;
      case CONSTANT.TOOLS.POLYNOM:
        this.creatingHandler = Polynom.onHandler();
        break;
      case CONSTANT.TOOLS.LABEL:
        this.creatingHandler = Label.onHandler();
        return;
      case CONSTANT.TOOLS.ANNOTATION:
        this.creatingHandler = Annotation.onHandler();
        return;
      case CONSTANT.TOOLS.AREA:
        this.creatingHandler = Area.onHandler();
        return;
      case CONSTANT.TOOLS.SEGMENTS_POINT:
        this.creatingHandler = NumberlinePoint.onHandler;
        return;
      case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_INCLUDED:
      case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_HOLLOW:
      case CONSTANT.TOOLS.SEGMENT_LEFT_POINT_HOLLOW:
      case CONSTANT.TOOLS.SEGMENT_RIGHT_POINT_HOLLOW:
        this.creatingHandler = NumberlineSegment.onHandler;
        return;
      case CONSTANT.TOOLS.RAY_LEFT_DIRECTION:
      case CONSTANT.TOOLS.RAY_LEFT_DIRECTION_RIGHT_HOLLOW:
      case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION:
      case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION_LEFT_HOLLOW:
        this.creatingHandler = NumberlineVector.onHandler;
        return;
      case CONSTANT.TOOLS.TRASH:
        this.creatingHandler = () => {};
        return;
      default:
        throw new Error("Unknown tool:", tool);
    }
  }

  abortTool() {
    switch (this.currentTool) {
      case CONSTANT.TOOLS.POINT:
        return false;
      case CONSTANT.TOOLS.LINE:
      case CONSTANT.TOOLS.RAY:
      case CONSTANT.TOOLS.SEGMENT:
      case CONSTANT.TOOLS.VECTOR:
        return Line.clean(this);
      case CONSTANT.TOOLS.CIRCLE:
        return Circle.clean(this);
      case CONSTANT.TOOLS.POLYGON:
        return Polygon.clean(this);
      case CONSTANT.TOOLS.SIN:
        return Sin.clean(this);
      case CONSTANT.TOOLS.PARABOLA:
        return Parabola.clean(this);
      case CONSTANT.TOOLS.ELLIPSE:
        return Ellipse.clean(this);
      case CONSTANT.TOOLS.HYPERBOLA:
        return Hyperbola.clean(this);
      case CONSTANT.TOOLS.EXPONENT:
        return Exponent.clean(this);
      case CONSTANT.TOOLS.LOGARITHM:
        return Logarithm.clean(this);
      case CONSTANT.TOOLS.POLYNOM:
        return Polynom.clean(this);
      case CONSTANT.TOOLS.TANGENT:
        return Tangent.clean(this);
      case CONSTANT.TOOLS.SECANT:
        return Secant.clean(this);
      default:
        return false;
    }
  }

  /**
   * Add event 'Up'
   */
  setCreatingHandler() {
    this.$board.on(CONSTANT.EVENT_NAMES.UP, event => {
      if (this.dragged) {
        this.dragged = false;
        return;
      }

      if (this.currentTool === CONSTANT.TOOLS.TRASH) {
        if (this.removeObjectsUnderMouse(event)) {
          this.events.emit(CONSTANT.EVENT_NAMES.CHANGE_DELETE);
        }
        return;
      }

      if (this.responsesAllowed !== null && this.elements.length >= this.responsesAllowed) {
        return;
      }

      if (!this.isAnyElementsHasFocus(true)) {
        const newElement = this.creatingHandler(this, event);
        if (newElement) {
          this.elements.push(newElement);
          this.events.emit(CONSTANT.EVENT_NAMES.CHANGE_NEW);
        }
      }
    });
  }

  resetOutOfLineMarks() {
    const { canvas } = this.numberlineSettings;
    this.elements.forEach(mark => {
      if (mark.X() < canvas.xMin || mark.X() > canvas.xMax) {
        const setCoords = JXG.COORDS_BY_USER;
        mark.setPosition(setCoords, [this.numberlineAxis.point1.X(), -1]);
      }
    });
  }

  updateNumberlineSettings(canvas, numberlineAxis, layout, first, setValue = () => {}, setCalculatedHeight = () => {}) {
    this.numberlineSettings = {
      canvas,
      numberlineAxis,
      layout,
      setValue,
      setCalculatedHeight
    };

    Object.values(this.$board.defaultAxes).forEach(axis => this.$board.removeObject(axis));

    if (this.graphType === "axisLabels") {
      let { height } = layout;
      if (height === AUTO_VALUE) {
        height = layout.autoCalcHeight || AUTO_HEIGHT_VALUE;
      } else if (Number.isNaN(Number.parseFloat(height))) {
        height = 0;
      }
      this.resizeContainer(layout.width, height);
    } else {
      this.updateStackSettings(
        numberlineAxis.stackResponses,
        numberlineAxis.stackResponsesSpacing,
        canvas.responsesAllowed,
        layout.width
      );
    }

    this.setNumberlineSnapToTicks(numberlineAxis.snapToTicks);

    const margin = Math.min(canvas.margin, layout.width);
    const xMargin = margin / calcUnitX(canvas.xMin, canvas.xMax, layout.width);
    this.$board.setBoundingBox(numberlineGraphParametersToBoundingbox(canvas, xMargin));

    Numberline.updateCoords(this);

    if (this.graphType === "axisLabels") {
      Mark.updateMarksContainer(this, canvas.xMin - xMargin, canvas.xMax + xMargin, {
        position: layout.pointBoxPosition,
        yMax: canvas.yMax,
        yMin: canvas.yMin
      });
      if (!first && this.numberlineAxis) {
        this.resetOutOfLineMarks();
        Mark.alignMarks(this);
        setValue();
      }
    }

    this.updateTitle({
      position: layout.titlePosition,
      title: canvas.title,
      xMin: canvas.xMin,
      xMax: canvas.xMax,
      yMax: canvas.yMax,
      yMin: canvas.yMin
    });

    this.$board.fullUpdate();
  }

  updateStackSettings(stackResponses, stackResponsesSpacing, responsesAllowed, width) {
    if (stackResponses && responsesAllowed > 0 && stackResponsesSpacing > 0) {
      const newHeight = Math.max(150, 75 + (responsesAllowed + 1) * stackResponsesSpacing);
      this.resizeContainer(width, newHeight);
    }

    if (stackResponsesSpacing < 1 || !stackResponses) {
      this.resizeContainer(width, 150);
    }

    this.stackResponses = stackResponses;
    this.stackResponsesSpacing = stackResponsesSpacing;
    this.responsesAllowed = responsesAllowed;
  }

  setNumberlineSnapToTicks(snapToTicks) {
    this.numberlineSnapToTicks = !!snapToTicks;
  }

  setMarksDeleteHandler() {
    this.$board.on("up", event => {
      const mark = this.elements.find(element => `mark-delete-${element.id}` === event.target.id);
      if (!mark) {
        return;
      }

      const setCoords = JXG.COORDS_BY_USER;
      mark.setPosition(setCoords, [this.numberlineAxis.point1.X(), -1]);
      Mark.alignMarks(this);
      this.numberlineSettings.setValue();
    });
  }

  // Render marks
  renderMarks(marks, markCoords = []) {
    marks.forEach(mark => {
      const markCoord = markCoords.find(el => el.id === mark.id);
      this.elements.push(Mark.onHandler(this, markCoord, mark));
    });

    Mark.alignMarks(this);
  }

  removeMarks() {
    this.elements.forEach(mark => this.removeObject(mark));
    this.elements = [];
  }

  removeMarksAnswers() {
    this.answers.forEach(mark => this.removeObject(mark));
    this.answers = [];
  }

  renderTitle(title) {
    this.numberlineTitle = Title.renderTitle(this, title);
    this.$board.fullUpdate();
  }

  updateTitle(title) {
    this.$board.removeObject(this.numberlineTitle);
    this.renderTitle(title);
  }

  getCoords(e) {
    // index of the finger that is used to extract the coordinates
    const i = e[JXG.touchProperty] ? 1 : 0;
    const pos = i ? this.$board.getMousePosition(e) : this.$board.getMousePosition(e, 0);

    return new JXG.Coords(JXG.COORDS_BY_SCREEN, [pos[0], pos[1]], this.$board);
  }

  /**
   *
   *@see https://jsxgraph.org/docs/symbols/JXG.Board.html#create
   */
  createElement(...newElement) {
    return this.$board.create(...newElement);
  }

  /**
   * @see https://jsxgraph.org/docs/symbols/JXG.Board.html#removeObject
   */
  segmentsReset() {
    this.elements.map(this.removeObject.bind(this));
    this.elements = [];
  }

  cleanToolTempPoints() {
    return this.abortTool();
  }

  reset() {
    this.abortTool();
    this.elements.map(this.removeObject.bind(this));
    this.elements = [];
  }

  resetAnswers() {
    this.answers.map(this.removeObject.bind(this));
    this.answers = [];
  }

  resetBg() {
    this.bgElements.map(this.removeObject.bind(this));
    this.bgElements = [];
  }

  removeObjectsUnderMouse(event) {
    const coords = this.getCoords(event);
    const elementsUnderMouse = this.$board.getAllObjectsUnderMouse(event);
    const elementsToDelete = this.elements.filter(
      el =>
        elementsUnderMouse.findIndex(eum => eum.id === el.id) > -1 ||
        (el.type === 100 && isInPolygon({ x: coords.usrCoords[1], y: coords.usrCoords[2] }, el.pointCoords))
    );

    if (elementsToDelete.length === 0) {
      return false;
    }

    this.elements = this.elements.filter(el => elementsToDelete.findIndex(etd => etd.id === el.id) === -1);
    elementsToDelete.forEach(el => {
      this.removeObject(el);
    });

    return true;
  }

  removeObject(obj) {
    if (!obj) {
      return;
    }
    if (typeof obj === "string") {
      this.$board.removeObject(obj);
    } else if (obj.elType !== "point" && obj.elType !== "text") {
      if (obj.getParents) obj.getParents().map(this.removeObject.bind(this));
      if (obj.elType === "curve") this.$board.removeObject(obj);
    } else {
      this.$board.removeObject(obj);
    }
  }

  /**
   * @see https://jsxgraph.org/docs/symbols/src/src_base_constants.js.html
   */
  getConfig() {
    this.abortTool();
    const config = this.elements
      .filter(e => e)
      .map(e => {
        switch (e.type) {
          case JXG.OBJECT_TYPE_POINT:
            return Point.getConfig(e);
          case JXG.OBJECT_TYPE_LINE:
            return Line.getConfig(e);
          case JXG.OBJECT_TYPE_CIRCLE:
            return Circle.getConfig(e);
          case JXG.OBJECT_TYPE_CONIC:
            return Ellipse.getConfig(e);
          case JXG.OBJECT_TYPE_POLYGON:
            return Polygon.getConfig(e);
          case 90:
            return Hyperbola.getConfig(e);
          case 91:
            return Tangent.getConfig(e);
          case 92:
            return Secant.getConfig(e);
          case 93:
            return Exponent.getConfig(e);
          case 94:
            return Logarithm.getConfig(e);
          case 95:
            return Polynom.getConfig(e);
          case 96:
            return Sin.getConfig(e);
          case 97:
            return Parabola.getConfig(e);
          case 98:
            return Equation.getConfig(e);
          case 99:
            return Annotation.getConfig(e);
          case 100:
            return Area.getConfig(e);
          default:
            throw new Error("Unknown element type:", e.name, e.type);
        }
      });
    return Object.values(flatConfig(config));
  }

  getMarks() {
    return this.elements.map(mark => Mark.getConfig(mark)).filter(mark => mark.mounted);
  }

  getSegments() {
    return this.elements
      .filter(element => element.elType === "segment" || element.elType === "point")
      .map(element => {
        switch (element.segmentType) {
          case CONSTANT.TOOLS.SEGMENTS_POINT:
            return NumberlinePoint.getConfig(element);
          case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_INCLUDED:
          case CONSTANT.TOOLS.SEGMENT_LEFT_POINT_HOLLOW:
          case CONSTANT.TOOLS.SEGMENT_RIGHT_POINT_HOLLOW:
          case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_HOLLOW:
            return NumberlineSegment.getConfig(element);
          case CONSTANT.TOOLS.RAY_LEFT_DIRECTION:
          case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION:
          case CONSTANT.TOOLS.RAY_LEFT_DIRECTION_RIGHT_HOLLOW:
          case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION_LEFT_HOLLOW:
            return NumberlineVector.getConfig(element);
          default:
            break;
        }
      });
  }

  // settings

  getParameters(name) {
    switch (name) {
      case CONSTANT.TOOLS.POINT:
        return this.parameters.pointParameters;
      default:
    }
  }

  /**
   * settings::pointParameters
   */
  setPointParameters(pointParameters) {
    const isSwitchToGrid =
      this.parameters.pointParameters && !this.parameters.pointParameters.snapToGrid && pointParameters.snapToGrid;
    updatePointParameters(this.elements, pointParameters, isSwitchToGrid);
    this.parameters.pointParameters = {
      ...this.parameters.pointParameters,
      ...pointParameters
    };
    this.$board.fullUpdate();
  }

  /**
   * settings::axesParameters
   */
  setAxesParameters(axesParameters) {
    const axes = this.$board.defaultAxes;

    if (axesParameters.x) {
      updateAxe(axes.x, axesParameters.x, "x");
    }
    if (axesParameters.y) {
      updateAxe(axes.y, axesParameters.y, "y");
    }

    this.$board.fullUpdate();
  }

  /**
   * graphParameters
   * settings::graphParameters
   * @see https://jsxgraph.org/docs/symbols/JXG.Board.html#setBoundingBox
   */
  setGraphParameters(graphParameters) {
    this.$board.setBoundingBox(graphParameters2Boundingbox(graphParameters));
  }

  /**
   * gridParameters
   * settings::graphParameters
   * @see https://jsxgraph.org/docs/symbols/JXG.Board.html#setBoundingBox
   */
  setGridParameters(gridParameters) {
    updateGrid(this.$board.grids, gridParameters);
    this.$board.fullUpdate();
  }

  /**
   *
   * @see https://jsxgraph.org/docs/symbols/JXG.Board.html#resizeContainer
   */
  resizeContainer(canvasWidth, canvasHeight) {
    this.$board.resizeContainer(canvasWidth || 0, canvasHeight || 0);
  }

  setBgObjects(flatCfg, showPoints = true) {
    const config = flat2nestedConfig(flatCfg);
    const objectOptions = {
      [CONSTANT.TOOLS.POINT]: {
        ...defaultBgObjectParameters(),
        visible: showPoints
      },
      [CONSTANT.TOOLS.LINE]: {
        ...defaultBgObjectParameters()
      },
      [CONSTANT.TOOLS.RAY]: {
        ...defaultBgObjectParameters()
      },
      [CONSTANT.TOOLS.SEGMENT]: {
        ...defaultBgObjectParameters()
      },
      [CONSTANT.TOOLS.VECTOR]: {
        ...defaultBgObjectParameters()
      },
      [CONSTANT.TOOLS.CIRCLE]: {
        ...defaultBgObjectParameters(),
        ...Circle.parseConfig()
      },
      [CONSTANT.TOOLS.POLYGON]: {
        ...defaultBgObjectParameters(),
        ...Polygon.parseConfig(),
        borders: defaultBgObjectParameters()
      },
      [CONSTANT.TOOLS.PARABOLA]: {
        ...defaultBgObjectParameters(),
        fillColor: "transparent",
        highlightFillColor: "transparent",
        highlightStrokeWidth: 1
      },
      [CONSTANT.TOOLS.ELLIPSE]: {
        ...defaultBgObjectParameters(),
        fillColor: "transparent",
        highlightFillColor: "transparent",
        highlightStrokeWidth: 1
      },
      [CONSTANT.TOOLS.HYPERBOLA]: {
        ...defaultBgObjectParameters(),
        fillColor: "transparent",
        highlightFillColor: "transparent",
        highlightStrokeWidth: 1
      },
      [CONSTANT.TOOLS.SIN]: {
        ...defaultBgObjectParameters(),
        fillColor: "transparent",
        highlightFillColor: "transparent",
        highlightStrokeWidth: 1
      },
      [CONSTANT.TOOLS.TANGENT]: {
        ...defaultBgObjectParameters(),
        fillColor: "transparent",
        highlightFillColor: "transparent",
        highlightStrokeWidth: 1
      },
      [CONSTANT.TOOLS.SECANT]: {
        ...defaultBgObjectParameters(),
        fillColor: "transparent",
        highlightFillColor: "transparent",
        highlightStrokeWidth: 1
      },
      [CONSTANT.TOOLS.EXPONENT]: {
        ...defaultBgObjectParameters(),
        fillColor: "transparent",
        highlightFillColor: "transparent",
        highlightStrokeWidth: 1
      },
      [CONSTANT.TOOLS.LOGARITHM]: {
        ...defaultBgObjectParameters(),
        fillColor: "transparent",
        highlightFillColor: "transparent",
        highlightStrokeWidth: 1
      },
      [CONSTANT.TOOLS.POLYNOM]: {
        ...defaultBgObjectParameters(),
        fillColor: "transparent",
        highlightFillColor: "transparent",
        highlightStrokeWidth: 1
      },
      [CONSTANT.TOOLS.EQUATION]: {
        ...defaultBgObjectParameters(),
        fillColor: "transparent",
        highlightFillColor: "transparent",
        highlightStrokeWidth: 1
      },
      [CONSTANT.TOOLS.ANNOTATION]: {
        fixed: true
      },
      [CONSTANT.TOOLS.AREA]: {
        ...defaultBgObjectParameters()
      }
    };
    this.bgElements.push(
      ...this.loadObjects(config, ({ objectCreator, el }) => {
        const { type, colors = {} } = el;
        const newElement = objectCreator({
          ...objectOptions[type],
          ...colors
        });
        QuillInput(newElement, this).setLabel(el.label, true);
        return newElement;
      })
    );
  }

  loadMarksAnswers(marks, markCoords) {
    if (markCoords) {
      marks.forEach(mark => {
        const markCoord = markCoords.find(el => el.id === mark.id);
        if (markCoord) {
          this.answers.push(Mark.onHandler(this, { ...markCoord, fixed: true }, mark));
        }
      });
    }
  }

  loadSegmentsAnswers(segments) {
    this.answers.push(
      ...segments.map(segment => {
        switch (segment.type) {
          case CONSTANT.TOOLS.SEGMENTS_POINT:
            return NumberlinePoint.renderAnswer(this, segment);
          case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_INCLUDED:
          case CONSTANT.TOOLS.SEGMENT_LEFT_POINT_HOLLOW:
          case CONSTANT.TOOLS.SEGMENT_RIGHT_POINT_HOLLOW:
          case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_HOLLOW:
            return NumberlineSegment.determineAnswerType(this, segment);
          case CONSTANT.TOOLS.RAY_LEFT_DIRECTION:
          case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION:
          case CONSTANT.TOOLS.RAY_LEFT_DIRECTION_RIGHT_HOLLOW:
          case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION_LEFT_HOLLOW:
            return NumberlineVector.determineAnswerType(this, segment);
          default:
            break;
        }
      })
    );
  }

  loadFromConfig(flatCfg, labelIsReadOnly = false) {
    const config = flat2nestedConfig(flatCfg);
    this.elements.push(
      ...this.loadObjects(config, ({ objectCreator, el }) => {
        const newElement = objectCreator({
          ...Colors.default[
            (type => {
              if (
                type === CONSTANT.TOOLS.LINE ||
                type === CONSTANT.TOOLS.RAY ||
                type === CONSTANT.TOOLS.SEGMENT ||
                type === CONSTANT.TOOLS.VECTOR
              ) {
                return CONSTANT.TOOLS.LINE;
              }
              return type;
            })(el.type)
          ],
          ...el.colors
        });
        QuillInput(newElement, this).setLabel(el.label, labelIsReadOnly);
        return newElement;
      })
    );
  }

  loadAnswersFromConfig(flatCfg) {
    const config = flat2nestedConfig(flatCfg);
    this.answers.push(
      ...this.loadAnswersObjects(config, ({ objectCreator, el }) => {
        const newElement = objectCreator({
          ...Colors.default[
            (type => {
              if (
                type === CONSTANT.TOOLS.LINE ||
                type === CONSTANT.TOOLS.RAY ||
                type === CONSTANT.TOOLS.SEGMENT ||
                type === CONSTANT.TOOLS.VECTOR
              ) {
                return CONSTANT.TOOLS.LINE;
              }
              return type;
            })(el.type)
          ],
          ...el.colors
        });
        QuillInput(newElement, this).setLabel(el.label, true);
        return newElement;
      })
    );
  }

  loadSegments(elements) {
    this.elements.push(
      ...elements.map(element => {
        switch (element.type) {
          case CONSTANT.TOOLS.SEGMENTS_POINT:
            return NumberlinePoint.loadPoint(this, element);
          case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_INCLUDED:
            return NumberlineSegment.loadSegment(this, element, true, true, CONSTANT.TOOLS.SEGMENT_BOTH_POINT_INCLUDED);
          case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_HOLLOW:
            return NumberlineSegment.loadSegment(this, element, false, false, CONSTANT.TOOLS.SEGMENT_BOTH_POINT_HOLLOW);
          case CONSTANT.TOOLS.SEGMENT_LEFT_POINT_HOLLOW:
            return NumberlineSegment.loadSegment(this, element, false, true, CONSTANT.TOOLS.SEGMENT_LEFT_POINT_HOLLOW);
          case CONSTANT.TOOLS.SEGMENT_RIGHT_POINT_HOLLOW:
            return NumberlineSegment.loadSegment(this, element, true, false, CONSTANT.TOOLS.SEGMENT_RIGHT_POINT_HOLLOW);
          case CONSTANT.TOOLS.RAY_LEFT_DIRECTION:
            return NumberlineVector.loadVector(this, element, true, false, CONSTANT.TOOLS.RAY_LEFT_DIRECTION);
          case CONSTANT.TOOLS.RAY_LEFT_DIRECTION_RIGHT_HOLLOW:
            return NumberlineVector.loadVector(
              this,
              element,
              false,
              false,
              CONSTANT.TOOLS.RAY_LEFT_DIRECTION_RIGHT_HOLLOW
            );
          case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION:
            return NumberlineVector.loadVector(this, element, true, true, CONSTANT.TOOLS.RAY_RIGHT_DIRECTION);
          case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION_LEFT_HOLLOW:
            return NumberlineVector.loadVector(
              this,
              element,
              false,
              true,
              CONSTANT.TOOLS.RAY_RIGHT_DIRECTION_LEFT_HOLLOW
            );
          default:
            throw new Error("Unknown element:", element);
        }
      })
    );
  }

  /**
   *
   * @param {array} objects
   * @see getConfig
   */
  loadObjects(objectArray, mixProps) {
    const objects = [];
    objectArray.forEach(el => {
      switch (el._type) {
        case JXG.OBJECT_TYPE_POINT:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => {
                const [name, points, props] = Point.parseConfig(el, this.getParameters(CONSTANT.TOOLS.POINT));
                const point = this.createElement(name, points, {
                  ...props,
                  ...attrs,
                  visible: true,
                  id: el.id
                });
                point.on("up", () => {
                  if (point.dragged) {
                    point.dragged = false;
                    this.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE);
                  }
                });
                point.on("drag", e => {
                  if (e.movementX === 0 && e.movementY === 0) {
                    return;
                  }
                  point.dragged = true;
                  this.dragged = true;
                });
                return point;
              }
            })
          );
          break;
        case JXG.OBJECT_TYPE_LINE:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => {
                const line = this.createElement(
                  "line",
                  [
                    mixProps({
                      el: el.points[0],
                      objectCreator: attributes => this.createPointFromConfig(el.points[0], attributes)
                    }),
                    mixProps({
                      el: el.points[1],
                      objectCreator: attributes => this.createPointFromConfig(el.points[1], attributes)
                    })
                  ],
                  {
                    ...Line.parseConfig(el.type),
                    ...attrs,
                    id: el.id
                  }
                );
                handleSnap(line, Object.values(line.ancestors), this);
                return line;
              }
            })
          );
          break;
        case JXG.OBJECT_TYPE_CIRCLE:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => {
                const circle = this.createElement(
                  "circle",
                  [
                    mixProps({
                      el: el.points[0],
                      objectCreator: attributes => this.createPointFromConfig(el.points[0], attributes)
                    }),
                    mixProps({
                      el: el.points[1],
                      objectCreator: attributes => this.createPointFromConfig(el.points[1], attributes)
                    })
                  ],
                  {
                    ...Circle.parseConfig(),
                    ...attrs,
                    id: el.id
                  }
                );
                handleSnap(circle, Object.values(circle.ancestors), this);
                return circle;
              }
            })
          );
          break;
        case JXG.OBJECT_TYPE_CONIC:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => {
                const newLine = this.createElement(
                  "ellipse",
                  [
                    mixProps({
                      el: el.points[0],
                      objectCreator: attributes => this.createPointFromConfig(el.points[0], attributes)
                    }),
                    mixProps({
                      el: el.points[1],
                      objectCreator: attributes => this.createPointFromConfig(el.points[1], attributes)
                    }),
                    mixProps({
                      el: el.points[2],
                      objectCreator: attributes => this.createPointFromConfig(el.points[2], attributes)
                    })
                  ],
                  {
                    ...Ellipse.parseConfig(),
                    ...attrs,
                    id: el.id
                  }
                );
                handleSnap(newLine, Object.values(newLine.ancestors), this);
                return newLine;
              }
            })
          );
          break;
        case JXG.OBJECT_TYPE_POLYGON:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => {
                const polygon = this.createElement(
                  "polygon",
                  el.points.map(pointEl =>
                    mixProps({
                      el: pointEl,
                      objectCreator: attributes => this.createPointFromConfig(pointEl, attributes)
                    })
                  ),
                  {
                    ...Polygon.parseConfig(),
                    ...attrs,
                    id: el.id
                  }
                );
                handleSnap(polygon, Object.values(polygon.ancestors), this);
                polygon.borders.forEach(border => {
                  border.on("up", () => {
                    if (border.dragged) {
                      border.dragged = false;
                      this.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE);
                    }
                  });
                  border.on("drag", e => {
                    if (e.movementX === 0 && e.movementY === 0) {
                      return;
                    }
                    border.dragged = true;
                    this.dragged = true;
                  });
                });
                return polygon;
              }
            })
          );
          break;
        case 90:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => {
                const newLine = this.createElement(
                  "hyperbola",
                  [
                    mixProps({
                      el: el.points[0],
                      objectCreator: attributes => this.createPointFromConfig(el.points[0], attributes)
                    }),
                    mixProps({
                      el: el.points[1],
                      objectCreator: attributes => this.createPointFromConfig(el.points[1], attributes)
                    }),
                    mixProps({
                      el: el.points[2],
                      objectCreator: attributes => this.createPointFromConfig(el.points[2], attributes)
                    })
                  ],
                  {
                    ...Hyperbola.parseConfig(),
                    ...attrs,
                    id: el.id
                  }
                );
                newLine.type = 90;
                handleSnap(newLine, Object.values(newLine.ancestors), this);
                return newLine;
              }
            })
          );
          break;
        case 91:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => {
                const [name, [makeFn, points], props] = Tangent.parseConfig(
                  el.points.map(pointEl =>
                    mixProps({
                      el: pointEl,
                      objectCreator: attributes => this.createPointFromConfig(pointEl, attributes)
                    })
                  )
                );
                const newElem = this.createElement(name, makeFn(points), {
                  ...props,
                  ...attrs,
                  id: el.id
                });
                newElem.ancestors = {
                  [points[0].id]: points[0],
                  [points[1].id]: points[1]
                };
                newElem.type = 91;
                newElem.addParents(points);
                handleSnap(newElem, Object.values(newElem.ancestors), this);
                return newElem;
              }
            })
          );
          break;
        case 92:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => {
                const [name, [makeFn, points], props] = Secant.parseConfig(
                  el.points.map(pointEl =>
                    mixProps({
                      el: pointEl,
                      objectCreator: attributes => this.createPointFromConfig(pointEl, attributes)
                    })
                  )
                );
                const newElem = this.createElement(name, makeFn(points), {
                  ...props,
                  ...attrs,
                  id: el.id
                });
                newElem.ancestors = {
                  [points[0].id]: points[0],
                  [points[1].id]: points[1]
                };
                newElem.type = 92;
                newElem.addParents(points);
                handleSnap(newElem, Object.values(newElem.ancestors), this);
                return newElem;
              }
            })
          );
          break;
        case 93:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => {
                const [name, [makeFn, points], props] = Exponent.parseConfig(
                  el.points.map(pointEl =>
                    mixProps({
                      el: pointEl,
                      objectCreator: attributes => this.createPointFromConfig(pointEl, attributes)
                    })
                  )
                );
                const newElem = this.createElement(name, makeFn(points), {
                  ...props,
                  ...attrs,
                  id: el.id
                });
                newElem.ancestors = {
                  [points[0].id]: points[0],
                  [points[1].id]: points[1]
                };
                newElem.type = 93;
                newElem.addParents(points);
                handleSnap(newElem, Object.values(newElem.ancestors), this);
                return newElem;
              }
            })
          );
          break;
        case 94:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => {
                const [name, [makeFn, points], props] = Logarithm.parseConfig(
                  el.points.map(pointEl =>
                    mixProps({
                      el: pointEl,
                      objectCreator: attributes => this.createPointFromConfig(pointEl, attributes)
                    })
                  )
                );
                const newElem = this.createElement(name, makeFn(points), {
                  ...props,
                  ...attrs,
                  id: el.id
                });
                newElem.ancestors = {
                  [points[0].id]: points[0],
                  [points[1].id]: points[1]
                };
                newElem.type = 94;
                newElem.addParents(points);
                handleSnap(newElem, Object.values(newElem.ancestors), this);
                return newElem;
              }
            })
          );
          break;
        case 95:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => {
                const [name, [makeFn, points], props] = Polynom.parseConfig(
                  el.points.map(pointEl =>
                    mixProps({
                      el: pointEl,
                      objectCreator: attributes => this.createPointFromConfig(pointEl, attributes)
                    })
                  )
                );
                const newElem = this.createElement(name, makeFn(points), {
                  ...props,
                  ...attrs,
                  id: el.id
                });
                newElem.type = 95;
                newElem.addParents(points);
                newElem.ancestors = Polynom.flatConfigPoints(points);
                handleSnap(newElem, Object.values(newElem.ancestors), this);
                return newElem;
              }
            })
          );
          break;
        case 96:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => {
                const [name, [makeFn, points], props] = Sin.parseConfig(
                  el.points.map(pointEl =>
                    mixProps({
                      el: pointEl,
                      objectCreator: attributes => this.createPointFromConfig(pointEl, attributes)
                    })
                  )
                );
                const newElem = this.createElement(name, makeFn(points), {
                  ...props,
                  ...attrs,
                  id: el.id
                });
                newElem.ancestors = {
                  [points[0].id]: points[0],
                  [points[1].id]: points[1]
                };
                newElem.type = 96;
                newElem.addParents(points);
                handleSnap(newElem, Object.values(newElem.ancestors), this);
                return newElem;
              }
            })
          );
          break;
        case 97:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => {
                const props = Parabola.parseConfig();
                const points = el.points.map(pointEl =>
                  mixProps({
                    el: pointEl,
                    objectCreator: attributes => this.createPointFromConfig(pointEl, attributes)
                  })
                );

                return Parabola.renderElement(this, points, {
                  ...props,
                  ...attrs,
                  id: el.id
                });
              }
            })
          );
          break;
        case 98:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => {
                const props = Equation.parseConfig();

                let points = null;
                if (el.points) {
                  points = el.points.map(pointEl =>
                    mixProps({
                      el: pointEl,
                      objectCreator: attributes => this.createPointFromConfig(pointEl, attributes)
                    })
                  );
                }

                return Equation.renderElement(this, el, points, {
                  ...props,
                  ...attrs
                });
              }
            })
          );
          break;
        case 99:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => Annotation.renderElement(this, el, { ...attrs })
            })
          );
          break;
        case 100:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => Area.renderElement(this, el, { ...attrs })
            })
          );
          break;
        default:
          throw new Error("Unknown element:", el);
      }
    });
    return objects;
  }

  /**
   *
   * @param {array} objects
   * @see getConfig
   */
  loadAnswersObjects(objectArray, mixProps) {
    const objects = [];
    objectArray.forEach(el => {
      switch (el._type) {
        case JXG.OBJECT_TYPE_POINT:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => {
                const [name, points, props] = Point.parseConfig(el, this.getParameters(CONSTANT.TOOLS.POINT));
                return this.createElement(name, points, {
                  ...props,
                  ...attrs,
                  visible: true,
                  fixed: true
                });
              }
            })
          );
          break;
        case JXG.OBJECT_TYPE_LINE:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs =>
                this.createElement(
                  "line",
                  [
                    mixProps({
                      el: el.points[0],
                      objectCreator: attributes => this.createAnswerPointFromConfig(el.points[0], attributes)
                    }),
                    mixProps({
                      el: el.points[1],
                      objectCreator: attributes => this.createAnswerPointFromConfig(el.points[1], attributes)
                    })
                  ],
                  {
                    ...Line.parseConfig(el.type),
                    ...attrs,
                    fixed: true
                  }
                )
            })
          );
          break;
        case JXG.OBJECT_TYPE_CIRCLE:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs =>
                this.createElement(
                  "circle",
                  [
                    mixProps({
                      el: el.points[0],
                      objectCreator: attributes => this.createAnswerPointFromConfig(el.points[0], attributes)
                    }),
                    mixProps({
                      el: el.points[1],
                      objectCreator: attributes => this.createAnswerPointFromConfig(el.points[1], attributes)
                    })
                  ],
                  {
                    ...Circle.parseConfig(),
                    ...attrs,
                    fixed: true
                  }
                )
            })
          );
          break;
        case JXG.OBJECT_TYPE_CONIC:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => {
                const newLine = this.createElement(
                  "ellipse",
                  [
                    mixProps({
                      el: el.points[0],
                      objectCreator: attributes => this.createAnswerPointFromConfig(el.points[0], attributes)
                    }),
                    mixProps({
                      el: el.points[1],
                      objectCreator: attributes => this.createAnswerPointFromConfig(el.points[1], attributes)
                    }),
                    mixProps({
                      el: el.points[2],
                      objectCreator: attributes => this.createAnswerPointFromConfig(el.points[2], attributes)
                    })
                  ],
                  {
                    ...Ellipse.parseConfig(),
                    ...attrs,
                    fixed: true
                  }
                );

                handleSnap(newLine, Object.values(newLine.ancestors), this);
                return newLine;
              }
            })
          );
          break;
        case JXG.OBJECT_TYPE_POLYGON:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs =>
                this.createElement(
                  "polygon",
                  el.points.map(pointEl =>
                    mixProps({
                      el: pointEl,
                      objectCreator: attributes => this.createAnswerPointFromConfig(pointEl, attributes)
                    })
                  ),
                  {
                    ...Polygon.parseConfig(),
                    ...attrs,
                    fixed: true
                  }
                )
            })
          );
          break;
        case 90:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => {
                const newLine = this.createElement(
                  "hyperbola",
                  [
                    mixProps({
                      el: el.points[0],
                      objectCreator: attributes => this.createAnswerPointFromConfig(el.points[0], attributes)
                    }),
                    mixProps({
                      el: el.points[1],
                      objectCreator: attributes => this.createAnswerPointFromConfig(el.points[1], attributes)
                    }),
                    mixProps({
                      el: el.points[2],
                      objectCreator: attributes => this.createAnswerPointFromConfig(el.points[2], attributes)
                    })
                  ],
                  {
                    ...Hyperbola.parseConfig(),
                    ...attrs,
                    fixed: true
                  }
                );

                newLine.type = 90;
                handleSnap(newLine, Object.values(newLine.ancestors), this);

                return newLine;
              }
            })
          );
          break;
        case 91:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => {
                const [name, [makeFn, points], props] = Tangent.parseConfig(
                  el.points.map(pointEl =>
                    mixProps({
                      el: pointEl,
                      objectCreator: attributes => this.createAnswerPointFromConfig(pointEl, attributes)
                    })
                  )
                );
                const newElem = this.createElement(name, makeFn(points), {
                  ...props,
                  ...attrs,
                  fixed: true
                });
                newElem.ancestors = {
                  [points[0].id]: points[0],
                  [points[1].id]: points[1]
                };
                newElem.type = 91;
                newElem.addParents(points);
                handleSnap(newElem, Object.values(newElem.ancestors), this);
                return newElem;
              }
            })
          );
          break;
        case 92:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => {
                const [name, [makeFn, points], props] = Secant.parseConfig(
                  el.points.map(pointEl =>
                    mixProps({
                      el: pointEl,
                      objectCreator: attributes => this.createAnswerPointFromConfig(pointEl, attributes)
                    })
                  )
                );
                const newElem = this.createElement(name, makeFn(points), {
                  ...props,
                  ...attrs,
                  fixed: true
                });
                newElem.ancestors = {
                  [points[0].id]: points[0],
                  [points[1].id]: points[1]
                };
                newElem.type = 92;
                newElem.addParents(points);
                handleSnap(newElem, Object.values(newElem.ancestors), this);
                return newElem;
              }
            })
          );
          break;
        case 93:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => {
                const [name, [makeFn, points], props] = Exponent.parseConfig(
                  el.points.map(pointEl =>
                    mixProps({
                      el: pointEl,
                      objectCreator: attributes => this.createAnswerPointFromConfig(pointEl, attributes)
                    })
                  )
                );
                const newElem = this.createElement(name, makeFn(points), {
                  ...props,
                  ...attrs,
                  fixed: true
                });
                newElem.ancestors = {
                  [points[0].id]: points[0],
                  [points[1].id]: points[1]
                };
                newElem.type = 93;
                newElem.addParents(points);
                handleSnap(newElem, Object.values(newElem.ancestors), this);
                return newElem;
              }
            })
          );
          break;
        case 94:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => {
                const [name, [makeFn, points], props] = Logarithm.parseConfig(
                  el.points.map(pointEl =>
                    mixProps({
                      el: pointEl,
                      objectCreator: attributes => this.createAnswerPointFromConfig(pointEl, attributes)
                    })
                  )
                );
                const newElem = this.createElement(name, makeFn(points), {
                  ...props,
                  ...attrs,
                  fixed: true
                });
                newElem.ancestors = {
                  [points[0].id]: points[0],
                  [points[1].id]: points[1]
                };
                newElem.type = 94;
                newElem.addParents(points);
                handleSnap(newElem, Object.values(newElem.ancestors), this);
                return newElem;
              }
            })
          );
          break;
        case 95:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => {
                const [name, [makeFn, points], props] = Polynom.parseConfig(
                  el.points.map(pointEl =>
                    mixProps({
                      el: pointEl,
                      objectCreator: attributes => this.createAnswerPointFromConfig(pointEl, attributes)
                    })
                  )
                );
                const newElem = this.createElement(name, makeFn(points), {
                  ...props,
                  ...attrs,
                  fixed: true
                });
                newElem.type = 95;
                newElem.addParents(points);
                newElem.ancestors = Polynom.flatConfigPoints(points);
                handleSnap(newElem, Object.values(newElem.ancestors), this);
                return newElem;
              }
            })
          );
          break;
        case 96:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => {
                const [name, [makeFn, points], props] = Sin.parseConfig(
                  el.points.map(pointEl =>
                    mixProps({
                      el: pointEl,
                      objectCreator: attributes => this.createAnswerPointFromConfig(pointEl, attributes)
                    })
                  )
                );
                const newElem = this.createElement(name, makeFn(points), {
                  ...props,
                  ...attrs,
                  fixed: true
                });
                newElem.ancestors = {
                  [points[0].id]: points[0],
                  [points[1].id]: points[1]
                };
                newElem.type = 96;
                newElem.addParents(points);
                handleSnap(newElem, Object.values(newElem.ancestors), this);
                return newElem;
              }
            })
          );
          break;
        case 97:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => {
                const props = Parabola.parseConfig();
                const points = el.points.map(pointEl =>
                  mixProps({
                    el: pointEl,
                    objectCreator: attributes => this.createAnswerPointFromConfig(pointEl, attributes)
                  })
                );

                return Parabola.renderElement(this, points, {
                  ...props,
                  ...attrs,
                  fixed: true
                });
              }
            })
          );
          break;
        case 98:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => {
                const props = Equation.parseConfig();

                let points = null;
                if (el.points) {
                  points = el.points.map(pointEl =>
                    mixProps({
                      el: pointEl,
                      objectCreator: attributes => this.createAnswerPointFromConfig(pointEl, attributes)
                    })
                  );
                }

                return Equation.renderElement(this, el, points, {
                  ...props,
                  ...attrs,
                  fixed: true
                });
              }
            })
          );
          break;
        case 100:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => Area.renderElement(this, el, { ...attrs })
            })
          );
          break;
        default:
          throw new Error("Unknown element:", el);
      }
    });
    return objects;
  }

  /**
   * Find point
   * @param {Object} el Point::getConfig
   * @param {Object} attrs provided attributes
   * @see Point::getConfig
   */
  createPointFromConfig(el, attrs) {
    // const point = Point.findPoint(this.$board.objectsList, [1, el.x, el.y]);
    // if (point && el.x !== 0 && el.y !== 0) {
    //   return point;
    // }
    const [name, points, props] = Point.parseConfig(el, this.getParameters(CONSTANT.TOOLS.POINT));
    return this.createElement(name, points, { ...props, ...attrs });
  }

  /**
   * Find point
   * @param {Object} el Point::getConfig
   * @param {Object} attrs provided attributes
   * @see Point::getConfig
   */
  createAnswerPointFromConfig(el, attrs) {
    // const point = Point.findPoint(this.$board.objectsList, [1, el.x, el.y]);
    // if (point && el.x !== 0 && el.y !== 0) {
    //   return point;
    // }
    const [name, points, props] = Point.parseConfig(el, this.getParameters(CONSTANT.TOOLS.POINT));
    return this.createElement(name, points, { ...props, ...attrs, fixed: true });
  }

  /**
   * settings::bgImageParameters
   * @see https://jsxgraph.org/docs/symbols/Image.html
   */
  setBgImage(bgImageParameters) {
    const bgImage = this.createElement("image", [
      bgImageParameters.urlImg,
      ...getImageCoordsByPercent(this.parameters, bgImageParameters)
    ]);
    bgImage.setAttribute({
      fixed: true,
      highlightFillOpacity: bgImageParameters.opacity,
      opacity: bgImageParameters.opacity
    });
    this.bgImage = bgImage;
  }

  removeBgImage() {
    this.$board.removeObject(this.bgImage);
  }

  isDragMode() {
    return this.$board.mode === this.$board.BOARD_MODE_DRAG;
  }
}

export function makeBorder(id, graphType, config) {
  return new Board(id, graphType, config);
}

export default Board;
