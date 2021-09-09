import { createAction } from 'redux-starter-kit'

const SHOW_LINE_READER = '[line reader] show line reader'
const HIDE_LINE_READER = '[line reader] hide line reader'

export const showLineReaderAction = createAction(SHOW_LINE_READER)
export const hideLineReaderAction = createAction(HIDE_LINE_READER)

const initialState = { show: false }
function lineReaderReducer(state = initialState, { type }) {
  switch (type) {
    case SHOW_LINE_READER:
      return {
        ...state,
        show: true,
      }
    case HIDE_LINE_READER:
      return {
        ...state,
        show: false,
      }
    default:
      return state
  }
}

export default lineReaderReducer

export const lineReaderVisible = (state) => state.lineReader?.show
