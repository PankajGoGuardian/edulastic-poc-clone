import { isObject, get, set, isEmpty, keys, isString, isArray } from 'lodash'
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
    /uiStyle\.optionRowTitle/,
    /uiStyle\.stemTitle/,
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
  [questionType.PASSAGE]: [
    ...commonPatterns,
    /heading/,
    /contentsTitle/,
    /content/,
    /pages\.(\d+)/,
  ],
  [questionType.CLASSIFICATION]: [
    ...commonPatterns,
    /uiStyle\.rowTitles\.(\d+)/,
    /uiStyle\.columnTitles\.(\d+)/,
    /possibleResponses\.(\d+)\.value/,
    /possibleResponseGroups\.(\d+)\.title/,
    /possibleResponseGroups\.(\d+)\.responses\.(\d+).value/,
  ],
  [questionType.ORDER_LIST]: [...commonPatterns, /list\.(.*?)/],
  [questionType.CLOZE_IMAGE_DROP_DOWN]: [
    ...commonPatterns,
    /options\.(.*?)\.(\d+)/,
    /validation\.validResponse\.value\.(.*?)/,
    /validation\.altResponses\.(\d+)\.value\.(.*?)/,
  ],
  [questionType.ESSAY_RICH_TEXT]: [
    ...commonPatterns,
    /placeholder/,
    /metadata\.distractor_rationale_response_level\.(\d+)/,
  ],
  [questionType.ESSAY_PLAIN_TEXT]: [
    ...commonPatterns,
    /placeholder/,
    /metadata\.distractor_rationale_response_level\.(\d+)/,
  ],
  // [questionType.SHORT_TEXT]: [
  //   ...commonPatterns,
  //   /placeholder/,
  //   /metadata\.distractor_rationale_response_level\.(\d+)/,
  //   /validation\.validResponse\.value/,
  //   /validation\.altResponses\.(\d+)\.value/,
  // ],
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

const getLanguageDataPaths = (patterns, data) => {
  const availablePaths = getAvailablePaths(data)
  return availablePaths.filter((path) =>
    patterns.some((pattern) => new RegExp(pattern, 'g').test(path))
  )
}

const findRemovedIndex = (newOptions = [], prevOptions = []) => {
  let removedIndex = -1
  const newValues = newOptions.map((op) => {
    if (isString(op)) {
      return op
    }
    return op.value
  })
  prevOptions.forEach((op, opIndex) => {
    const compare = isString(op) ? op : op.value
    if (!newValues.includes(compare)) {
      removedIndex = opIndex
    }
  })
  return removedIndex
}

export const changeDataInPreferredLanguage = (
  language,
  prevQuestion,
  newQuestion,
  allowedToSelectMultiLanguage
) => {
  if (
    language &&
    language !== LANGUAGE_EN &&
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

    const patterns = patternsByQuestionType[newQuestion.type]
    const dataFields = getLanguageDataPaths(patterns, newQuestion)
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
        } else {
          set(draft, path, '')
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
  // I clean existing languageData when EN data is updated
  if (
    (!language || language === LANGUAGE_EN) &&
    useLanguageFeatureQn.includes(newQuestion.type) &&
    newQuestion.languageFeatures &&
    !allowedToSelectMultiLanguage
  ) {
    const changedData = produce(newQuestion, (draft) => {
      keys(draft.languageFeatures).forEach((langKey) => {
        const langDataPaths = getAvailablePaths(draft.languageFeatures[langKey])

        if (newQuestion.type === questionType.MULTIPLE_CHOICE) {
          const removedIndex = findRemovedIndex(
            newQuestion?.options,
            prevQuestion?.options
          )
          if (removedIndex !== -1) {
            draft.languageFeatures[langKey]?.options?.splice(removedIndex, 1)
          }
        } else if (newQuestion.type === questionType.CHOICE_MATRIX) {
          const removedStemIndex = findRemovedIndex(
            newQuestion?.stems,
            prevQuestion?.stems
          )
          if (removedStemIndex !== -1) {
            draft.languageFeatures[langKey]?.stems?.splice(removedStemIndex, 1)
          }
          const removedOpIndex = findRemovedIndex(
            newQuestion?.options,
            prevQuestion?.options
          )
          if (removedOpIndex !== -1) {
            draft.languageFeatures[langKey]?.options?.splice(removedOpIndex, 1)
          }
        } else if (newQuestion.type === questionType.CLOZE_DROP_DOWN) {
          // assume responseIds are same here
          const { responseIds, options: newOptions } = newQuestion
          const { options: prevOptions } = prevQuestion
          responseIds.forEach((response) => {
            const { id } = response
            if (newOptions[id]?.length !== prevOptions[id]?.length) {
              const removedIndex = findRemovedIndex(
                newOptions[id],
                prevOptions[id]
              )
              if (removedIndex !== -1) {
                draft.languageFeatures?.[langKey]?.options?.[id]?.splice(
                  removedIndex,
                  1
                )
              }
            }
          })
        } else if (newQuestion.type === questionType.EXPRESSION_MULTIPART) {
          const { options: newOptions, responseIds } = newQuestion
          const { options: prevOptions } = prevQuestion
          const { dropDowns } = responseIds
          if (isArray(dropDowns)) {
            dropDowns.forEach((dropdown) => {
              const removedIndex = findRemovedIndex(
                newOptions[dropdown.id],
                prevOptions[dropdown.id]
              )
              if (removedIndex !== -1) {
                draft.languageFeatures?.[langKey]?.options?.[
                  dropdown.id
                ]?.splice(removedIndex, 1)
              }
            })
          }
        }

        const cleanLangData = {}
        langDataPaths.forEach((path) => {
          const enData = get(draft, path)
          const langData = get(draft.languageFeatures[langKey], path)
          /**
           * @see https://goguardian.atlassian.net/browse/EV-36104
           * For token highlight qType data can differ for "validation.validResponse.value" or "templeWithTokens" paths
           * as data can be different for different languages. Thus need not compare enData and langData for setting
           * other language "validation" and "templateWithTokens"
           */
          if (
            newQuestion.type === questionType.TOKEN_HIGHLIGHT &&
            langData &&
            typeof path === 'string' &&
            (path.startsWith('validation.validResponse.value') ||
              path.startsWith('templeWithTokens'))
          ) {
            set(cleanLangData, path, langData)
          } else if (enData && langData) {
            set(cleanLangData, path, langData)
          }
        })

        draft.languageFeatures[langKey] = cleanLangData
      })
    })
    return changedData
  }

  return newQuestion
}

export const changeDataToPreferredLanguage = (
  questionData,
  language,
  view = ''
) => {
  // Changing english language to first languageFeatures language only when view is preview
  if (
    view === 'preview' &&
    language === LANGUAGE_EN &&
    !questionData?.stimulus?.length &&
    !questionData?.contentsTitle?.length &&
    questionData?.languageFeatures
  ) {
    // Extracting the first languageCode from keys of languageFeatures
    const languageCode = Object.keys(
      questionData?.languageFeatures || {}
    ).shift()
    language = languageCode
  }
  if (
    LANGUAGE_EN !== language &&
    useLanguageFeatureQn.includes(questionData?.type) &&
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
