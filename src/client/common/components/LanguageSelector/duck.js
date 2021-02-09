import { createAction } from 'redux-starter-kit'
import { all, takeLatest, select, put } from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { get } from 'lodash'
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
export const getUtaPeferredLanguage = (state) => state.test.languagePreference

export const getIsMultiLanguageEnabled = (state) => {
  const assignmentById = get(state, 'studentAssignment.byId')
  const currentAssignment = get(state, 'studentAssignment.current')
  return !!assignmentById[currentAssignment]?.multiLanguageEnabled
}
export const getCurrentLanguage = createSelector(
  languageStateSelector,
  getCurrentQuestionIdSelector,
  getUserRole,
  getUserPreferredLanguage,
  getUtaPeferredLanguage,
  getIsMultiLanguageEnabled,
  (
    state,
    currentQuestionId,
    userRole,
    userPreferredLanguage,
    utaPeferredLanguage,
    isMultiLanguageEnabled
  ) => {
    if (userRole === roleuser.STUDENT) {
      if (isMultiLanguageEnabled)
        return utaPeferredLanguage || userPreferredLanguage || LANGUAGE_EN
      return LANGUAGE_EN
    }
    return state[currentQuestionId] || LANGUAGE_EN
  }
)

// used in LCB, ExpressGrader and student side grades
export const languagePreferenceSelector = (state, props = {}) => {
  let preferredLanguage = 'en'
  const { isLCBView, isStudentReport, isExpressGrader, data } = props || {}
  if (isLCBView || isExpressGrader) {
    const { activity: { testActivityId, userId } = {} } = data || {}
    const {
      testActivities: currentUTAS = [],
      recentTestActivitiesGrouped = {},
    } = state?.author_classboard_testActivity?.data || {}
    const previousUTAS = recentTestActivitiesGrouped?.[userId] || []
    const allUTAS = [...currentUTAS, ...previousUTAS]
    if (testActivityId) {
      const currentUTA = allUTAS.find((uta) => uta._id === testActivityId)
      const { languagePreference = 'en' } = currentUTA || {}
      preferredLanguage = languagePreference
    }
  } else if (isStudentReport) {
    const { languagePreference = 'en' } =
      state?.studentReport?.testActivity || {}
    preferredLanguage = languagePreference
  }

  return preferredLanguage
}
