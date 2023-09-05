import uuid from 'uuid/v4'
import { EXACT_MATCH } from '@edulastic/constants/const/evaluationType'
import { cloneDeep } from 'lodash'

import { Q_TYPES, itemStructure } from '../constants'
import { getAlignmentForEduItems } from '../helpers'
import { getDefaultDataByQuestionType } from './getQuestionDefaultData'

export const processMcqStandardQuestion = (
  question,
  alignmentData,
  grades,
  subjects
) => {
  const { commonCoreStandard, depthOfKnowledge, difficultLevel } = question
  const { type, title, ...restData } = cloneDeep(
    getDefaultDataByQuestionType(Q_TYPES.MCQ_ST)
  )
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

  question.options.forEach(({ name = '', label = '' }, index) => {
    uuidMap[`mapped_${index}`] = uuid()
    options.push({
      label: name || label,
      value: uuidMap[`mapped_${index}`],
    })
  })

  const correctAnswers = []

  correctAnswers.push(uuidMap[`mapped_${question.correctAnswerIndex}`])

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
