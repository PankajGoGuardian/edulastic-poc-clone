import { createSelector } from 'reselect'
import { values, keyBy } from 'lodash'
import { questionType } from '@edulastic/constants'
import { getCurrentLanguage } from '../../common/components/LanguageSelectorTab/duck'
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

    return keyBy(convertedInPreferredLang, (q) => {
      /**
       * EV-40956
       * Text type question in passage does not have testItemId which results: undefined_${q.id}
       * Checking if question type is "text" but not a have to testItem then returning q.id instead undefined_${q.id}
       */

      const isPassageTextItem = q.type === questionType.TEXT && !q.testItemId

      if (
        [questionType.VIDEO, questionType.PASSAGE].includes(q.type) ||
        isPassageTextItem
      ) {
        return q.id
      }

      return `${q.testItemId}_${q.id}`
    })
  }
)

export const autoSaveIntervalSelector = createSelector(
  assignmentLevelSettingsSelector,
  (currentAssignment) => {
    const { districtId } = currentAssignment || {}
    return districtAutoSaveIntervalConfig[districtId] || DEFAULT_INTERVAL
  }
)
