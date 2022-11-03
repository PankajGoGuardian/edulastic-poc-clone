import JXG from 'jsxgraph'
import { Modal } from 'antd'
import { isNumber, cloneDeep, last } from 'lodash'
import { greyThemeDark2 } from '@edulastic/colors'
import * as Sentry from '@sentry/browser'
import i18n from '@edulastic/localization'
import getDefaultConfig, { CONSTANT } from './config'
import {
  Area,
  Area2,
  Circle,
  DragDrop,
  DrawingObject,
  Ellipse,
  Equation,
  Exponent,
  Exponent2,
  Hyperbola,
  Line,
  Logarithm,
  Mark,
  Numberline,
  NumberlinePoint,
  NumberlineSegment,
  NumberlineVector,
  Parabola,
  Parabola2,
  Point,
  Polygon,
  Polynom,
  Secant,
  Sin,
  Cos,
  Tangent,
  Title,
  Dashed,
  NumberLineDotPlotPoint,
  Connectline,
  PiecewiseLine,
  LineCut,
  PiecewisePoint,
  Grid,
  Rose,
  Cardioid,
} from './elements'
import {
  fillConfigDefaultParameters,
  graphParameters2Boundingbox,
  mergeParams,
  numberlineGraphParametersToBoundingbox,
} from './settings'
import {
  calcUnitX,
  flat2nestedConfig,
  flatConfig,
  getClosestTick,
  getImageCoordsByPercent,
  updateAxe,
  updateGrid,
  updatePointParameters,
  canAddElementToBoard,
  getEventName,
  isTouchDevice,
  getAllObjectsUnderMouse,
  getLabel,
  getEquationFromApiLatex,
} from './utils'
import _events from './events'

import 'jsxgraph/distrib/jsxgraph.css'
import '../common/Label.css'
import '../common/Mark.css'
import '../common/EditButton.css'
import '../common/DragDrop.css'

/**
 * @see https://jsxgraph.org/docs/symbols/JXG.JSXGraph.html#.initBoard
 */
class Board {
  constructor(id, graphType, config = {}) {
    this.graphType = graphType
    /**
     * Elements on the board
     */
    this.elements = []

    this.labelForEq = []
    /**
     * Bg elements on the board
     */
    this.bgElements = []
    /**
     * Static unitX
     */
    this.staticUnitX = null
    /**
     *  Polar grids or Complex
     */
    this.grids = []
    /**
     * Answers
     */
    this.answers = []
    /**
     * Bg image
     */
    this.bgImage = null

    this.numberlineAxis = null

    this.numberlineTitle = null

    this.editButton = null

    this.stacksUnderMouse = true

    this.creatingHandlerIsDisabled = false

    this.numberlineSnapToTicks = true
    /**
     * Board settings
     */
    this.parameters = fillConfigDefaultParameters(config)
    /**
     * Current tool
     */
    this.currentTool = null

    this.numberlineSettings = null

    this.stackResponses = false

    this.disableResponse = false

    this.stackResponsesSpacing = 30

    this.responsesAllowed = null

    this.events = _events()

    this.dragged = false

    this.drawingObject = null

    this.priorityColor = null

    this.$board = JXG.JSXGraph.initBoard(
      id,
      mergeParams(cloneDeep(getDefaultConfig()), this.parameters)
    )
    this.$board.setZoom(1, 1)

    this.creatingHandler = () => {}
    this.setCreatingHandler()

    this.inequalities = []

    this.pointOnEquEnabled = false

    this.switchGrid = Grid.switchGrid.bind(this)
  }

  addDragDropValue(value, x, y, dimensions) {
    const coords = canAddElementToBoard(this, x, y)
    DragDrop.removePointForDrag(this)
    if (!coords) {
      return
    }

    const element = {
      ...value,
      dimensions,
      x: coords.usrCoords[1],
      y: coords.usrCoords[2],
    }

    this.elements.push(DragDrop.create(this, element, {}))
    return true
  }

  addMark(value, x, y) {
    const coords = new JXG.Coords(JXG.COORDS_BY_SCREEN, [x, y], this.$board)
    const [xMin, yMax, xMax, yMin] = this.$board.getBoundingBox()
    if (
      coords.usrCoords[1] < xMin ||
      coords.usrCoords[1] > xMax ||
      coords.usrCoords[2] < yMin ||
      coords.usrCoords[2] > yMax
    ) {
      return false
    }

    let position = coords.usrCoords[1]
    if (this.numberlineSnapToTicks) {
      position = getClosestTick(coords.usrCoords[1], this.numberlineAxis)
    }

    const mark = {
      id: value.id,
      point: value.text,
      position,
    }

    this.elements.push(Mark.onHandler(this, mark))
    return true
  }

  drawDragDropValue(value, x, y) {
    const coords = canAddElementToBoard(this, x, y)
    if (coords.usrCoords) {
      const element = {
        ...value,
        x: coords.usrCoords[1],
        y: coords.usrCoords[2],
      }
      return DragDrop.movePointForDrag(this, element)
    }
  }

  setDrawingObject(drawingObject) {
    this.drawingObject = drawingObject
    if (this.drawingObject) {
      this.currentTool = null
      this.creatingHandler = DrawingObject.onHandler
    }
  }

  /**
   * Assign element handler by const
   * Constants/Tools
   * @param {string} tool
   */
  setTool(tool) {
    if (this.graphType === 'axisLabels') {
      return
    }
    if (this.currentTool !== tool) {
      if (this.graphType !== 'axisSegments') {
        this.abortTool()
      }
    }
    this.currentTool = tool
    switch (tool) {
      case CONSTANT.TOOLS.POINT:
        this.creatingHandler = Point.onHandler
        return
      case CONSTANT.TOOLS.LINE:
      case CONSTANT.TOOLS.RAY:
      case CONSTANT.TOOLS.SEGMENT:
      case CONSTANT.TOOLS.VECTOR:
        this.creatingHandler = Line.onHandler(tool)
        return
      case CONSTANT.TOOLS.CIRCLE:
        this.creatingHandler = Circle.onHandler()
        return
      case CONSTANT.TOOLS.SIN:
        this.creatingHandler = Sin.onHandler()
        return
      case CONSTANT.TOOLS.COS:
        this.creatingHandler = Cos.onHandler()
        return
      case CONSTANT.TOOLS.POLYGON:
        this.creatingHandler = Polygon.onHandler()
        return
      case CONSTANT.TOOLS.PARABOLA:
        this.creatingHandler = Parabola.onHandler()
        return
      case CONSTANT.TOOLS.PARABOLA2:
        this.creatingHandler = Parabola2.onHandler()
        return
      case CONSTANT.TOOLS.HYPERBOLA:
        this.creatingHandler = Hyperbola.onHandler()
        return
      case CONSTANT.TOOLS.ELLIPSE:
        this.creatingHandler = Ellipse.onHandler()
        return
      case CONSTANT.TOOLS.TANGENT:
        this.creatingHandler = Tangent.onHandler()
        break
      case CONSTANT.TOOLS.SECANT:
        this.creatingHandler = Secant.onHandler()
        break
      case CONSTANT.TOOLS.EXPONENT:
        this.creatingHandler = Exponent.onHandler()
        break
      case CONSTANT.TOOLS.EXPONENTIAL2:
        this.creatingHandler = Exponent2.onHandler()
        break
      case CONSTANT.TOOLS.LOGARITHM:
        this.creatingHandler = Logarithm.onHandler()
        break
      case CONSTANT.TOOLS.POLYNOM:
        this.creatingHandler = Polynom.onHandler()
        break
      case CONSTANT.TOOLS.AREA:
        this.creatingHandler = Area.onHandler()
        return
      case CONSTANT.TOOLS.AREA2:
        this.creatingHandler = Area2.onHandler()
        return
      case CONSTANT.TOOLS.DASHED:
        this.creatingHandler = Dashed.onHandler()
        return
      case CONSTANT.TOOLS.PIECEWISE_LINE:
        this.creatingHandler = PiecewiseLine.onHandler()
        return
      case CONSTANT.TOOLS.PIECEWISE_POINT:
        this.creatingHandler = PiecewisePoint.onHandler()
        return
      case CONSTANT.TOOLS.LINE_CUT:
        this.creatingHandler = LineCut.onHandler()
        return
      case CONSTANT.TOOLS.SEGMENTS_POINT:
        this.creatingHandler = NumberlinePoint.onHandler
        return
      case CONSTANT.TOOLS.NUMBERLINE_PLOT_POINT:
        this.creatingHandler = NumberLineDotPlotPoint.onHandler
        return
      case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_INCLUDED:
      case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_HOLLOW:
      case CONSTANT.TOOLS.SEGMENT_LEFT_POINT_HOLLOW:
      case CONSTANT.TOOLS.SEGMENT_RIGHT_POINT_HOLLOW:
        this.creatingHandler = NumberlineSegment.onHandler
        return
      case CONSTANT.TOOLS.RAY_LEFT_DIRECTION:
      case CONSTANT.TOOLS.RAY_LEFT_DIRECTION_RIGHT_HOLLOW:
      case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION:
      case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION_LEFT_HOLLOW:
        this.creatingHandler = NumberlineVector.onHandler
        return
      case CONSTANT.TOOLS.ROSE:
        this.creatingHandler = Rose.onHandler
        return
      case CONSTANT.TOOLS.CARDIOID:
        this.creatingHandler = Cardioid.onHandler
        return
      case CONSTANT.TOOLS.EDIT_LABEL:
      case CONSTANT.TOOLS.TRASH:
      case CONSTANT.TOOLS.DELETE:
        this.creatingHandler = () => {}
        return
      default:
        if (!tool) {
          console.warn('No tool present', tool)
          Sentry.captureException(new Error('noToolException'))
        } else {
          console.warn('unknown tool', tool)
          Sentry.captureException(new Error('unknownToolException'))
        }
    }
  }

  abortTool() {
    switch (this.currentTool) {
      case CONSTANT.TOOLS.POINT:
        return false
      case CONSTANT.TOOLS.LINE:
      case CONSTANT.TOOLS.RAY:
      case CONSTANT.TOOLS.SEGMENT:
      case CONSTANT.TOOLS.VECTOR:
        return Line.clean(this)
      case CONSTANT.TOOLS.CIRCLE:
        return Circle.clean(this)
      case CONSTANT.TOOLS.POLYGON:
        return Polygon.clean(this)
      case CONSTANT.TOOLS.SIN:
        return Sin.clean(this)
      case CONSTANT.TOOLS.COS:
        return Cos.clean(this)
      case CONSTANT.TOOLS.PARABOLA:
        return Parabola.clean(this)
      case CONSTANT.TOOLS.PARABOLA2:
        return Parabola2.clean(this)
      case CONSTANT.TOOLS.ELLIPSE:
        return Ellipse.clean(this)
      case CONSTANT.TOOLS.HYPERBOLA:
        return Hyperbola.clean(this)
      case CONSTANT.TOOLS.EXPONENT:
        return Exponent.clean(this)
      case CONSTANT.TOOLS.LOGARITHM:
        return Logarithm.clean(this)
      case CONSTANT.TOOLS.POLYNOM:
        return Polynom.clean(this)
      case CONSTANT.TOOLS.TANGENT:
        return Tangent.clean(this)
      case CONSTANT.TOOLS.SECANT:
        return Secant.clean(this)
      case CONSTANT.TOOLS.PIECEWISE_LINE:
        return PiecewiseLine.clean(this)
      default:
        return false
    }
  }

  // eslint-disable-next-line
  getTempPoints() {
    return [
      ...Line.getTempPoints(),
      ...Circle.getTempPoints(),
      ...Polygon.getTempPoints(),
      ...Sin.getTempPoints(),
      ...Cos.getTempPoints(),
      ...Parabola.getTempPoints(),
      ...Parabola2.getTempPoints(),
      ...Ellipse.getTempPoints(),
      ...Hyperbola.getTempPoints(),
      ...Exponent.getTempPoints(),
      ...Logarithm.getTempPoints(),
      ...Polynom.getTempPoints(),
      ...Tangent.getTempPoints(),
      ...Secant.getTempPoints(),
      ...PiecewiseLine.getTempPoints(),
    ]
  }

  /**
   * Add event 'Up'
   */
  setCreatingHandler() {
    this.$board.on(getEventName('up'), (event) => {
      if (this.disableResponse) {
        return
      }

      if (this.pointOnEquEnabled) {
        Modal.confirm({
          title: 'Warning',
          content:
            'You cannot add additional objects if you select the points on the equation feature.',
          centered: true,
          okText: 'Confirm',
          okCancel: false,
          maskClosable: true,
        })
        return
      }

      if (this.creatingHandlerIsDisabled) {
        return
      }

      if (this.dragged) {
        this.dragged = false
        return
      }

      if (
        (this.elements || []).some(
          (element) => element.type === Equation.jxgType
        )
      ) {
        Modal.confirm({
          title: 'Warning',
          content: i18n.t(
            'assessment:component.graphing.helperText.polarWithArea'
          ),
          okText: 'Confirm',
          okCancel: false,
          maskClosable: true,
        })
        return
      }

      if (
        (this.elements || []).some(
          (element) =>
            element.type === Rose.jxgType || element.type === Cardioid.jxgType
        ) &&
        this.currentTool === CONSTANT.TOOLS.AREA
      ) {
        Modal.confirm({
          title: 'Warning',
          content: i18n.t(
            'assessment:component.graphing.helperText.polarWithArea'
          ),
          okText: 'Confirm',
          okCancel: false,
          maskClosable: true,
        })
        return
      }

      if (
        (this.elements || []).some(
          (element) => element.type === Area.jxgType
        ) &&
        (this.currentTool === CONSTANT.TOOLS.ROSE ||
          this.currentTool === CONSTANT.TOOLS.CARDIOID)
      ) {
        Modal.confirm({
          title: 'Warning',
          content: i18n.t(
            'assessment:component.graphing.helperText.polarWithArea'
          ),
          okText: 'Confirm',
          okCancel: false,
          maskClosable: true,
        })
        return
      }

      if (
        this.currentTool === CONSTANT.TOOLS.TRASH ||
        this.currentTool === CONSTANT.TOOLS.DELETE
      ) {
        if (this.removeObjectsUnderMouse(event)) {
          this.removeInequalities()
          Area.updateShadingsForAreaPoints(this, this.elements)
          Area2.updateShadingsForAreaPoints(this, this.elements)
          this.events.emit(CONSTANT.EVENT_NAMES.CHANGE_DELETE)
        }
        return
      }

      if (this.currentTool === CONSTANT.TOOLS.EDIT_LABEL) {
        this.editObjUnderMouse(event)
        return
      }

      if (
        this.responsesAllowed !== null &&
        this.elements.length >= this.responsesAllowed
      ) {
        return
      }
      const newElement = this.creatingHandler(this, event, null, this.elements)
      if (newElement) {
        this.elements.push(newElement)
        Area.updateShadingsForAreaPoints(this, this.elements)
        Area2.updateShadingsForAreaPoints(this, this.elements)
        this.events.emit(CONSTANT.EVENT_NAMES.CHANGE_NEW)
      }
    })
  }

  setPriorityColor(color) {
    this.priorityColor = color
  }

  setDisableResponse(value) {
    this.disableResponse = value
  }

  // TODO: remove commented lines after QA
  // eslint-disable-next-line
  createEditButton(menuHandler) {
    // this.editButton = EditButton.createButton(this, menuHandler)
    // this.editButton.disabled = false
  }

  // eslint-disable-next-line
  setEditButtonStatus(disabled) {
    // this.editButton.disabled = disabled
  }

  // eslint-disable-next-line
  checkEditButtonCall(element) {
    // return (
    //   this.elements.some((elem) => elem.id === element.id) ||
    //   this.elements.some(
    //     (elem) =>
    //       elem.ancestors &&
    //       Object.values(elem.ancestors).some(
    //         (ancestor) => ancestor.id === element.id
    //       )
    //   )
    // )
  }

  // eslint-disable-next-line
  handleElementMouseOver(element, event) {
    // if (this.editButton.disabled || isTouchDevice()) {
    //   return
    // }
    // if (this.checkEditButtonCall(element)) {
    //   let coords
    //   if (JXG.isPoint(element)) {
    //     coords = element.coords
    //   } else {
    //     coords = this.getCoords(event)
    //   }
    //   EditButton.moveButton(this, coords, element)
    // }
  }

  // eslint-disable-next-line
  handleElementMouseOut(element) {
    // if (!this.editButton.disabled) {
    //   if (this.checkEditButtonCall(element)) {
    //     EditButton.hideButton(this, element)
    //   }
    // }
  }

  // eslint-disable-next-line
  handleStackedElementsMouseEvents(element) {
    // if (this.editButton) {
    //   element.on('mouseover', (event) => {
    //     if (this.editButton.disabled) {
    //       return
    //     }
    //     if (this.checkEditButtonCall(element)) {
    //       const pointsUnderMouse = getAllObjectsUnderMouse(this, event).filter(
    //         (mouseElement) => mouseElement.elType === 'point'
    //       )
    //       if (pointsUnderMouse.length === 0) {
    //         this.stacksUnderMouse = false
    //         this.handleElementMouseOver(element, event)
    //       } else {
    //         this.stacksUnderMouse = true
    //       }
    //     }
    //   })
    //   element.on('mouseout', () => {
    //     if (!this.stacksUnderMouse && this.checkEditButtonCall(element)) {
    //       this.handleElementMouseOut(element)
    //     }
    //   })
    //   element.on('drag', () => {
    //     if (this.checkEditButtonCall(element)) {
    //       EditButton.cleanButton(this, element)
    //     }
    //   })
    // }
  }

  updateNumberlineSettings(canvas, numberlineAxis, layout) {
    this.numberlineSettings = {
      canvas,
      numberlineAxis,
      layout,
    }

    Object.values(this.$board.defaultAxes).forEach((axis) =>
      this.$board.removeObject(axis)
    )

    if (this.graphType === 'axisLabels') {
      this.resizeContainer(layout.width, layout.height)
    } else {
      this.updateStackSettings(
        numberlineAxis.stackResponses,
        numberlineAxis.stackResponsesSpacing,
        canvas.responsesAllowed,
        layout.width,
        layout.height
      )
    }

    this.setNumberlineSnapToTicks(numberlineAxis.snapToTicks)

    const margin = Math.min(canvas.margin, layout.width)
    const xMargin = margin / calcUnitX(canvas.xMin, canvas.xMax, layout.width)
    const yMargin = layout.orientation === 'vertical' ? 1 : 0
    this.$board.setBoundingBox(
      numberlineGraphParametersToBoundingbox(canvas, xMargin, yMargin)
    )

    Numberline.updateCoords(this)

    this.updateTitle({
      position: layout.titlePosition,
      title: canvas.title,
      xMin: canvas.xMin,
      xMax: canvas.xMax,
      yMax: canvas.yMax,
      yMin: canvas.yMin,
    })

    this.$board.fullUpdate()
  }

  updateStackSettings(
    stackResponses,
    stackResponsesSpacing,
    responsesAllowed,
    width,
    height = 150
  ) {
    if (stackResponses && responsesAllowed > 0 && stackResponsesSpacing > 0) {
      const newHeight = Math.max(
        height,
        75 + (responsesAllowed + 1) * stackResponsesSpacing
      )
      this.resizeContainer(width, newHeight)
    }

    if (stackResponsesSpacing < 1 || !stackResponses) {
      this.resizeContainer(width, height)
    }

    this.stackResponses = stackResponses
    this.stackResponsesSpacing = stackResponsesSpacing
    this.responsesAllowed = responsesAllowed
  }

  setNumberlineSnapToTicks(snapToTicks) {
    this.numberlineSnapToTicks = !!snapToTicks
  }

  setMarksDeleteHandler() {
    this.$board.on('up', (event) => {
      const mark = this.elements.find(
        (element) => `mark-delete-${element.id}` === event.target.id
      )
      if (!mark) {
        return
      }

      this.elements = this.elements.filter((element) => element.id !== mark.id)
      this.removeObject(mark)
      this.events.emit(CONSTANT.EVENT_NAMES.CHANGE_DELETE)
    })
  }

  setDragDropDeleteHandler() {
    this.$board.on('up', (event) => {
      const dragDrop = this.elements.find(
        (element) => `drag-drop-delete-${element.id}` === event.target.id
      )
      if (!dragDrop) {
        return
      }

      this.elements = this.elements.filter(
        (element) => element.id !== dragDrop.id
      )
      this.removeObject(dragDrop)
      this.events.emit(CONSTANT.EVENT_NAMES.CHANGE_DELETE)
    })
  }

  // Render marks
  renderMarks(marks = []) {
    marks.forEach((mark) => {
      this.elements.push(Mark.onHandler(this, mark))
    })
  }

  removeMarks() {
    this.elements.forEach((mark) => this.removeObject(mark))
    this.elements = []
  }

  removeMarksAnswers() {
    this.answers.forEach((mark) => this.removeObject(mark))
    this.answers = []
  }

  renderTitle(title) {
    this.numberlineTitle = Title.renderTitle(this, title)
    this.$board.fullUpdate()
  }

  updateTitle(title) {
    this.$board.removeObject(this.numberlineTitle)
    this.renderTitle(title)
  }

  getCoords(e) {
    const pos = !isTouchDevice()
      ? this.$board.getMousePosition(e)
      : this.$board.getMousePosition(e, 0)

    return new JXG.Coords(JXG.COORDS_BY_SCREEN, [pos[0], pos[1]], this.$board)
  }

  /**
   *
   *@see https://jsxgraph.org/docs/symbols/JXG.Board.html#create
   */
  createElement(...newElement) {
    return this.$board.create(...newElement)
  }

  /**
   * @see https://jsxgraph.org/docs/symbols/JXG.Board.html#removeObject
   */
  segmentsReset() {
    this.elements.map(this.removeObject.bind(this))
    this.elements = []
  }

  cleanToolTempPoints() {
    return this.abortTool()
  }

  reset() {
    this.abortTool()
    this.elements.map(this.removeObject.bind(this))
    this.elements = []
    this.labelForEq = []
    this.removeInequalities()
    this.bgElements.forEach((el) => {
      if (el.type == 12) {
        this.labelForEq.push(el.labelHTML)
      } else {
        el.inherits.forEach((ancestorsEl) => {
          this.labelForEq.push(ancestorsEl.labelHTML)
        })
      }
    })
  }

  resetAnswers() {
    this.removeInequalities()
    this.answers.map(this.removeObject.bind(this))
    this.answers = []
  }

  resetBg() {
    this.bgElements.map(this.removeObject.bind(this))
    this.bgElements = []
  }

  editObjUnderMouse(event) {
    const elementsUnderMouse = getAllObjectsUnderMouse(this, event)
    const elementsToEdit = this.elements
      .map((el) => {
        if (el.ancestors) {
          return [el].concat(Object.values(el.ancestors))
        }
        return [el]
      })
      .flat()
      .filter(
        (el) => elementsUnderMouse.findIndex((eum) => eum.id === el.id) > -1
      )

    if (last(elementsToEdit)) {
      this.events.emit(
        CONSTANT.EVENT_NAMES.CHANGE_LABEL,
        last(elementsToEdit).id
      )
    }
  }

  removeObjectsUnderMouse(event) {
    const elementsUnderMouse = getAllObjectsUnderMouse(this, event)
    if (this.graphType === 'numberLinePlot') {
      return NumberLineDotPlotPoint.removeElementUnderMouse(
        this,
        elementsUnderMouse
      )
    }
    const elementsToDelete = this.elements.filter(
      (el) => elementsUnderMouse.findIndex((eum) => eum.id === el.id) > -1
    )

    if (elementsToDelete.length === 0) {
      return false
    }

    this.elements = this.elements.filter(
      (el) => elementsToDelete.findIndex((etd) => etd.id === el.id) === -1
    )
    elementsToDelete.forEach((el) => {
      this.removeObject(el)
    })

    return true
  }

  removeObject(obj) {
    if (!obj || isNumber(obj)) {
      return
    }

    if (Array.isArray(obj)) {
      obj.forEach((el) => {
        if (isNumber(obj)) return
        this.$board.removeObject(el)
      })
      return
    }

    if (obj.type === Equation.jxgType) {
      ;(obj.areas || []).forEach((el) => {
        this.$board.removeObject(el)
      })
    }

    if (obj.rendNodeTriangleEnd) obj.rendNodeTriangleEnd.remove()
    if (obj.rendNodeTriangleStart) obj.rendNodeTriangleStart.remove()
    if (obj.type === Area.jxgType) {
      ;(obj.shadingAreaLines || []).forEach((el) => {
        this.$board.removeObject(el)
      })
    }
    if (obj.getParents && obj.elType !== 'point' && obj.elType !== 'text') {
      obj.getParents().forEach((el) => {
        this.removeObject(el)
      })
    }
    this.$board.removeObject(obj)
  }

  /**
   * @see https://jsxgraph.org/docs/symbols/src/src_base_constants.js.html
   */
  getConfig() {
    this.abortTool()

    const config = this.elements
      .filter((e) => e)
      .map((e) => {
        switch (e.type) {
          case 14:
          case JXG.OBJECT_TYPE_POINT:
            return Point.getConfig(e)
          case JXG.OBJECT_TYPE_LINE:
            return Line.getConfig(e)
          case JXG.OBJECT_TYPE_CIRCLE:
            return Circle.getConfig(e)
          case JXG.OBJECT_TYPE_CONIC:
            return Ellipse.getConfig(e)
          case JXG.OBJECT_TYPE_POLYGON:
            return Polygon.getConfig(e)
          case Hyperbola.jxgType:
            return Hyperbola.getConfig(e)
          case Tangent.jxgType:
            return Tangent.getConfig(e)
          case Secant.jxgType:
            return Secant.getConfig(e)
          case Exponent.jxgType:
            return Exponent.getConfig(e)
          case Exponent2.jxgType:
            return Exponent2.getConfig(e)
          case Logarithm.jxgType:
            return Logarithm.getConfig(e)
          case Polynom.jxgType:
            return Polynom.getConfig(e)
          case Sin.jxgType:
            return Sin.getConfig(e)
          case Cos.jxgType:
            return Cos.getConfig(e)
          case Parabola.jxgType:
            return Parabola.getConfig(e)
          case Parabola2.jxgType:
            return Parabola2.getConfig(e)
          case Equation.jxgType:
            return Equation.getConfig(e)
          case Area.jxgType:
            return Area.getConfig(e)
          case Area2.jxgType:
            return Area2.getConfig(e)
          case DragDrop.jxgType:
            return DragDrop.getConfig(e)
          case PiecewiseLine.jxgType:
            return PiecewiseLine.getConfig(e)
          case Rose.jxgType:
            return Rose.getConfig(e)
          case Cardioid.jxgType:
            return Cardioid.getConfig(e)
          default:
            throw new Error('Unknown element type:', e.name, e.type)
        }
      })
    return Object.values(flatConfig(config))
  }

  getMarks() {
    return this.elements.map((mark) => Mark.getConfig(mark))
  }

  getSegments() {
    return this.elements.map((element) => {
      switch (element.segmentType) {
        case CONSTANT.TOOLS.SEGMENTS_POINT:
          return NumberlinePoint.getConfig(element, this)
        case CONSTANT.TOOLS.NUMBERLINE_PLOT_POINT:
          return NumberLineDotPlotPoint.getConfig(element, this)
        case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_INCLUDED:
        case CONSTANT.TOOLS.SEGMENT_LEFT_POINT_HOLLOW:
        case CONSTANT.TOOLS.SEGMENT_RIGHT_POINT_HOLLOW:
        case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_HOLLOW:
          return NumberlineSegment.getConfig(element, this)
        case CONSTANT.TOOLS.RAY_LEFT_DIRECTION:
        case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION:
        case CONSTANT.TOOLS.RAY_LEFT_DIRECTION_RIGHT_HOLLOW:
        case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION_LEFT_HOLLOW:
          return NumberlineVector.getConfig(element, this)
        default:
          return null
      }
    })
  }

  // settings

  getParameters(name) {
    switch (name) {
      case CONSTANT.TOOLS.POINT:
        return this.parameters.pointParameters
      default:
    }
  }

  /**
   * settings::pointParameters
   */
  setPointParameters(pointParameters) {
    const isSwitchToGrid =
      this.parameters.pointParameters &&
      !this.parameters.pointParameters.snapToGrid &&
      pointParameters.snapToGrid
    updatePointParameters(this.elements, pointParameters, isSwitchToGrid)
    this.parameters.pointParameters = {
      ...this.parameters.pointParameters,
      ...pointParameters,
    }
    this.$board.fullUpdate()
  }

  /**
   * settings::axesParameters
   */
  setAxesParameters(axesParameters) {
    const axes = this.$board.defaultAxes

    if (axesParameters.x) {
      updateAxe(axes.x, axesParameters.x, 'x')
    }
    if (axesParameters.y) {
      updateAxe(axes.y, axesParameters.y, 'y')
    }

    this.$board.fullUpdate()
  }

  /**
   * graphParameters
   * settings::graphParameters
   * @see https://jsxgraph.org/docs/symbols/JXG.Board.html#setBoundingBox
   */
  setGraphParameters(graphParameters) {
    this.parameters.graphParameters = graphParameters
    this.$board.setBoundingBox(graphParameters2Boundingbox(graphParameters))
  }

  /**
   * gridParameters
   * settings::graphParameters
   * @see https://jsxgraph.org/docs/symbols/JXG.Board.html#setBoundingBox
   */
  setGridParameters(gridParameters) {
    this.gridParameters = gridParameters
    updateGrid(this.$board.grids, gridParameters)
    this.$board.fullUpdate()
  }

  /**
   * update grid and axes based on grid type
   * @param {string} gridType retangular | polar | complex
   * @param {object} polarGridParams grid options for polar
   */
  updateGridAndAxes(gridType, polarGridParams) {
    this.gridType = gridType
    this.switchGrid(polarGridParams)
  }

  /**
   *
   * @see https://jsxgraph.org/docs/symbols/JXG.Board.html#resizeContainer
   */
  resizeContainer(canvasWidth, canvasHeight) {
    this.$board.resizeContainer(canvasWidth || 0, canvasHeight || 0)
  }

  loadMarksAnswers(marks = []) {
    marks.forEach((mark) => {
      this.answers.push(Mark.onHandler(this, { ...mark, fixed: true }))
    })
  }

  loadSegmentsAnswers(segments) {
    this.answers.push(
      // eslint-disable-next-line array-callback-return
      ...segments.map((segment) => {
        switch (segment.type) {
          case CONSTANT.TOOLS.SEGMENTS_POINT:
            return NumberlinePoint.renderAnswer(this, segment)
          case CONSTANT.TOOLS.NUMBERLINE_PLOT_POINT:
            return NumberLineDotPlotPoint.render(this, segment)
          case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_INCLUDED:
          case CONSTANT.TOOLS.SEGMENT_LEFT_POINT_HOLLOW:
          case CONSTANT.TOOLS.SEGMENT_RIGHT_POINT_HOLLOW:
          case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_HOLLOW:
            return NumberlineSegment.determineAnswerType(this, segment)
          case CONSTANT.TOOLS.RAY_LEFT_DIRECTION:
          case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION:
          case CONSTANT.TOOLS.RAY_LEFT_DIRECTION_RIGHT_HOLLOW:
          case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION_LEFT_HOLLOW:
            return NumberlineVector.determineAnswerType(this, segment)
          default:
            break
        }
      })
    )
  }

  setBgObjects(flatCfg, showPoints = true) {
    const config = flat2nestedConfig(flatCfg)
    this.bgElements.push(
      ...config.map((element) =>
        this.loadObject(element, {
          showPoints,
          checkLabelVisibility: true,
          checkPointVisibility: true,
          fixed: true,
        })
      )
    )
  }

  removeInequalities() {
    this.inequalities.forEach((ineq) => {
      this.$board.removeObject(ineq)
    })
    this.inequalities = []
    Area2.clearInequalities(this)
  }

  loadAnswersFromConfig(flatCfg) {
    const config = flat2nestedConfig(flatCfg)
    this.answers.push(
      ...config.map((element) =>
        this.loadObject(element, {
          fixed: true,
        })
      )
    )
    Area.updateShadingsForAreaPoints(this, this.answers)
    Area2.updateShadingsForAreaPoints(this, this.answers)
  }

  loadFromConfig(flatCfg) {
    this.removeInequalities()
    const config = flat2nestedConfig(flatCfg)
    this.elements.push(...config.map((element) => this.loadObject(element)))
    Area.updateShadingsForAreaPoints(this, this.elements)
    Area2.updateShadingsForAreaPoints(this, this.elements)
  }

  loadSegments(elements) {
    this.elements.push(
      ...elements.map((element) => {
        switch (element.type) {
          case CONSTANT.TOOLS.SEGMENTS_POINT:
            return NumberlinePoint.loadPoint(this, element)
          case CONSTANT.TOOLS.NUMBERLINE_PLOT_POINT:
            return NumberLineDotPlotPoint.render(this, element)
          case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_INCLUDED:
            return NumberlineSegment.loadSegment(
              this,
              element,
              true,
              true,
              CONSTANT.TOOLS.SEGMENT_BOTH_POINT_INCLUDED
            )
          case CONSTANT.TOOLS.SEGMENT_BOTH_POINT_HOLLOW:
            return NumberlineSegment.loadSegment(
              this,
              element,
              false,
              false,
              CONSTANT.TOOLS.SEGMENT_BOTH_POINT_HOLLOW
            )
          case CONSTANT.TOOLS.SEGMENT_LEFT_POINT_HOLLOW:
            return NumberlineSegment.loadSegment(
              this,
              element,
              false,
              true,
              CONSTANT.TOOLS.SEGMENT_LEFT_POINT_HOLLOW
            )
          case CONSTANT.TOOLS.SEGMENT_RIGHT_POINT_HOLLOW:
            return NumberlineSegment.loadSegment(
              this,
              element,
              true,
              false,
              CONSTANT.TOOLS.SEGMENT_RIGHT_POINT_HOLLOW
            )
          case CONSTANT.TOOLS.RAY_LEFT_DIRECTION:
            return NumberlineVector.loadVector(
              this,
              element,
              true,
              false,
              CONSTANT.TOOLS.RAY_LEFT_DIRECTION
            )
          case CONSTANT.TOOLS.RAY_LEFT_DIRECTION_RIGHT_HOLLOW:
            return NumberlineVector.loadVector(
              this,
              element,
              false,
              false,
              CONSTANT.TOOLS.RAY_LEFT_DIRECTION_RIGHT_HOLLOW
            )
          case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION:
            return NumberlineVector.loadVector(
              this,
              element,
              true,
              true,
              CONSTANT.TOOLS.RAY_RIGHT_DIRECTION
            )
          case CONSTANT.TOOLS.RAY_RIGHT_DIRECTION_LEFT_HOLLOW:
            return NumberlineVector.loadVector(
              this,
              element,
              false,
              true,
              CONSTANT.TOOLS.RAY_RIGHT_DIRECTION_LEFT_HOLLOW
            )
          default:
            throw new Error('Unknown element:', element)
        }
      })
    )
  }

  loadObject(object, settings = {}) {
    this.bgElements.forEach((el) => {
      if (el.type == 12) {
        this.labelForEq.push(el.labelHTML)
      } else {
        el.inherits.forEach((ancestorsEl) => {
          this.labelForEq.push(ancestorsEl.labelHTML)
        })
      }
    })

    const {
      showPoints = true,
      checkLabelVisibility = false,
      checkPointVisibility = false,
      fixed = false,
    } = settings

    switch (object._type) {
      case 14:
      case JXG.OBJECT_TYPE_POINT:
        this.labelForEq.push(object.label)
        return Point.create(this, object, {
          pointIsVisible: !checkPointVisibility || object.pointIsVisible,
          labelIsVisible: !checkLabelVisibility || object.labelIsVisible,
          fixed,
        })

      case JXG.OBJECT_TYPE_LINE:
        this.labelForEq.push(object.points[0].label, object.points[1].label)
        return Line.create(
          this,
          object,
          object.points.map((point) =>
            Point.create(this, point, {
              pointIsVisible:
                !checkPointVisibility || (showPoints && point.pointIsVisible),
              labelIsVisible:
                !checkLabelVisibility || (showPoints && point.labelIsVisible),
              fixed,
            })
          ),
          object.type,
          {
            labelIsVisible: !checkLabelVisibility || object.labelIsVisible,
            fixed,
          }
        )

      case JXG.OBJECT_TYPE_CIRCLE:
        this.labelForEq.push(object.points[0].label, object.points[1].label)
        return Circle.create(
          this,
          object,
          object.points.map((point) =>
            Point.create(this, point, {
              pointIsVisible:
                !checkPointVisibility || (showPoints && point.pointIsVisible),
              labelIsVisible:
                !checkLabelVisibility || (showPoints && point.labelIsVisible),
              fixed,
            })
          ),
          {
            labelIsVisible: !checkLabelVisibility || object.labelIsVisible,
            fixed,
          }
        )

      case JXG.OBJECT_TYPE_CONIC:
        this.labelForEq.push(
          object.points[0].label,
          object.points[1].label,
          object.points[2].label
        )
        return Ellipse.create(
          this,
          object,
          object.points.map((point) =>
            Point.create(this, point, {
              pointIsVisible:
                !checkPointVisibility || (showPoints && point.pointIsVisible),
              labelIsVisible:
                !checkLabelVisibility || (showPoints && point.labelIsVisible),
              fixed,
            })
          ),
          {
            labelIsVisible: !checkLabelVisibility || object.labelIsVisible,
            fixed,
          }
        )

      case JXG.OBJECT_TYPE_POLYGON:
        object.points.forEach((point) => {
          this.labelForEq.push(point)
        })
        return Polygon.create(
          this,
          object,
          object.points.map((point) =>
            Point.create(this, point, {
              pointIsVisible:
                !checkPointVisibility || (showPoints && point.pointIsVisible),
              labelIsVisible:
                !checkLabelVisibility || (showPoints && point.labelIsVisible),
              fixed,
            })
          ),
          {
            labelIsVisible: !checkLabelVisibility || object.labelIsVisible,
            fixed,
          }
        )

      case Hyperbola.jxgType:
        this.labelForEq.push(
          object.points[0].label,
          object.points[1].label,
          object.points[2].label
        )
        return Hyperbola.create(
          this,
          object,
          object.points.map((point) =>
            Point.create(this, point, {
              pointIsVisible:
                !checkPointVisibility || (showPoints && point.pointIsVisible),
              labelIsVisible:
                !checkLabelVisibility || (showPoints && point.labelIsVisible),
              fixed,
            })
          ),
          {
            labelIsVisible: !checkLabelVisibility || object.labelIsVisible,
            fixed,
          }
        )

      case Tangent.jxgType:
        this.labelForEq.push(object.points[0].label, object.points[1].label)
        return Tangent.create(
          this,
          object,
          object.points.map((point) =>
            Point.create(this, point, {
              pointIsVisible:
                !checkPointVisibility || (showPoints && point.pointIsVisible),
              labelIsVisible:
                !checkLabelVisibility || (showPoints && point.labelIsVisible),
              fixed,
            })
          ),
          {
            labelIsVisible: !checkLabelVisibility || object.labelIsVisible,
            fixed,
          }
        )

      case Secant.jxgType:
        this.labelForEq.push(object.points[0].label, object.points[1].label)
        return Secant.create(
          this,
          object,
          object.points.map((point) =>
            Point.create(this, point, {
              pointIsVisible:
                !checkPointVisibility || (showPoints && point.pointIsVisible),
              labelIsVisible:
                !checkLabelVisibility || (showPoints && point.labelIsVisible),
              fixed,
            })
          ),
          {
            labelIsVisible: !checkLabelVisibility || object.labelIsVisible,
            fixed,
          }
        )

      case Exponent.jxgType:
        this.labelForEq.push(object.points[0].label, object.points[1].label)
        return Exponent.create(
          this,
          object,
          object.points.map((point) =>
            Point.create(this, point, {
              pointIsVisible:
                !checkPointVisibility || (showPoints && point.pointIsVisible),
              labelIsVisible:
                !checkLabelVisibility || (showPoints && point.labelIsVisible),
              fixed,
            })
          ),
          {
            labelIsVisible: !checkLabelVisibility || object.labelIsVisible,
            fixed,
          }
        )

      case Exponent2.jxgType: {
        this.labelForEq.push(object.points[0].label)
        const point = Point.create(this, object.points[0], {
          pointIsVisible:
            !checkPointVisibility ||
            (showPoints && object.points[0]?.pointIsVisible),
          labelIsVisible:
            !checkLabelVisibility ||
            (showPoints && object.points[0]?.labelIsVisible),
          fixed,
        })
        return Exponent2.create(this, object, point, {
          labelIsVisible: !checkLabelVisibility || object.labelIsVisible,
          fixed,
        })
      }
      case Logarithm.jxgType:
        this.labelForEq.push(object.points[0].label, object.points[1].label)
        return Logarithm.create(
          this,
          object,
          object.points.map((point) =>
            Point.create(this, point, {
              pointIsVisible:
                !checkPointVisibility || (showPoints && point.pointIsVisible),
              labelIsVisible:
                !checkLabelVisibility || (showPoints && point.labelIsVisible),
              fixed,
            })
          ),
          {
            labelIsVisible: !checkLabelVisibility || object.labelIsVisible,
            fixed,
          }
        )

      case Polynom.jxgType:
        object.points.forEach((point) => {
          this.labelForEq.push(point)
        })
        return Polynom.create(
          this,
          object,
          object.points.map((point) =>
            Point.create(this, point, {
              pointIsVisible:
                !checkPointVisibility || (showPoints && point.pointIsVisible),
              labelIsVisible:
                !checkLabelVisibility || (showPoints && point.labelIsVisible),
              fixed,
            })
          ),
          {
            labelIsVisible: !checkLabelVisibility || object.labelIsVisible,
            fixed,
          }
        )

      case Sin.jxgType:
        this.labelForEq.push(object.points[0].label, object.points[1].label)
        return Sin.create(
          this,
          object,
          object.points.map((point) =>
            Point.create(this, point, {
              pointIsVisible:
                !checkPointVisibility || (showPoints && point.pointIsVisible),
              labelIsVisible:
                !checkLabelVisibility || (showPoints && point.labelIsVisible),
              fixed,
            })
          ),
          {
            labelIsVisible: !checkLabelVisibility || object.labelIsVisible,
            fixed,
          }
        )

      case Cos.jxgType:
        this.labelForEq.push(object.points[0].label, object.points[1].label)
        return Cos.create(
          this,
          object,
          object.points.map((point) =>
            Point.create(this, point, {
              pointIsVisible:
                !checkPointVisibility || (showPoints && point.pointIsVisible),
              labelIsVisible:
                !checkLabelVisibility || (showPoints && point.labelIsVisible),
              fixed,
            })
          ),
          {
            labelIsVisible: !checkLabelVisibility || object.labelIsVisible,
            fixed,
          }
        )

      case Parabola.jxgType:
        this.labelForEq.push(object.points[0].label, object.points[1].label)
        return Parabola.create(this, object, {
          labelIsVisible: !checkLabelVisibility || object.labelIsVisible,
          fixed,
        })

      case Parabola2.jxgType:
        this.labelForEq.push(
          object.points[0].label,
          object.points[1].label,
          object.points[2].label
        )
        return Parabola2.create(
          this,
          object,
          object.points.map((point) =>
            Point.create(this, point, {
              pointIsVisible:
                !checkPointVisibility || (showPoints && point.pointIsVisible),
              labelIsVisible:
                !checkLabelVisibility || (showPoints && point.labelIsVisible),
              fixed,
            })
          ),
          {
            labelIsVisible: !checkLabelVisibility || object.labelIsVisible,
            fixed,
          }
        )

      case Equation.jxgType: {
        const getPoints = (type, res) => {
          res = res.split('],')[1]
          res = res.replace(`['${type}',[`, '').replace(']]', '')
          res = res.substring(2, res.length - 2)
          res = res.split('),(')
          for (let i = 0; i < res.length; i++) {
            res[i] = res[i].split(',')
          }
          return res
        }
        const result = object.apiLatex
        let latex = object.latex

        const isInequalities = ['>=', '>', '<=', '<'].some((x) =>
          result.includes(x)
        )
        let shouldNotDashed = true
        let isInverseIneq = false
        if (isInequalities) {
          shouldNotDashed = ['>=', '<='].some((x) => result.includes(x))
          isInverseIneq = ['<=', '<'].some((x) => result.includes(x))
        }

        const obj = {
          label: false,
          labelIsVisible: false,
          baseColor: '#595e98',
          dashed: !shouldNotDashed,
        }

        if (
          latex.substring(1, 6) == 'left(' &&
          latex.substr(latex.length - 6) == 'right)' &&
          latex.indexOf(',') > -1
        ) {
          const latexForEqPoint = latex
          latex = latex.replace('left(', '').replace('right)', '')
          latex = latex.replace(/\\/g, '')
          latex = latex.split(',')

          const labelPoint1 = getLabel(this.labelForEq)

          const point = {
            x: latex[0],
            y: latex[1],
            label: object.label || getLabel(this.labelForEq),
            labelIsVisible: true,
            pointIsVisible: true,
            baseColor: '#595e98',
            id: null,
          }

          this.labelForEq.push(object.label || getLabel(this.labelForEq))

          if (!object.label) {
            object.label = labelPoint1
          }

          return Point.create(this, point, { latex: latexForEqPoint, result })
        }
        if (result.includes('line')) {
          const coords = getPoints('line', result)

          const labelPoint1 = getLabel(this.labelForEq)

          const point1 = {
            x: coords[0][0],
            y: coords[0][1],
            label: object.pointsLabel[0] || getLabel(this.labelForEq),
            labelIsVisible: true,
            pointIsVisible: true,
            baseColor: '#595e98',
            id: null,
          }

          this.labelForEq.push(
            object.pointsLabel[0] || getLabel(this.labelForEq)
          )
          const labelPoint2 = getLabel(this.labelForEq)

          const point2 = {
            x: coords[1][0],
            y: coords[1][1],
            label: object.pointsLabel[1] || getLabel(this.labelForEq),
            labelIsVisible: true,
            pointIsVisible: true,
            baseColor: '#595e98',
            id: null,
          }

          this.labelForEq.push(
            object.pointsLabel[1] || getLabel(this.labelForEq)
          )
          const points = [
            Point.create(this, point1),
            Point.create(this, point2),
          ]
          const type = 'line'

          if (!object.pointsLabel) {
            object.pointsLabel = [labelPoint1, labelPoint2]
          }

          const jsxObj = Line.create(this, obj, points, type, {
            latex,
            result,
            pointsLabel: [labelPoint1, labelPoint2],
          })
          if (isInequalities) {
            const ineq = this.$board.create('inequality', [jsxObj], {
              inverse: isInverseIneq,
              fillColor: greyThemeDark2,
            })
            this.inequalities.push(ineq)
          }
          return jsxObj
        }
        if (result.includes('circle')) {
          const coords = getPoints('circle', result)

          const labelPoint1 = getLabel(this.labelForEq)

          // point1 - center
          const point1 = {
            x: coords[1][0],
            y: coords[0][1],
            label: object.pointsLabel[0] || getLabel(this.labelForEq),
            labelIsVisible: true,
            pointIsVisible: true,
            baseColor: '#595e98',
            id: null,
          }

          this.labelForEq.push(
            object.pointsLabel[0] || getLabel(this.labelForEq)
          )
          const labelPoint2 = getLabel(this.labelForEq)

          // highest point of circle (top Y)
          const point2 = {
            x: coords[1][0],
            y: coords[1][1],
            label: object.pointsLabel[1] || getLabel(this.labelForEq),
            labelIsVisible: true,
            pointIsVisible: true,
            baseColor: '#595e98',
            id: null,
          }

          this.labelForEq.push(
            object.pointsLabel[1] || getLabel(this.labelForEq)
          )
          const points = [
            Point.create(this, point1),
            Point.create(this, point2),
          ]

          if (!object.pointsLabel) {
            object.pointsLabel = [labelPoint1, labelPoint2]
          }

          return Circle.create(this, obj, points, {
            latex,
            result,
            labelHTML: [labelPoint1, labelPoint2],
          })
        }
        if (result.includes(CONSTANT.TOOLS.ELLIPSE)) {
          const coords = getPoints(CONSTANT.TOOLS.ELLIPSE, result)

          const labelPoint1 = getLabel(this.labelForEq)

          const point1 = {
            x: `${coords[2][0]} - ${coords[1][0]}`,
            y: coords[0][1],
            label: object.pointsLabel[0] || getLabel(this.labelForEq),
            labelIsVisible: true,
            pointIsVisible: true,
            baseColor: '#595e98',
            id: null,
          }

          this.labelForEq.push(object.label[0] || getLabel(this.labelForEq))
          const labelPoint2 = getLabel(this.labelForEq)

          const point2 = {
            x: coords[1][0],
            y: coords[1][1],
            label: object.pointsLabel[1] || getLabel(this.labelForEq),
            labelIsVisible: true,
            pointIsVisible: true,
            baseColor: '#595e98',
            id: null,
          }

          this.labelForEq.push(object.label[1] || getLabel(this.labelForEq))
          const labelPoint3 = getLabel(this.labelForEq)

          const point3 = {
            x: coords[2][0],
            y: coords[2][1],
            label: object.pointsLabel[2] || getLabel(this.labelForEq),
            labelIsVisible: true,
            pointIsVisible: true,
            baseColor: '#595e98',
            id: null,
          }

          this.labelForEq.push(object.label[2] || getLabel(this.labelForEq))
          const points = [
            Point.create(this, point1),
            Point.create(this, point2),
            Point.create(this, point3),
          ]
          if (!object.pointsLabel) {
            object.pointsLabel = [labelPoint1, labelPoint2, labelPoint3]
          }

          return Ellipse.create(this, obj, points, {
            latex,
            result,
            labelHTML: [labelPoint1, labelPoint2, labelPoint3],
          })
        }
        if (result.includes('hyperbola')) {
          const coords = getPoints('hyperbola', result)

          const labelPoint1 = getLabel(this.labelForEq)

          const point1 = {
            x: coords[0][0],
            y: coords[0][1],
            label: object.pointsLabel[0] || getLabel(this.labelForEq),
            labelIsVisible: true,
            pointIsVisible: true,
            baseColor: '#595e98',
            id: null,
          }

          this.labelForEq.push(object.label[0] || getLabel(this.labelForEq))
          const labelPoint2 = getLabel(this.labelForEq)

          const point2 = {
            x: coords[1][0],
            y: coords[1][1],
            label: object.pointsLabel[1] || getLabel(this.labelForEq),
            labelIsVisible: true,
            pointIsVisible: true,
            baseColor: '#595e98',
            id: null,
          }
          this.labelForEq.push(object.label[1] || getLabel(this.labelForEq))
          const labelPoint3 = getLabel(this.labelForEq)

          const point3 = {
            x: coords[2][0],
            y: coords[2][1],
            label: object.pointsLabel[2] || getLabel(this.labelForEq),
            labelIsVisible: true,
            pointIsVisible: true,
            baseColor: '#595e98',
            id: null,
          }

          this.labelForEq.push(object.label[2] || getLabel(this.labelForEq))
          const points = [
            Point.create(this, point1),
            Point.create(this, point2),
            Point.create(this, point3),
          ]
          if (!object.pointsLabel) {
            object.pointsLabel = [labelPoint1, labelPoint2, labelPoint3]
          }

          return Hyperbola.create(this, obj, points, {
            latex,
            result,
            labelHTML: [labelPoint1, labelPoint2, labelPoint3],
          })
        }
        if (result.includes('parabola2')) {
          const coords = getPoints('parabola2', result)

          const labelPoint1 = getLabel(this.labelForEq)

          const point1 = {
            x: coords[1][0],
            y: coords[1][1],
            label: object.pointsLabel[1] || getLabel(this.labelForEq),
            labelIsVisible: true,
            pointIsVisible: true,
            baseColor: '#595e98',
            id: null,
          }

          this.labelForEq.push(object.label[0] || getLabel(this.labelForEq))
          const labelPoint2 = getLabel(this.labelForEq)

          const point2 = {
            x: coords[2][0],
            y: coords[2][1],
            label: object.pointsLabel[2] || getLabel(this.labelForEq),
            labelIsVisible: true,
            pointIsVisible: true,
            baseColor: '#595e98',
            id: null,
          }

          this.labelForEq.push(object.label[1] || getLabel(this.labelForEq))
          const labelPoint3 = getLabel(this.labelForEq)

          const point3 = {
            x: coords[0][0],
            y: coords[0][1],
            label: object.pointsLabel[0] || getLabel(this.labelForEq),
            labelIsVisible: true,
            pointIsVisible: true,
            baseColor: '#595e98',
            id: null,
          }

          this.labelForEq.push(object.label[2] || getLabel(this.labelForEq))
          const points = [
            Point.create(this, point3),
            Point.create(this, point2),
            Point.create(this, point1),
          ]
          if (!object.pointsLabel) {
            object.pointsLabel = [labelPoint1, labelPoint2, labelPoint3]
          }

          return Parabola2.create(this, obj, points, {
            latex,
            result,
            labelHTML: [labelPoint3, labelPoint2, labelPoint1],
          })
        }
        object.apiLatex = getEquationFromApiLatex(object.apiLatex)
        return Equation.create(this, object)
      }
      case Area.jxgType:
        return Area.create(this, object, { fixed })

      case Area2.jxgType:
        return Area2.create(this, object, { fixed })

      case DragDrop.jxgType:
        return DragDrop.create(this, object, {
          fixed,
        })
      case PiecewiseLine.jxgType:
        this.labelForEq.push(object.points[0].label, object.points[1].label)
        return PiecewiseLine.create(this, object)

      case NumberLineDotPlotPoint.jxgType: {
        return NumberLineDotPlotPoint.render(this, object, {
          fixed,
        })
      }
      case Rose.jxgType:
        return Rose.create(this, object, { fixed })
      case Cardioid.jxgType:
        return Cardioid.create(this, object, { fixed })
      default:
        throw new Error('Unknown element:', object)
    }
  }

  /**
   * settings::bgImageParameters
   * @see https://jsxgraph.org/docs/symbols/Image.html
   */
  setBgImage(bgImageParameters = {}) {
    const bgImage = this.createElement('image', [
      bgImageParameters.urlImg,
      ...getImageCoordsByPercent(this.parameters, bgImageParameters),
    ])
    bgImage.setAttribute({
      fixed: true,
      highlightFillOpacity: bgImageParameters.opacity,
      opacity: bgImageParameters.opacity,
    })
    this.bgImage = bgImage
  }

  removeBgImage() {
    this.$board.removeObject(this.bgImage)
  }

  isDragMode() {
    return this.$board.mode === this.$board.BOARD_MODE_DRAG
  }

  connectPoints(elements) {
    this.removeConnectline()
    this.connectline = Connectline.create(this.$board, elements)
  }

  removeConnectline() {
    Connectline.remove(this.$board, this.connectline)
  }

  updatePointOnEquEnabled(value) {
    this.pointOnEquEnabled = value
  }
}

export function makeBorder(id, graphType, config) {
  return new Board(id, graphType, config)
}

export default Board
