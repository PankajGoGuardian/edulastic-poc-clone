import { isObject, get, set, isEmpty } from 'lodash'
import { produce } from 'immer'
import { appLanguages, questionType } from '@edulastic/constants'
import { isValidUpdate } from '@edulastic/common'

const { useLanguageFeatureQn } = questionType
const { LANGUAGE_EN } = appLanguages

const commonPatterns = [
  /scoringInstructions/,
  /instructorStimulus/,
  /sampleAnswer/,
  /stimulus/,
  /hints\.(\d+)\.label/,
  /tts\.taskStatus/,
  /tts\.taskId/,
  /tts\.titleAudioURL/,
  /tts\.ttsCreatedAt/,
]

const patternsByQuestionType = {
  [questionType.CLOZE_DRAG_DROP]: [...commonPatterns, /options\.(\d+)\.label/],
  [questionType.CLOZE_IMAGE_DRAG_DROP]: [
    ...commonPatterns,
    /options\.(\d+)\.value/,
  ],
  [questionType.EXPRESSION_MULTIPART]: [
    ...commonPatterns,
    /options\.(.*?)\.(\d+)/,
    /validation\.validResponse\.dropdown\.value\.(\d+)\.value/,
    /validation\.validResponse\.textinput\.value\.(\d+)\.value/,
    /validation\.altResponses\.(\d+)\.dropdown\.value\.(\d+)\.value/,
    /validation\.altResponses\.(\d+)\.textinput\.value\.(\d+)\.value/,
  ],
  [questionType.CHOICE_MATRIX]: [
    ...commonPatterns,
    /options\.(\d)/,
    /stems\.(.*\d+)/,
  ],
  [questionType.CLOZE_DROP_DOWN]: [
    ...commonPatterns,
    /options\.(.*?)\.(\d+)/,
    /validation\.validResponse\.value\.(\d+)\.value/,
    /validation\.altResponses\.(\d+)\.value\.(\d+)\.value/,
  ],
  [questionType.CLOZE_TEXT]: [
    ...commonPatterns,
    /validation\.validResponse\.value\.(\d+)\.value/,
    /validation\.altResponses\.(\d+)\.value\.(\d+)\.value/,
  ],
  [questionType.MATH]: [...commonPatterns],
  [questionType.FORMULA_ESSAY]: [...commonPatterns],
  [questionType.MULTIPLE_CHOICE]: [...commonPatterns, /options\.(\d+)\.label/],
  [questionType.TOKEN_HIGHLIGHT]: [...commonPatterns, /template/],
  [questionType.TEXT]: [...commonPatterns, /heading/, /content/],
  [questionType.VIDEO]: [
    ...commonPatterns,
    /sourceURL/,
    /videoType/,
    /heading/,
    /summary/,
    /transcript/,
  ],
}

const clozeTypes = [
  questionType.CLOZE_DRAG_DROP,
  questionType.EXPRESSION_MULTIPART,
  questionType.CLOZE_DROP_DOWN,
  questionType.CLOZE_TEXT,
]

const getAvailablePaths = (data, prev = '', paths = []) => {
  Object.keys(data).forEach((key) => {
    const path = prev + (prev ? '.' : '') + key
    if (isObject(data[key]) && key !== 'languageFeatures') {
      return getAvailablePaths(data[key], path, paths)
    }
    if (key !== 'languageFeatures') {
      paths.push(path)
    }
  })
  return paths
}

const getLanguageDataPaths = (qType, data) => {
  const patterns = patternsByQuestionType[qType]
  if (!patterns) {
    return []
  }
  const availablePaths = getAvailablePaths(data)
  return availablePaths.filter((path) =>
    patterns.some((pattern) => new RegExp(pattern, 'g').test(path))
  )
}

export const changeDataInPreferredLanguage = (
  language,
  prevQuestion,
  newQuestion
) => {
  if (
    useLanguageFeatureQn.includes(newQuestion.type) &&
    patternsByQuestionType[newQuestion.type]
  ) {
    if (clozeTypes.includes(newQuestion.type)) {
      const vaild = isValidUpdate(
        get(newQuestion, `stimulus`, ''),
        get(prevQuestion, `stimulus`, '')
      )
      if (!vaild) {
        return prevQuestion
      }
    }

    const dataFields = getLanguageDataPaths(newQuestion.type, newQuestion)
    const changedQuestion = produce(newQuestion, (draft) => {
      if (!draft.languageFeatures) {
        draft.languageFeatures = {}
      }

      if (!draft.languageFeatures[language]) {
        draft.languageFeatures[language] = {}
      }

      dataFields.forEach((path) => {
        const currentData = get(newQuestion, path)
        set(draft.languageFeatures[language], path, currentData)
        // use previous data for English
        // if it exist in previouse data.
        const prevData = get(prevQuestion, path)
        if (prevData) {
          set(draft, path, prevData)
        }
        if (questionType.TOKEN_HIGHLIGHT === newQuestion.type) {
          draft.languageFeatures[language].validation = newQuestion.validation
          draft.languageFeatures[language].templeWithTokens =
            newQuestion.templeWithTokens

          draft.validation = prevQuestion.validation
          draft.templeWithTokens = prevQuestion.templeWithTokens
        }
      })
    })

    return changedQuestion
  }

  return newQuestion
}

export const changeDataToPreferredLanguage = (questionData, language) => {
  if (
    LANGUAGE_EN !== language &&
    useLanguageFeatureQn.includes(questionData.type) &&
    questionData?.languageFeatures?.[language]
  ) {
    const languageData = questionData.languageFeatures[language]
    const languageDataPaths = getAvailablePaths(languageData)

    const changedData = produce(questionData, (draft) => {
      languageDataPaths.forEach((path) => {
        const langData = get(languageData, path)
        set(draft, path, langData)

        if (questionType.TOKEN_HIGHLIGHT === questionData.type) {
          draft.validation = languageData.validation
          draft.templeWithTokens = languageData.templeWithTokens
        }
      })
    })
    return changedData
  }
  return questionData
}

export const resetEmptyLanguageData = (data, language) => {
  const languageData = get(data, ['languageFeatures', language], {})
  if (isEmpty(languageData)) {
    return
  }
  let hasEmpty = false
  const languageDataPaths = getAvailablePaths(languageData)
  const changedQuestion = produce(data, (draft) => {
    languageDataPaths.forEach((path) => {
      const langData = get(languageData, path)
      const enData = get(draft, path)
      if (!langData && enData) {
        hasEmpty = true
        set(draft, `languageFeatures.${language}.${path}`, enData)
      }
    })
  })
  if (hasEmpty) {
    return changedQuestion
  }
  return null
}
