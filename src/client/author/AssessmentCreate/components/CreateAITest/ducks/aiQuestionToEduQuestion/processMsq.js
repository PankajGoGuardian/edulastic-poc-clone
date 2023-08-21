import uuid from 'uuid/v4'
import { EXACT_MATCH } from '@edulastic/constants/const/evaluationType'
import { cloneDeep } from 'lodash'
import { MCQ_MSQ_DATA } from '../../../../../PickUpQuestionType/components/QuestionType/constants'
import { itemStructure } from '../constants'
import { getAlignmentForEduItems } from '../helpers'

export const processMSQ = (
  {
    options: aiOptions,
    correctAnswersIndex,
    name,
    commonCoreStandard,
    depthOfKnowledge,
    difficultLevel,
  },
  alignmentData,
  grades,
  subjects
) => {
  const { type, title, ...restData } = cloneDeep(MCQ_MSQ_DATA)
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

  aiOptions.forEach(({ name: label }, index) => {
    uuidMap[index] = uuid()
    options.push({
      label,
      value: uuidMap[index],
    })
  })

  const correctAnswers = []

  if (correctAnswersIndex) {
    correctAnswersIndex.forEach((index) => {
      correctAnswers.push(uuidMap[index])
    })
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
