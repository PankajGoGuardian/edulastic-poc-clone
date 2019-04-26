import { cloneDeep, isEqual } from "lodash";
import JXG from "jsxgraph";
import getDefaultConfig, { CONSTANT, Colors } from "./config";
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
  NumberlineTrash,
  Title,
  Tangent,
  Secant,
  Exponent,
  Logarithm,
  Polynom
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
  updateNumberline,
  updateGrid,
  getImageCoordsByPercent,
  flatConfig,
  flat2nestedConfig,
  checkMarksRenderSpace,
  calcMeasure,
  calcUnitX,
  findElementsDiff,
  handleSnap
} from "./utils";
import _events from "./events";

import "jsxgraph/distrib/jsxgraph.css";
import "../common/GraphShapeLabel.css";
import "../common/Mark.css";
import { inherits } from "util";

/**
 * if the coords between mousedown and mouseup events are different - is it move
 */
function dragDetector() {
  const start = {
    x: 0,
    y: 0
  };
  let elementsCopy = [];
  let toolTempPointsCopy = [];
  return {
    start(event, elements, points) {
      start.x = event.clientX;
      start.y = event.clientY;
      elementsCopy = cloneDeep(elements);
      toolTempPointsCopy = cloneDeep(points);
    },
    isDragElements(event, elements) {
      if (start.x === event.clientX && start.y === event.clientY) {
        return false;
      }

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const copyElement = elementsCopy.find(el => el.id === element.id);

        if (element.elType === "point") {
          if (!isEqual(copyElement.coords.usrCoords, element.coords.usrCoords)) {
            return true;
          }
        } else if (element.ancestors && copyElement.ancestors) {
          const ancestors = Object.values(element.ancestors);
          for (let j = 0; j < ancestors.length; j++) {
            const ancestor = ancestors[j];
            const copyAncestor = Object.values(copyElement.ancestors).find(el => el.id === ancestor.id);
            if (!isEqual(copyAncestor.coords.usrCoords, ancestor.coords.usrCoords)) {
              return true;
            }
          }
        }
      }

      return false;
    },
    isDragToolTempPoints(event, points) {
      if (start.x === event.clientX && start.y === event.clientY) {
        return false;
      }

      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        const copyPoint = toolTempPointsCopy.find(el => el.id === point.id);
        if (!isEqual(copyPoint.coords.usrCoords, point.coords.usrCoords)) {
          return true;
        }
      }

      return false;
    }
  };
}

/**
 * @see https://jsxgraph.org/docs/symbols/JXG.JSXGraph.html#.initBoard
 */
class Board {
  constructor(id, config = {}) {
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
    /**
     * Board settings
     */
    this.parameters = fillConfigDefaultParameters(config);
    /**
     * Current tool
     */
    this.currentTool = null;

    this.stackResponses = false;

    this.deleteHighlighting = false;

    this.stackResponsesSpacing = 30;

    this.responsesAllowed = 2;

    this.dragDetector = dragDetector();

    this.events = _events();

    this.$board = JXG.JSXGraph.initBoard(id, mergeParams(getDefaultConfig(), this.parameters));
    this.$board.setZoom(1, 1);
    this.$board.on(CONSTANT.EVENT_NAMES.DOWN, event => {
      this.dragDetector.start(event, this.elements, this.getToolTempPoints());
    });
  }

  isAnyElementsHasFocus() {
    if (!this.elements) {
      return false;
    }

    for (let i = 0; i < this.elements.length; i++) {
      const element = this.elements[i];
      if (element.hasFocus) {
        return true;
      }

      if (element.ancestors) {
        const ancestors = Object.values(element.ancestors);
        for (let j = 0; j < ancestors.length; j++) {
          if (ancestors[j].hasFocus) {
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

  /**
   * Assign element handler by const
   * Constants/Tools
   * @param {string} tool
   */
  setTool(tool, graphType, responsesAllowed) {
    if (graphType === "axisLabels") {
      return;
    }
    if (this.currentTool !== tool) {
      if (graphType !== "axisSegments") {
        this.abortTool();
      }
    }
    this.handleElementsHighlighting(tool);
    this.$board.off(CONSTANT.EVENT_NAMES.UP);
    this.currentTool = tool;
    switch (tool) {
      case CONSTANT.TOOLS.POINT:
        this.setCreatingHandler(Point.onHandler, responsesAllowed);
        return;
      case CONSTANT.TOOLS.LINE:
      case CONSTANT.TOOLS.RAY:
      case CONSTANT.TOOLS.SEGMENT:
      case CONSTANT.TOOLS.VECTOR:
        this.setCreatingHandler(Line.onHandler(tool));
        return;
      case CONSTANT.TOOLS.CIRCLE:
        this.setCreatingHandler(Circle.onHandler());
        return;
      case CONSTANT.TOOLS.SIN:
        this.setCreatingHandler(Sin.onHandler());
        return;
      case CONSTANT.TOOLS.POLYGON:
        this.setCreatingHandler(Polygon.onHandler());
        return;
      case CONSTANT.TOOLS.PARABOLA:
        this.setCreatingHandler(Parabola.onHandler());
        return;
      case CONSTANT.TOOLS.HYPERBOLA:
        this.setCreatingHandler(Hyperbola.onHandler());
        return;
      case CONSTANT.TOOLS.ELLIPSE:
        this.setCreatingHandler(Ellipse.onHandler());
        return;
      case CONSTANT.TOOLS.TANGENT:
        this.setCreatingHandler(Tangent.onHandler());
        break;
      case CONSTANT.TOOLS.SECANT:
        this.setCreatingHandler(Secant.onHandler());
        break;
      case CONSTANT.TOOLS.EXPONENT:
        this.setCreatingHandler(Exponent.onHandler());
        break;
      case CONSTANT.TOOLS.LOGARITHM:
        this.setCreatingHandler(Logarithm.onHandler());
        break;
      case CONSTANT.TOOLS.POLYNOM:
        this.setCreatingHandler(Polynom.onHandler());
        break;
      case CONSTANT.TOOLS.LABEL:
        this.setCreatingHandler(Label.onHandler());
        return;
      case CONSTANT.TOOLS.MARK:
        this.setCreatingHandler(Mark.onHandler());
        return;
      case CONSTANT.TOOLS.SEGMENTS_POINT:
        this.setCreatingHandler(
          NumberlinePoint.onHandler(this.stackResponses, this.stackResponsesSpacing),
          responsesAllowed
        );
        return;
      case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_INCLUDED:
      case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_HOLLOW:
      case CONSTANT.TOOLS.SEGMENT_LEFT_POINT_HOLLOW:
      case CONSTANT.TOOLS.SEGMENT_RIGHT_POINT_HOLLOW:
        this.setCreatingHandler(
          NumberlineSegment.onHandler(tool, this.stackResponses, this.stackResponsesSpacing),
          responsesAllowed
        );
        return;
      case CONSTANT.TOOLS.RAY_LEFT_DIRECTION:
      case CONSTANT.TOOLS.RAY_LEFT_DIRECTION_RIGHT_HOLLOW:
      case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION:
      case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION_LEFT_HOLLOW:
        this.setCreatingHandler(
          NumberlineVector.onHandler(tool, this.stackResponses, this.stackResponsesSpacing),
          responsesAllowed
        );
        return;
      case CONSTANT.TOOLS.TRASH:
        this.setCreatingHandler();
        return;
      default:
        throw new Error("Unknown tool:", tool);
    }
  }

  getToolTempPoints() {
    switch (this.currentTool) {
      case CONSTANT.TOOLS.LINE:
      case CONSTANT.TOOLS.RAY:
      case CONSTANT.TOOLS.SEGMENT:
      case CONSTANT.TOOLS.VECTOR:
        return Line.getPoints();
      case CONSTANT.TOOLS.CIRCLE:
        return Circle.getPoints();
      case CONSTANT.TOOLS.POLYGON:
        return Polygon.getPoints();
      case CONSTANT.TOOLS.SIN:
        return Sin.getPoints();
      case CONSTANT.TOOLS.PARABOLA:
        return Parabola.getPoints();
      case CONSTANT.TOOLS.ELLIPSE:
        return Ellipse.getPoints();
      case CONSTANT.TOOLS.HYPERBOLA:
        return Hyperbola.getPoints();
      case CONSTANT.TOOLS.EXPONENT:
        return Exponent.getPoints();
      case CONSTANT.TOOLS.LOGARITHM:
        return Logarithm.getPoints();
      case CONSTANT.TOOLS.POLYNOM:
        return Polynom.getPoints();
      case CONSTANT.TOOLS.TANGENT:
        return Tangent.getPoints();
      case CONSTANT.TOOLS.SECANT:
        return Secant.getPoints();
      default:
        return [];
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
   * @param {Function} handler
   */
  setCreatingHandler(handler, responsesAllowed = null) {
    this.$board.on(CONSTANT.EVENT_NAMES.UP, event => {
      if (this.dragDetector.isDragToolTempPoints(event, this.getToolTempPoints())) {
        return;
      }
      if (this.dragDetector.isDragElements(event, this.elements)) {
        this.events.emit(CONSTANT.EVENT_NAMES.CHANGE_MOVE);
        return;
      }
      if (this.currentTool === CONSTANT.TOOLS.TRASH) {
        if (this.removeObjectsUnderMouse(event)) {
          this.events.emit(CONSTANT.EVENT_NAMES.CHANGE_DELETE);
        }
      } else {
        let newElement;

        if (responsesAllowed !== null) {
          const elementsLength = this.elements.filter(
            element => element.elType === "segment" || element.elType === "point"
          ).length;
          if (elementsLength < responsesAllowed) {
            newElement = handler(this, event);
          }
        } else {
          newElement = handler(this, event);
        }

        if (newElement) {
          this.elements.push(newElement);
          this.events.emit(CONSTANT.EVENT_NAMES.CHANGE_NEW);
        }
      }
    });
  }

  handleElementsHighlighting(tool) {
    if (tool === CONSTANT.TOOLS.TRASH && !this.deleteHighlighting) {
      // red highlighting
      this.changeElementsHighlighting("red");
      this.deleteHighlighting = true;
    } else if (tool !== CONSTANT.TOOLS.TRASH && this.deleteHighlighting) {
      // usual highlighting
      this.changeElementsHighlighting("default");
      this.deleteHighlighting = false;
    }
  }

  changeElementsHighlighting(color) {
    this.elements.forEach(element => {
      switch (element.segmentType) {
        case CONSTANT.TOOLS.SEGMENTS_POINT:
          element.setAttribute({
            highlight: true,
            highlightStrokeColor: Colors[color][CONSTANT.TOOLS.POINT].highlightStrokeColor,
            highlightFillColor: Colors[color][CONSTANT.TOOLS.POINT].highlightFillColor,
            highlightFillOpacity: 1,
            highlightStrokeOpacity: 1
          });
          break;
        case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_INCLUDED:
          element.setAttribute({
            highlight: true,
            highlightStrokeColor: Colors[color][CONSTANT.TOOLS.LINE].highlightStrokeColor,
            highlightFillColor: Colors[color][CONSTANT.TOOLS.LINE].highlightFillColor,
            highlightFillOpacity: 1,
            highlightStrokeOpacity: 1
          });
          element.inherits.forEach(point => {
            point.setAttribute({
              highlight: true,
              highlightStrokeColor: Colors[color][CONSTANT.TOOLS.POINT].highlightStrokeColor,
              highlightFillColor: Colors[color][CONSTANT.TOOLS.POINT].highlightFillColor,
              highlightFillOpacity: 1,
              highlightStrokeOpacity: 1
            });
          });
          break;
        case CONSTANT.TOOLS.SEGMENT_LEFT_POINT_HOLLOW:
          element.setAttribute({
            highlight: true,
            highlightStrokeColor: Colors[color][CONSTANT.TOOLS.LINE].highlightStrokeColor,
            highlightFillColor: Colors[color][CONSTANT.TOOLS.LINE].highlightFillColor,
            highlightFillOpacity: 1,
            highlightStrokeOpacity: 1
          });
          element.inherits[0].setAttribute({
            highlight: true,
            highlightStrokeColor: Colors[color][CONSTANT.TOOLS.SEGMENTS_POINT].highlightStrokeColor,
            highlightFillColor: Colors[color][CONSTANT.TOOLS.SEGMENTS_POINT].highlightFillColor,
            highlightFillOpacity: 1,
            highlightStrokeOpacity: 1
          });
          element.inherits[1].setAttribute({
            highlight: true,
            highlightStrokeColor: Colors[color][CONSTANT.TOOLS.POINT].highlightStrokeColor,
            highlightFillColor: Colors[color][CONSTANT.TOOLS.POINT].highlightFillColor,
            highlightFillOpacity: 1,
            highlightStrokeOpacity: 1
          });
          break;
        case CONSTANT.TOOLS.SEGMENT_RIGHT_POINT_HOLLOW:
          element.setAttribute({
            highlight: true,
            highlightStrokeColor: Colors[color][CONSTANT.TOOLS.LINE].highlightStrokeColor,
            highlightFillColor: Colors[color][CONSTANT.TOOLS.LINE].highlightFillColor,
            highlightFillOpacity: 1,
            highlightStrokeOpacity: 1
          });
          element.inherits[0].setAttribute({
            highlight: true,
            highlightStrokeColor: Colors[color][CONSTANT.TOOLS.POINT].highlightStrokeColor,
            highlightFillColor: Colors[color][CONSTANT.TOOLS.POINT].highlightFillColor,
            highlightFillOpacity: 1,
            highlightStrokeOpacity: 1
          });
          element.inherits[1].setAttribute({
            highlight: true,
            highlightStrokeColor: Colors[color][CONSTANT.TOOLS.SEGMENTS_POINT].highlightStrokeColor,
            highlightFillColor: Colors[color][CONSTANT.TOOLS.SEGMENTS_POINT].highlightFillColor,
            highlightFillOpacity: 1,
            highlightStrokeOpacity: 1
          });
          break;
        case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_HOLLOW:
          element.setAttribute({
            highlight: true,
            highlightStrokeColor: Colors[color][CONSTANT.TOOLS.LINE].highlightStrokeColor,
            highlightFillColor: Colors[color][CONSTANT.TOOLS.LINE].highlightFillColor,
            highlightFillOpacity: 1,
            highlightStrokeOpacity: 1
          });
          element.inherits.forEach(point => {
            point.setAttribute({
              highlight: true,
              highlightStrokeColor: Colors[color][CONSTANT.TOOLS.SEGMENTS_POINT].highlightStrokeColor,
              highlightFillColor: Colors[color][CONSTANT.TOOLS.SEGMENTS_POINT].highlightFillColor,
              highlightFillOpacity: 1,
              highlightStrokeOpacity: 1
            });
          });
          break;
        case CONSTANT.TOOLS.RAY_LEFT_DIRECTION:
        case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION:
          element.setAttribute({
            highlight: true,
            highlightStrokeColor: Colors[color][CONSTANT.TOOLS.LINE].highlightStrokeColor,
            highlightFillColor: Colors[color][CONSTANT.TOOLS.LINE].highlightFillColor,
            highlightFillOpacity: 1,
            highlightStrokeOpacity: 1
          });
          element.inherits.forEach(point => {
            point.setAttribute({
              highlight: true,
              highlightStrokeColor: Colors[color][CONSTANT.TOOLS.POINT].highlightStrokeColor,
              highlightFillColor: Colors[color][CONSTANT.TOOLS.POINT].highlightFillColor,
              highlightFillOpacity: 1,
              highlightStrokeOpacity: 1
            });
          });
          break;
        case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION_LEFT_HOLLOW:
        case CONSTANT.TOOLS.RAY_LEFT_DIRECTION_RIGHT_HOLLOW:
          element.setAttribute({
            highlight: true,
            highlightStrokeColor: Colors[color][CONSTANT.TOOLS.LINE].highlightStrokeColor,
            highlightFillColor: Colors[color][CONSTANT.TOOLS.LINE].highlightFillColor,
            highlightFillOpacity: 1,
            highlightStrokeOpacity: 1
          });
          element.inherits.forEach(point => {
            point.setAttribute({
              highlight: true,
              highlightStrokeColor: Colors[color][CONSTANT.TOOLS.SEGMENTS_POINT].highlightStrokeColor,
              highlightFillColor: Colors[color][CONSTANT.TOOLS.SEGMENTS_POINT].highlightFillColor,
              highlightFillOpacity: 1,
              highlightStrokeOpacity: 1
            });
          });
          break;
        default:
          break;
      }
    });
  }

  updateStackSettings(stackResponses, stackResponsesSpacing, responsesAllowed) {
    if (
      this.stackResponses !== stackResponses ||
      this.responsesAllowed !== responsesAllowed ||
      this.stackResponsesSpacing !== stackResponsesSpacing
    ) {
      NumberlineTrash.cleanBoard(this);
    }

    if (stackResponses && responsesAllowed > 0 && stackResponsesSpacing > 0) {
      const newHeight = 150 + responsesAllowed * stackResponsesSpacing;
      this.resizeContainer(this.$board.canvasWidth, newHeight);
    }

    if (stackResponsesSpacing < 1 || !stackResponses) {
      this.resizeContainer(this.$board.canvasWidth, 150);
    }

    this.stackResponses = stackResponses;
    this.stackResponsesSpacing = stackResponsesSpacing;
    this.responsesAllowed = responsesAllowed;
  }

  // Set calculated bounding box (xMin - margin and xMax + margin), render numberline axis
  makeNumberlineAxis(graphParameters, settings, layout, graphType, lineSettings, containerSettings) {
    Object.values(this.$board.defaultAxes).forEach(axis => this.$board.removeObject(axis));
    const xMargin = graphParameters.margin / calcUnitX(graphParameters.xMin, graphParameters.xMax, layout.width);

    this.$board.setBoundingBox(numberlineGraphParametersToBoundingbox(graphParameters, xMargin));
    this.numberlineAxis = Numberline.onHandler(
      this,
      graphParameters.xMin,
      graphParameters.xMax,
      settings,
      lineSettings
    );

    if (graphType === "axisLabels") {
      Mark.updateMarksContainer(
        this,
        graphParameters.xMin - xMargin,
        graphParameters.xMax + xMargin,
        containerSettings
      );
    }
  }

  // Update bounding box, marks container, rerender numberline axis, update mark's snap handler
  updateGraphParameters(graphParameters, settings, layout, graphType, setValue, lineSettings, containerSettings) {
    graphParameters.margin = Math.min(graphParameters.margin, layout.width);
    const xMargin = graphParameters.margin / calcUnitX(graphParameters.xMin, graphParameters.xMax, layout.width);
    this.$board.setBoundingBox(numberlineGraphParametersToBoundingbox(graphParameters, xMargin));

    Numberline.updateCoords(this, graphParameters.xMin, graphParameters.xMax, settings, lineSettings);

    if (graphType === "axisLabels") {
      Mark.updateMarksContainer(
        this,
        graphParameters.xMin - xMargin,
        graphParameters.xMax + xMargin,
        containerSettings
      );

      const marks = this.elements.filter(element => element.elType === "group");
      this.elements = this.elements.filter(element => element.elType !== "group");
      marks.forEach(mark => Mark.removeMark(this, mark));
      marks.forEach(mark =>
        Mark.rerenderMark(mark, this, graphParameters, settings, setValue, lineSettings, containerSettings)
      );
    }

    if (graphType === "axisSegments") {
      const points = this.elements.filter(element => element.elType === "point");
      this.elements = this.elements.filter(element => element.elType !== "point");

      points.forEach(p => this.removeObject(p));
      points.forEach(p => {
        const newPoint = NumberlinePoint.onHandler(this.stackResponses, this.stackResponsesSpacing)(this, p.X());
        this.elements.push(newPoint);
      });
    }

    this.$board.fullUpdate();
  }

  // Update numberline axis settings (such as ticks visibility, font size and etc.)
  updateGraphSettings(settings, graphType) {
    updateNumberline(this.numberlineAxis, settings);

    if (graphType === "axisLabels") {
      const marks = this.elements.filter(element => element.elType === "group");
      marks.forEach(mark => Mark.updateTextSize(mark, settings.fontSize));
    }

    this.$board.fullUpdate();
  }

  // Render marks
  renderMarks(marks, xCoords, settings, setValue, lineSettings, containerSettings, markCoords) {
    marks.forEach(mark => {
      const markCoord = markCoords.find(el => el.id === mark.id);
      this.elements.push(
        Mark.onHandler(
          this,
          markCoord ? [markCoord.position, markCoord.y] : checkMarksRenderSpace(this, settings, containerSettings),
          mark,
          calcMeasure(51.5, 45, this),
          xCoords,
          settings.snapToTicks,
          setValue,
          lineSettings,
          containerSettings
        )
      );
    });
  }

  removeMarks() {
    const marks = this.elements.filter(element => element.elType === "group");
    this.elements = this.elements.filter(element => element.elType !== "group");
    marks.forEach(mark => Mark.removeMark(this, mark));
  }

  removeMarksAnswers() {
    const marks = this.answers.filter(element => element.elType === "group");
    this.answers = this.answers.filter(element => element.elType !== "group");
    marks.forEach(mark => Mark.removeMark(this, mark));
  }

  // Marks shuffled or text edited
  updateMarks(marks, oldMarks, containerSettings) {
    Mark.checkForUpdate(
      marks,
      this.elements.filter(element => element.elType === "group"),
      this,
      oldMarks,
      containerSettings
    );
  }

  // Size of marks array have changed
  marksSizeChanged(marks, xCoords, settings, setValue, lineSettings, containerSettings) {
    const filteredElements = this.elements.filter(element => element.elType === "group");

    if (marks.length < filteredElements.length) {
      this.removeMark(marks, filteredElements);
    } else {
      this.addMark(marks, filteredElements, xCoords, setValue, lineSettings, containerSettings, settings);
    }
  }

  // Add new mark
  addMark(marks, elements, xCoords, setValue, lineSettings, containerSettings, settings) {
    const newMark = findElementsDiff(marks, elements);
    this.elements.push(
      Mark.onHandler(
        this,
        checkMarksRenderSpace(this, settings, containerSettings),
        newMark,
        calcMeasure(51.5, 45, this),
        xCoords,
        settings.snapToTicks,
        setValue,
        lineSettings,
        containerSettings
      )
    );
    this.$board.fullUpdate();
  }

  // Remove mark
  removeMark(marks, elements) {
    const removedMark = findElementsDiff(elements, marks);
    this.elements = this.elements.filter(element => element.elType !== "group" || element.id !== removedMark.id);
    Mark.removeMark(this, removedMark);
    this.$board.fullUpdate();
  }

  renderTitle(title) {
    this.elements.push(Title.renderTitle(this, title));
    this.$board.fullUpdate();
  }

  updateTitle(title) {
    Title.updateTitle(this, title);
    this.$board.fullUpdate();
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
    NumberlineTrash.cleanBoard(this);
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
    const elementsUnderMouse = this.$board.getAllObjectsUnderMouse(event);
    const elementsToDelete = this.elements.filter(el => elementsUnderMouse.findIndex(eum => eum.id === el.id) > -1);

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
    if (typeof obj === "string") {
      this.$board.removeObject(obj);
    } else if (obj.elType !== "point") {
      obj.getParents().map(this.removeObject.bind(this));
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
    const config = this.elements.map(e => {
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
        case JXG.OBJECT_TYPE_TEXT:
          return Mark.getConfig(e);
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
        default:
          throw new Error("Unknown element type:", e.name, e.type);
      }
    });
    return Object.values(flatConfig(config));
  }

  getMarks() {
    return this.elements.filter(element => element.elType === "group").map(group => Mark.getConfig(group));
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

  loadMarksAnswers(marks, xCoords, settings, setValue, lineSettings, containerSettings) {
    if (marks) {
      this.elements.push(
        ...marks.map(config =>
          Mark.renderMarkAnswer(
            this,
            config,
            calcMeasure(51.5, 45, this),
            xCoords,
            settings.snapToTicks,
            setValue,
            lineSettings,
            containerSettings
          )
        )
      );
    }
  }

  loadMarksShowAnswers(marks) {
    if (marks) {
      this.answers.push(marks.map(config => Mark.renderMarkShowAnswer(this, config, calcMeasure(51.5, 45, this))));
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

  loadFromConfig(flatCfg) {
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
        QuillInput(newElement, this).setLabel(el.label);
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

  loadMarks(elements) {
    this.elements.push(...elements.map(() => Mark.loadMarks()));
  }

  loadSegments(elements) {
    this.elements.push(
      ...elements.map(element => {
        switch (element.type) {
          case CONSTANT.TOOLS.SEGMENTS_POINT:
            return NumberlinePoint.loadPoint(this, element, this.stackResponses);
          case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_INCLUDED:
            return NumberlineSegment.loadSegment(
              this,
              element,
              true,
              true,
              CONSTANT.TOOLS.SEGMENT_BOTH_POINT_INCLUDED,
              this.stackResponses
            );
          case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_HOLLOW:
            return NumberlineSegment.loadSegment(
              this,
              element,
              false,
              false,
              CONSTANT.TOOLS.SEGMENT_BOTH_POINT_HOLLOW,
              this.stackResponses
            );
          case CONSTANT.TOOLS.SEGMENT_LEFT_POINT_HOLLOW:
            return NumberlineSegment.loadSegment(
              this,
              element,
              false,
              true,
              CONSTANT.TOOLS.SEGMENT_LEFT_POINT_HOLLOW,
              this.stackResponses
            );
          case CONSTANT.TOOLS.SEGMENT_RIGHT_POINT_HOLLOW:
            return NumberlineSegment.loadSegment(
              this,
              element,
              true,
              false,
              CONSTANT.TOOLS.SEGMENT_RIGHT_POINT_HOLLOW,
              this.stackResponses
            );
          case CONSTANT.TOOLS.RAY_LEFT_DIRECTION:
            return NumberlineVector.loadVector(
              this,
              element,
              true,
              false,
              CONSTANT.TOOLS.RAY_LEFT_DIRECTION,
              this.stackResponses
            );
          case CONSTANT.TOOLS.RAY_LEFT_DIRECTION_RIGHT_HOLLOW:
            return NumberlineVector.loadVector(
              this,
              element,
              false,
              false,
              CONSTANT.TOOLS.RAY_LEFT_DIRECTION_RIGHT_HOLLOW,
              this.stackResponses
            );
          case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION:
            return NumberlineVector.loadVector(
              this,
              element,
              true,
              true,
              CONSTANT.TOOLS.RAY_RIGHT_DIRECTION,
              this.stackResponses
            );
          case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION_LEFT_HOLLOW:
            return NumberlineVector.loadVector(
              this,
              element,
              false,
              true,
              CONSTANT.TOOLS.RAY_RIGHT_DIRECTION_LEFT_HOLLOW,
              this.stackResponses
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
                return this.createElement(name, points, {
                  ...props,
                  ...attrs,
                  visible: true
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
                      objectCreator: attributes => this.createPointFromConfig(el.points[0], attributes)
                    }),
                    mixProps({
                      el: el.points[1],
                      objectCreator: attributes => this.createPointFromConfig(el.points[1], attributes)
                    })
                  ],
                  {
                    ...Line.parseConfig(el.type),
                    ...attrs
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
                      objectCreator: attributes => this.createPointFromConfig(el.points[0], attributes)
                    }),
                    mixProps({
                      el: el.points[1],
                      objectCreator: attributes => this.createPointFromConfig(el.points[1], attributes)
                    })
                  ],
                  {
                    ...Circle.parseConfig(),
                    ...attrs
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
                    ...attrs
                  }
                );

                handleSnap(newLine, Object.values(newLine.ancestors));
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
                      objectCreator: attributes => this.createPointFromConfig(pointEl, attributes)
                    })
                  ),
                  {
                    ...Polygon.parseConfig(),
                    ...attrs
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
                    ...attrs
                  }
                );

                newLine.type = 90;
                handleSnap(newLine, Object.values(newLine.ancestors));

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
                  ...attrs
                });
                newElem.ancestors = {
                  [points[0].id]: points[0],
                  [points[1].id]: points[1]
                };
                newElem.type = 91;
                newElem.addParents(points);
                handleSnap(newElem, Object.values(newElem.ancestors));
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
                  ...attrs
                });
                newElem.ancestors = {
                  [points[0].id]: points[0],
                  [points[1].id]: points[1]
                };
                newElem.type = 92;
                newElem.addParents(points);
                handleSnap(newElem, Object.values(newElem.ancestors));
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
                  ...attrs
                });
                newElem.ancestors = {
                  [points[0].id]: points[0],
                  [points[1].id]: points[1]
                };
                newElem.type = 93;
                newElem.addParents(points);
                handleSnap(newElem, Object.values(newElem.ancestors));
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
                  ...attrs
                });
                newElem.ancestors = {
                  [points[0].id]: points[0],
                  [points[1].id]: points[1]
                };
                newElem.type = 94;
                newElem.addParents(points);
                handleSnap(newElem, Object.values(newElem.ancestors));
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
                  ...attrs,
                  ...props
                });
                newElem.type = 95;
                newElem.addParents(points);
                newElem.ancestors = Polynom.flatConfigPoints(points);
                handleSnap(newElem, Object.values(newElem.ancestors));
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
                  ...attrs
                });
                newElem.ancestors = {
                  [points[0].id]: points[0],
                  [points[1].id]: points[1]
                };
                newElem.type = 96;
                newElem.addParents(points);
                handleSnap(newElem, Object.values(newElem.ancestors));
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
                  ...attrs
                });
              }
            })
          );
          break;
        case JXG.OBJECT_TYPE_TEXT:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => {
                const [name, points, props] = Mark.parseConfig(el, this.getParameters(CONSTANT.TOOLS.MARK));
                return this.createElement(name, points, { ...props, ...attrs });
              }
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

                handleSnap(newLine, Object.values(newLine.ancestors));
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
                handleSnap(newLine, Object.values(newLine.ancestors));

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
                handleSnap(newElem, Object.values(newElem.ancestors));
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
                handleSnap(newElem, Object.values(newElem.ancestors));
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
                handleSnap(newElem, Object.values(newElem.ancestors));
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
                handleSnap(newElem, Object.values(newElem.ancestors));
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
                handleSnap(newElem, Object.values(newElem.ancestors));
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
                handleSnap(newElem, Object.values(newElem.ancestors));
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
        case JXG.OBJECT_TYPE_TEXT:
          objects.push(
            mixProps({
              el,
              objectCreator: attrs => {
                const [name, points, props] = Mark.parseConfig(el, this.getParameters(CONSTANT.TOOLS.MARK));
                return this.createElement(name, points, { ...props, ...attrs, fixed: true });
              }
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

export function makeBorder(id, config) {
  return new Board(id, config);
}

export default Board;
