import { get } from 'lodash'

const alphabets = 'abcdefghijklmnopqrstuvwxyz'.split('')

/**
 * This method modifies testItems and adds qLabel, barLabel
 * @param {{data:{questions:Object[]},itemLevelScoring?:boolean, itemLevelScore: number}[]}_testItemsData
 */
export const markQuestionLabel = (_testItemsData) => {
  for (const [i, item] of _testItemsData.entries()) {
    if (!(item.data && item.data.questions)) {
      continue
    }
    if (item.data.questions.length === 1) {
      item.data.questions[0].qLabel = ''
      item.data.questions[0].qSubLabel = ''
      // item.data.questions[0].barLabel = `Q${i + 1}`;
      console.log(i)
    } else {
      item.data.questions = item.data.questions.map((q, qIndex) => ({
        ...q,
        qLabel: '',
        qSubLabel: alphabets[qIndex],
        // barLabel: item.itemLevelScoring ? `Q${i + 1}` : `Q${i + 1}.${alphabets[qIndex]}`
      }))
    }
  }
}

export const isPracticeUsage = (questions = []) => {
  if (!Array.isArray(questions)) return false
  return questions.some((question) =>
    get(question, 'validation.unscored', false)
  )
}

export const isFirstUnscored = (questions = []) => {
  if (!Array.isArray(questions)) return false
  return get(questions, '0.validation.unscored', false)
}

export const getValidQuestionsScore = (questions = []) => {
  if (!Array.isArray(questions)) {
    return 0
  }
  return questions.reduce((acc, q) => {
    const unscored = get(q, 'validation.unscored', false)
    const qScore = unscored ? 0 : get(q, 'validation.validResponse.score', 0)
    return acc + qScore
  }, 0)
}
