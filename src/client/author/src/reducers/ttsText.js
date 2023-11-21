import { SET_TTS_TEXT_STATE, SET_TTS_UPDATE_DATA } from '../constants/actions'

const initialState = {
  apiStatus: false,
  result: [],
  TTSUpdateData: {
    apiStatus: false,
  },
}

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_TTS_TEXT_STATE:
    case SET_TTS_UPDATE_DATA:
      return {
        ...state,
        ...payload,
      }
    default:
      return state
  }
}

export default reducer
