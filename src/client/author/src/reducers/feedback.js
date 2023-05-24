import { createAction, createReducer } from 'redux-starter-kit'

const initialState = {
  feedbacks: {},
}

const UPDATE_POSITION = '[feedback] update position for feedback'

const UPDATE_FEEDBACK_HEIGHT = '[feedback] update feedback height'

const FeedbackReducer = createReducer(initialState, {
  [UPDATE_POSITION](state, action) {
    const { payload } = action
    const { id, dimensions } = payload
    if (id) {
      state[id] = dimensions
    }
  },

  [UPDATE_FEEDBACK_HEIGHT](state, action) {
    const { payload } = action
    const { id, height } = payload
    if (id) {
      state.feedbacks[id] = height
    }
  },
})

export const updatePosition = createAction(UPDATE_POSITION)
export const updateHeight = createAction(UPDATE_FEEDBACK_HEIGHT)
export { FeedbackReducer as feedback }
