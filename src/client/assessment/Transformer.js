import questionType from '@edulastic/constants/const/questionType'
import { sortTestItemQuestions } from '../author/dataUtils'

const alphabets = 'abcdefghijklmnopqrstuvwxyz'.split('')

/**
 * This method modifies testItems and adds qLabel, barLabel
 * @param {{data:{questions:Object[]},itemLevelScoring?:boolean, itemLevelScore: number}[]}_testItemsData
 */
export const markQuestionLabel = (_testItemsData) => {
  const targetArray = [..._testItemsData]
  const returnArr = []
  const sortedTestItems = sortTestItemQuestions(targetArray)
  for (const [i, item] of sortedTestItems.entries()) {
    const targetItem = { ...item }
    if (!(targetItem.data && targetItem.data.questions)) {
      continue
    }
    if (targetItem.data.questions.length === 1) {
      targetItem.data.questions[0].qLabel = i + 1
      targetItem.data.questions[0].qSubLabel = ''
      targetItem.data.questions[0].barLabel = `Q${i + 1}`
    } else if (item.isDocBased) {
      item.data.questions = item.data.questions
        .filter((q) => q.type !== questionType.SECTION_LABEL)
        .sort((a, b) => a.qIndex - b.qIndex)
        .map((q, qIndex) => ({
          ...q,
          qLabel: `Q${qIndex + 1}`,
          barLabel: `Q${qIndex + 1}`,
        }))
    } else {
      targetItem.data.questions = targetItem.data.questions.map(
        (q, qIndex) => ({
          ...q,
          qLabel: qIndex === 0 ? i + 1 : '',
          qSubLabel: alphabets[qIndex],
          barLabel: item.itemLevelScoring
            ? `Q${i + 1}`
            : `Q${i + 1}.${alphabets[qIndex]}`,
        })
      )
    }
    returnArr[i] = targetItem
  }

  return returnArr
}
