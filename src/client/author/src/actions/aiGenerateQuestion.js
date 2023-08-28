import {
  SET_AI_GENERATE_QUESTION_STATE,
  FETCH_AI_GENERATE_QUESTION,
} from '../constants/actions'

export const setAIGeneratedQuestionStateAction = (payload) => ({
  type: SET_AI_GENERATE_QUESTION_STATE,
  payload,
})

export const fetchAIGeneratedQuestionAction = (payload) => ({
  type: FETCH_AI_GENERATE_QUESTION,
  payload,
})
