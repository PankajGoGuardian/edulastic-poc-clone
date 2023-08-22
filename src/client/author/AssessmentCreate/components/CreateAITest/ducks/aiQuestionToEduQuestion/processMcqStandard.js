import uuid from 'uuid/v4'
import { EXACT_MATCH } from '@edulastic/constants/const/evaluationType'
import { cloneDeep } from 'lodash'
import { MCQ_STANDARD_DATA } from '../../../../../PickUpQuestionType/components/QuestionType/constants'
import { itemStructure } from '../constants'
import { getAlignmentForEduItems } from '../helpers'

export const processMcqStandardQuestion = (
  question,
  alignmentData,
  grades,
  subjects
) => {
  const { commonCoreStandard, depthOfKnowledge, difficultLevel } = question
  const { type, title, ...restData } = cloneDeep(MCQ_STANDARD_DATA)
  const item = cloneDeep(itemStructure)

  const alignment = getAlignmentForEduItems(alignmentData, commonCoreStandard)

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

  question.options.forEach(({ name }, index) => {
    uuidMap[index] = uuid()
    options.push({
      label: name,
      value: uuidMap[index],
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
