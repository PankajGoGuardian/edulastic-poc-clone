import { createAction, createReducer } from 'redux-starter-kit'

const initialState = {
  feedbacks: {},
}

const UPDATE_POSITION = '[feedback] update position for feedback'

const UPDATE_FEEDBACK_HEIGHT = '[feedback] update feedback height'

const RESET_FEEDBACK_POSITIONS = '[feedback] reset feedback position'

const FeedbackReducer = createReducer(initialState, {
  [UPDATE_POSITION](state, action) {
    const { payload } = action
    const { id, dimensions } = payload
    state[id] = dimensions
  },

  [UPDATE_FEEDBACK_HEIGHT](state, action) {
    const { payload } = action
    const { id, height } = payload
    state.feedbacks[id] = height
  },
  [RESET_FEEDBACK_POSITIONS]() {
    return initialState
  },
})

export const updatePosition = createAction(UPDATE_POSITION)
export const updateHeight = createAction(UPDATE_FEEDBACK_HEIGHT)
export const resetFeedBacksPositionsAction = createAction(
  RESET_FEEDBACK_POSITIONS
)
export { FeedbackReducer as feedback }
