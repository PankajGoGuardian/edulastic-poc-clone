import uuid from 'uuid/v4'
import { EXACT_MATCH } from '@edulastic/constants/const/evaluationType'
import { cloneDeep } from 'lodash'
import { MCQ_TF_DATA } from '../../../../../PickUpQuestionType/components/QuestionType/constants'
import { itemStructure } from '../constants'
import { getAlignmentForEduItems } from '../helpers'

export const processMcqTrueAndFalse = (
  { name, correctAnswer, commonCoreStandard, depthOfKnowledge, difficultLevel },
  alignmentData,
  grades,
  subjects
) => {
  const optionMap = {
    true: uuid(),
    false: uuid(),
  }

  const alignment = getAlignmentForEduItems(alignmentData, commonCoreStandard)

  const { type, title, ...restData } = cloneDeep(MCQ_TF_DATA)

  const item = cloneDeep(itemStructure)

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
          alignment,
          grades,
          subjects,
          depthOfKnowledge,
          authorDifficulty: difficultLevel,
        },
      ],
      resources: [],
    },
  }
}
