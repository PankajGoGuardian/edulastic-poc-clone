import uuid from 'uuid/v4'
import { EXACT_MATCH } from '@edulastic/constants/const/evaluationType'
import { MCQ_TF_DATA } from '../../../../../PickUpQuestionType/components/QuestionType/constants'
import { itemStructure } from '../constants'

export const processMcqTrueAndFalse = ({ name, correctAnswer }) => {
  const optionMap = {
    true: uuid(),
    false: uuid(),
  }

  const { type, title, ...restData } = JSON.parse(JSON.stringify(MCQ_TF_DATA))

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

  const options = [
    {
      value: optionMap.true,
      label: 'True',
    },
    {
      value: optionMap.false,
      label: 'False',
    },
  ]

  const correctAnswers = [optionMap[`${correctAnswer}`]]

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
          stimulus: name,
          validation,
          options,
          hints: [],
        },
      ],
      resources: [],
    },
  }
}

// {
//   name: 'Is chewing an important step in food digestion?',
//   displayAtSecond: 17,
//   correctAnswer: true,
//   coreStandard: [' 7.RP.A.1'],
//   depthOfKnowledge: 'Skill/Concept',
//   difficulty: 'easy',
//   type: 'TF',
// },
