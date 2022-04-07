import { createAction } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import max from 'lodash/max'

const UPDATE_SCRATCHPAD = '[scratchpad] update scratchpad data'
const RESET_SCRATCHPAD = '[scratchpad] reset scratchpad data'
const SET_SELECTED_NODES = '[scratchpad] set selected nodes'
const TOGGLE_BUTTONS = '[scratchpad] toggle buttons'
const UPDATE_EDIT_MODE = '[scratchpad] update scratchpad edit mode'
const SET_SCRATCHPAD_RECT =
  '[scratchpad] set scratchpad dimensions and position'
const TOGGLE_SCRATCHPAD_DATA_VISIBILITY =
  '[scratchpad] toggle scratchpad data visibility'
const RESET_SCRATCHPAD_DIMENSIONS = '[scratchpad] reset scratchpad dimensions'
const ADJUST_SCRATCHPAD_DIMENSIONS =
  '[scratchpad] addjust scratchpad dimenstions'

export const updateScratchpadAction = createAction(UPDATE_SCRATCHPAD)
export const resetScratchPadDataAction = createAction(RESET_SCRATCHPAD)
export const setSelectedNodesAction = createAction(SET_SELECTED_NODES)
export const toggleButtonsAction = createAction(TOGGLE_BUTTONS)
export const updateEditModeAction = createAction(UPDATE_EDIT_MODE)
export const setScratchpadRectAction = createAction(SET_SCRATCHPAD_RECT)
export const resetScratchpadDimensionsAction = createAction(
  RESET_SCRATCHPAD_DIMENSIONS
)
export const toggleScratchpadVisbilityAction = createAction(
  TOGGLE_SCRATCHPAD_DATA_VISIBILITY
)
export const adjustScratchpadDimensionsAction = createAction(
  ADJUST_SCRATCHPAD_DIMENSIONS
)

const initialState = {
  fillColor: '#ff0000',
  lineWidth: 6,
  lineColor: '#ff0000',
  fontSize: 20,
  fontFamily: 'Open Sans',
  fontColor: '#000000',
  activeMode: '',
  deleteMode: false,
  editMode: '',
  selectedNodes: [],
  hideData: false,
  scratchpadRect: {},
  dimensionsPercent: 100,
  scratchpadUpdated: false,
}

export function scratchpad(state = initialState, { type, payload }) {
  switch (type) {
    case UPDATE_EDIT_MODE:
    case TOGGLE_BUTTONS:
    case UPDATE_SCRATCHPAD:
      return {
        ...state,
        ...payload,
      }
    case SET_SELECTED_NODES:
      return {
        ...state,
        selectedNodes: payload,
      }
    case SET_SCRATCHPAD_RECT: {
      const width = max([state.scratchpadRect.width, payload.width])
      const height = max([state.scratchpadRect.height, payload.height])
      return {
        ...state,
        scratchpadRect: { ...payload, width, height },
      }
    }
    case RESET_SCRATCHPAD_DIMENSIONS:
      return { ...state, scratchpadRect: { width: 0, height: 0 } }
    case TOGGLE_SCRATCHPAD_DATA_VISIBILITY:
      return {
        ...state,
        hideData: !state.hideData,
      }
    case ADJUST_SCRATCHPAD_DIMENSIONS:
      return {
        ...state,
        dimensionsPercent: state.dimensionsPercent + payload,
      }
    case RESET_SCRATCHPAD:
      return {
        ...initialState,
        scratchpadRect: state.scratchpadRect,
        scratchpadUpdated: payload,
      }
    default:
      return state
  }
}

export const scratchpadStateSelector = (state) => state.scratchpad

export const scratchpadDomRectSelector = createSelector(
  scratchpadStateSelector,
  (state) => state.scratchpadRect
)

export const getScratchPadUpdatedSelector = createSelector(
  scratchpadStateSelector,
  (state) => state.scratchpadUpdated || false
)
