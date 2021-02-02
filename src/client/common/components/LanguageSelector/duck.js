import { createAction } from 'redux-starter-kit'
import { all, takeLatest, select, put } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { appLanguages, roleuser } from '@edulastic/constants'
import {
  UPDATE_QUESTION,
  getCurrentQuestionIdSelector,
  getCurrentQuestionSelector,
} from '../../../author/sharedDucks/questions'
import {
  getUserRole,
  getUserPreferredLanguage,
} from '../../../author/src/selectors/user'
import { resetEmptyLanguageData } from '../../../assessment/utils/question'

const { LANGUAGE_EN } = appLanguages
const SET_LANGUAGE = '[language] set language'
export const setLangAction = createAction(SET_LANGUAGE)

const initialState = {}
export function languageReducer(state = initialState, { type, payload }) {
  switch (type) {
    case SET_LANGUAGE:
      return {
        ...state,
        ...payload,
      }
    default:
      return state
  }
}

export default languageReducer

function* setLanguageSaga({ payload }) {
  const question = yield select(getCurrentQuestionSelector)
  if (payload && payload[question.id] !== LANGUAGE_EN) {
    const changedQuestion = resetEmptyLanguageData(
      question,
      payload[question.id]
    )
    if (changedQuestion) {
      yield put({
        type: UPDATE_QUESTION,
        payload: changedQuestion,
      })
    }
  }
}

export function* languageSaga() {
  yield all([yield takeLatest(SET_LANGUAGE, setLanguageSaga)])
}

export const languageStateSelector = (state) => state.languages
export const getCurrentLanguage = createSelector(
  languageStateSelector,
  getCurrentQuestionIdSelector,
  getUserRole,
  getUserPreferredLanguage,
  (state, currentQuestionId, userRole, userPreferredLanguage) => {
    if (userRole === roleuser.STUDENT) {
      return userPreferredLanguage || LANGUAGE_EN
    }
    return state[currentQuestionId] || LANGUAGE_EN
  }
)
