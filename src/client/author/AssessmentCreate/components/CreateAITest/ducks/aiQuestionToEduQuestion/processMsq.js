import uuid from 'uuid/v4'
import { EXACT_MATCH } from '@edulastic/constants/const/evaluationType'
import { cloneDeep } from 'lodash'

import { Q_TYPES, itemStructure } from '../constants'
import { getAlignmentForEduItems } from '../helpers'
import { getDefaultDataByQuestionType } from './getQuestionDefaultData'

export const processMSQ = (
  {
    options: aiOptions,
    correctAnswersIndex = [],
    name,
    commonCoreStandard,
    depthOfKnowledge,
    difficultLevel,
  },
  alignmentData,
  grades,
  subjects
) => {
  const { type, title, ...restData } = cloneDeep(
    getDefaultDataByQuestionType(Q_TYPES.MCQ_MS)
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

  aiOptions.forEach(({ name: _label, label }, index) => {
    uuidMap[`mapped_${index}`] = uuid()
    options.push({
      label: _label || label,
      value: uuidMap[`mapped_${index}`],
    })
  })

  const correctAnswers = []

  correctAnswersIndex.forEach((index) => {
    correctAnswers.push(uuidMap[`mapped_${index}`])
  })

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

//  {
//         name: 'What is the first step of food processing called?',
//         displayAtSecond: 33,
//         correctAnswersIndex: [1, 2],
//         coreStandard: [' 7.RP.A.1'],
//         depthOfKnowledge: 'Skill/Concept',
//         difficulty: 'easy',
//         options: [
//           {
//             name: 'Ingestion',
//           },
//           {
//             name: 'Absorption',
//           },
//           {
//             name: 'Elimination',
//           },
//           {
//             name: 'Digestion',
//           },
//         ],
//         type: 'MSQ',
//       },
