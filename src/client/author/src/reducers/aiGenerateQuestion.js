import { SET_AI_GENERATE_QUESTION_STATE } from '../constants/actions'

const initialState = {
  apiStatus: false,
  result: [],
}

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_AI_GENERATE_QUESTION_STATE:
      return {
        ...state,
        ...payload,
      }
    default:
      return state
  }
}

export default reducer
