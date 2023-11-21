import {
  SET_TTS_TEXT_STATE,
  FETCH_TTS_TEXT,
  SET_TTS_UPDATE_DATA,
  UPDATE_TTS_TEXT,
} from '../constants/actions'

export const setTTSTextStateAction = (payload) => ({
  type: SET_TTS_TEXT_STATE,
  payload,
})

export const fetchTTSTextAction = (payload) => ({
  type: FETCH_TTS_TEXT,
  payload,
})

export const setTTSUpdateDataAction = (payload) => ({
  type: SET_TTS_UPDATE_DATA,
  payload,
})

export const updateTTSTextAction = (payload) => ({
  type: UPDATE_TTS_TEXT,
  payload,
})
