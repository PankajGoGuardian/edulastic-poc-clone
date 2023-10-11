import uuid from 'uuid/v4'
import { pick } from 'lodash'
import { math } from '@edulastic/constants'
import {
  SHORT_TEXT,
  MULTIPLE_CHOICE,
  CLOZE_DROP_DOWN,
  MATH,
  TRUE_OR_FALSE,
  ESSAY_PLAIN_TEXT,
} from '@edulastic/constants/const/questionType'
import {
  typeTitleHash,
  defaultQuestionOptions,
  defaultQuestionValue,
  clozeDropDownData,
  trueOrFalseData,
  multipleChoiceData,
  essayData,
  mathData,
} from '../constants'
import { EXACT_MATCH } from '../../../../assessment/constants/constantsForQuestions'

const { methods } = math

export const createQuestion = ({
  type,
  questionDisplayTimestamp,
  questionIndex,
  docBasedCommonData = {},
  aiQuestion,
}) => {
  const staticQuestionData = {
    id: uuid(),
    qIndex: questionIndex,
    title: typeTitleHash[type],
    type,
    isDocBased: true,
    options: defaultQuestionOptions[type],
    validation: {
      scoringType: 'exactMatch',
      validResponse: {
        score: 1,
        value: defaultQuestionValue[type],
      },
      altResponses: [],
    },
    multipleResponses: false,
    stimulus: '',
    smallSize: true,
    alignment: [],
    questionDisplayTimestamp,
    ...docBasedCommonData,
    ...(type === CLOZE_DROP_DOWN ? clozeDropDownData : {}),
    ...(type === TRUE_OR_FALSE ? trueOrFalseData : {}),
    ...(type === MULTIPLE_CHOICE ? multipleChoiceData : {}),
    ...(type === MATH ? mathData : {}),
    ...(type === ESSAY_PLAIN_TEXT ? essayData : {}),
  }

  if (aiQuestion) {
    const {
      options,
      name,
      correctAnswer,
      correctAnswerIndex,
      displayAtSecond,
    } = aiQuestion

    staticQuestionData.aiGenerated = true
    staticQuestionData.stimulus = name
    if (typeof displayAtSecond === 'number') {
      const updatedDisplayAtSecond = displayAtSecond === 0 ? 4 : displayAtSecond
      staticQuestionData.questionDisplayTimestamp = updatedDisplayAtSecond
    }

    if (type === MULTIPLE_CHOICE && typeof correctAnswerIndex === 'number') {
      staticQuestionData.options = (options || []).map((option) => ({
        label: option.name,
        value: uuid(),
      }))

      staticQuestionData.validation.validResponse.value = [
        staticQuestionData.options[correctAnswerIndex]?.value,
      ]
    } else if (type === CLOZE_DROP_DOWN && correctAnswerIndex !== undefined) {
      staticQuestionData.options = {
        0: (options || []).map((option) => option.name),
      }
      staticQuestionData.validation.validResponse.value = [
        {
          id: 0,
          value: staticQuestionData.options['0'][correctAnswerIndex],
        },
      ]
    } else if (type === TRUE_OR_FALSE && correctAnswer !== undefined) {
      const correctBooleanOption =
        staticQuestionData.options[correctAnswer ? 0 : 1]

      staticQuestionData.validation.validResponse.value = [
        correctBooleanOption.value,
      ]
    } else if (type === MATH && correctAnswer !== undefined) {
      staticQuestionData.validation.validResponse.value = [
        {
          method: methods.EQUIV_SYMBOLIC,
          options: {
            inverseResult: false,
          },
          value: correctAnswer.toString(),
        },
      ]
    } else if (type === SHORT_TEXT && correctAnswer !== undefined) {
      staticQuestionData.validation.validResponse.value = correctAnswer
    }
  }

  return staticQuestionData
}

const updateMultipleChoice = (optionsValue) => {
  const options = optionsValue.split('')
  return {
    options: options.map((option, index) => ({
      label: option,
      value: index + 1,
    })),
    validation: {
      scoringType: 'exactMatch',
      validResponse: {
        score: 1,
        value: [],
      },
      altResponses: [],
    },
  }
}

const updateShortText = (value) => ({
  validation: {
    scoringType: EXACT_MATCH,
    validResponse: {
      score: 1,
      matchingRule: EXACT_MATCH,
      value,
    },
    altResponses: [],
  },
})

export const validationCreators = {
  [MULTIPLE_CHOICE]: updateMultipleChoice,
  [SHORT_TEXT]: updateShortText,
}

export const formatStandard = (standard = {}) => {
  const formattedStandard = pick(standard, [
    '_id',
    'level',
    'grades',
    'identifier',
    'tloIdentifier',
    'tloId',
    'tloDescription',
    'eloId',
    'subEloId',
    'description',
    'curriculumId',
  ])
  return formattedStandard
}
