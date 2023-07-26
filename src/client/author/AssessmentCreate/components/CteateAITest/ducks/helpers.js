import uuid from 'uuid/v4'

import { EXACT_MATCH } from '@edulastic/constants/const/evaluationType'
import { itemStructure } from './constants'
import { MCQ_STANDARD_DATA } from '../../../../PickUpQuestionType/components/QuestionType/constants'

// const processMcqTFQuestion = (question) => {}

const processMcqStandardQuestion = (question) => {
  const { type, title, ...restData } = JSON.parse(
    JSON.stringify(MCQ_STANDARD_DATA)
  )
  const item = JSON.parse(JSON.stringify(itemStructure))

  item._id = uuid()
  const qId = uuid()

  const [row] = item.rows
  const widget = {
    widgetType: 'question',
    title,
    type,
    reference: qId,
    tabIndex: 0,
  }
  row.widgets.push(widget)

  const uuidMap = {}
  const options = []

  question.options.forEach(({ name, value }) => {
    uuidMap[value] = uuid()
    options.push({
      label: name,
      value: uuidMap[value],
    })
  })

  const correctAnswers = []

  if (question.correctAnswerIndex) {
    correctAnswers.push(uuidMap[question.correctAnswerIndex])
  }
  const validation = {
    scoringType: EXACT_MATCH,
    validResponse: {
      score: 1,
      value: correctAnswers,
    },
    altResponses: [],
  }

  return {
    ...item,
    data: {
      questions: [
        {
          ...restData,
          id: qId,
          type,
          title,
          stimulus: question.name,
          validation,
          options,
          hints: [],
        },
      ],
      resources: [],
    },
  }
}

// const processMcqMSQuestion = (question) => {}

const processQuestionAndCreateItem = {
  // TF: processMcqTFQuestion,
  MCQ: processMcqStandardQuestion,
  // MSQ: processMcqMSQuestion,
}

export const processAiGeneratedItems = (questions) => {
  const testItems = []

  questions.forEach((question) => {
    const { type } = question
    const itemProcessor = processQuestionAndCreateItem[type]
    testItems.push(itemProcessor(question))
  })
  console.log(JSON.stringify(testItems, null, 2))
  return testItems
}
