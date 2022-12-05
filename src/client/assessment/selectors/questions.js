import { createSelector } from 'reselect'
import { values, keyBy } from 'lodash'
import { getCurrentLanguage } from '../../common/components/LanguageSelector/duck'
import { changeDataToPreferredLanguage } from '../utils/question'
import { assignmentLevelSettingsSelector } from './answers'

const TEN_SECONDS = 10000
const DEFAULT_INTERVAL = 30000
const districtAutoSaveIntervalConfig = {
  '5f1d2b5f5dd16ded176b6b98': TEN_SECONDS,
}

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

    const allCustomKeys = convertedInPreferredLang.reduce((acc, curr) => {
      return [...acc, ...(curr.customKeys || [])]
    }, [])

    convertedInPreferredLang.forEach((question) => {
      question.customKeys = allCustomKeys
    })

    return keyBy(convertedInPreferredLang, (q) =>
      q.type === 'passage' || q.type === 'video'
        ? q.id
        : `${q.testItemId}_${q.id}`
    )
  }
)

export const autoSaveIntervalSelector = createSelector(
  assignmentLevelSettingsSelector,
  (currentAssignment) => {
    const { districtId } = currentAssignment || {}
    return districtAutoSaveIntervalConfig[districtId] || DEFAULT_INTERVAL
  }
)
