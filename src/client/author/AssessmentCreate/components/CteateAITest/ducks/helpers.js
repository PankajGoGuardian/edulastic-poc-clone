import { processMcqStandardQuestion } from './aiQuestionToEduQuestion/processMcqStandard'
import { processMcqTrueAndFalse } from './aiQuestionToEduQuestion/processMcqTrueAndFalse'
import { processMSQ } from './aiQuestionToEduQuestion/processMsq'

const processQuestionAndCreateItem = {
  TF: processMcqTrueAndFalse,
  MCQ: processMcqStandardQuestion,
  MSQ: processMSQ,
}

export const processAiGeneratedItems = (questions) => {
  const testItems = []

  questions.forEach((question) => {
    const { type } = question
    const itemProcessor = processQuestionAndCreateItem[type]
    testItems.push(itemProcessor(question))
  })

  return testItems
}
