import { drawTools } from '@edulastic/constants'

export const leftControls = [
  { mode: drawTools.SELECT_TOOL, label: 'Selector', pos: 0 },
  { mode: drawTools.FREE_DRAW, label: 'Pencil', pos: -34 },
  { mode: drawTools.DRAW_BREAKING_LINE, label: 'Straight Line', pos: -140 },
  { mode: drawTools.DRAW_CURVE_LINE, label: 'Curved Line', pos: -175 },
  { mode: drawTools.DRAW_SQUARE, label: 'Quadrilateral', pos: -68 },
  { mode: drawTools.DRAW_CIRCLE, label: 'Circle', pos: -105 },
  { mode: drawTools.DRAW_TRIANGLE, label: 'Triangle', pos: -809 },
  { mode: drawTools.DRAW_TEXT, label: 'Text', pos: -209 },
  { mode: drawTools.DRAW_MATH, label: 'Math Equation', pos: -350 },
]

export const midControls = [
  { mode: drawTools.DRAW_RULER_TOOL, label: 'Ruler Tool', pos: -390 },
  { mode: drawTools.DRAW_PROTRACTOR, label: 'Protractor Tool', pos: -313 },
  // { mode: drawTools.COMMENT, label: "Show teacher comments", pos: -950 },
  { mode: drawTools.EDITING_TOOL, label: 'Editing tools', pos: -245 },
]

export const rightControls = [
  { mode: drawTools.UNDO_TOOL, label: 'Undo', pos: -525 },
  { mode: drawTools.REDO_TOOL, label: 'Redo', pos: -561 },
  { mode: drawTools.DELETE_TOOL, label: 'Delete item', pos: -1443 },
]

export const options = {
  [drawTools.SELECT_TOOL]: {
    label: 'Selector',
    desc: 'Select the relevant button to use a function.',
  },
  [drawTools.FREE_DRAW]: {
    label: 'Freehand Drawing',
    desc: 'Tap and drag to draw lines and shapes.',
  },
  [drawTools.DRAW_BREAKING_LINE]: {
    label: 'Straight Line',
    desc: 'Tap to start and add a point, double tap to end.',
  },
  [drawTools.DRAW_CURVE_LINE]: {
    label: 'Curved Line',
    desc: 'Tap to start and add a point, double tap to end.',
  },
  [drawTools.DRAW_SQUARE]: {
    label: 'Quadrilateral Drawing',
    desc: 'Tap to start and drag to draw a Quadrilateral',
  },
  [drawTools.DRAW_CIRCLE]: {
    label: 'Circle Drawing',
    desc: 'Tap to start and drag to draw a Circle.',
  },
  [drawTools.DRAW_TRIANGLE]: {
    label: 'Triangle Drawing',
    desc: 'Tap to start and drag to draw a Triangle.',
  },
  [drawTools.DRAW_TEXT]: {
    label: 'Text',
    desc: 'Tap canvas to enter text.',
  },
  [drawTools.DRAW_MATH]: {
    label: 'Math Equation',
    desc: 'Use the Math Editor to add an expression or equation to the canvas',
  },
  [drawTools.DRAW_MEASURE_TOOL]: {
    label: 'Measure',
    desc: 'Drag and drop a tool to change location.',
  },
  [drawTools.EDITING_TOOL]: {
    label: 'Editing',
    desc: 'Select item to apply action, tap again for properties.',
  },
  [drawTools.DELETE_TOOL]: {
    label: 'Deleting',
    desc: 'Select item to remove it.',
  },
}

export const editingOptions = {
  leftOps: [
    { mode: drawTools.MOVE_FORWARD, label: 'Move forward', pos: -1125 },
    { mode: drawTools.MOVE_BEHIND, label: 'Move backward', pos: -1160 },
  ],
  rightOps: [
    { mode: drawTools.COPY, label: 'Copy', pos: -985 },
    { mode: drawTools.CUT, label: 'Cut', pos: -1020 },
    { mode: drawTools.PASTE, label: 'Paste', pos: -1055 },
  ],
}

export const controls = [{ mode: drawTools.MOVE_ITEM, label: 'Move' }]
