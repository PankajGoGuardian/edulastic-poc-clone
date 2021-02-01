import { createSelector } from 'reselect'
import { values, keyBy } from 'lodash'
import { getCurrentLanguage } from '../../common/components/LanguageSelector/duck'
import { changeDataToPreferredLanguage } from '../utils/question'

const getQuestionsSelector = (state) => state.assessmentplayerQuestions

export const getQuestionsListSelector = createSelector(
  getQuestionsSelector,
  (state) => values(state.byId)
)

export const getQuestionsByIdSelector = createSelector(
  getQuestionsListSelector,
  getCurrentLanguage,
  (questions, userPreferredLanguage) => {
    const convertedInPreferredLang = questions.map((question) =>
      changeDataToPreferredLanguage(question, userPreferredLanguage)
    )
    return keyBy(convertedInPreferredLang, 'id')
  }
)
