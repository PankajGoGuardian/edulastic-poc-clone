import { set, round, min } from 'lodash'
import produce from 'immer'
import evaluators from './evaluators'
import { replaceVariables } from '../../../assessment/utils/variables'
import { FIRST_CORRECT_MUST } from '../../ItemDetail/constants'

// TODO use this helper to get final score and refactor score logic below
// const getAchievedScore = (
//   itemLevelScoring,
//   itemLevelScore,
//   itemGradingType,
//   totalScore,
//   allCorrect,
//   firstCorrect
// ) => {
//   if (itemGradingType === FIRST_CORRECT_MUST && !firstCorrect) {
//     return 0
//   }
//   if (itemLevelScoring) {
//     return min([itemLevelScore, allCorrect ? itemLevelScore : totalScore])
//   }
//   return totalScore
// }

export const evaluateItem = async (
  answers,
  validations,
  itemLevelScoring = false,
  itemLevelScore = 0,
  itemId = '',
  itemGradingType
) => {
  const questionIds = Object.keys(validations)
  // console.log(questionIds, validations)
  const results = {}
  let totalScore = 0
  let totalMaxScore = itemLevelScoring ? itemLevelScore : 0
  const numberOfQuestions = Object.keys(validations).filter(
    (x) => validations?.[x]?.validation
  ).length
  let allCorrect = true
  let firstCorrect = false
  for (const [index, id] of questionIds.entries()) {
    const evaluationId = `${itemId}_${id}`
    const answer = answers[id]
    if (validations && validations[id]) {
      const validation = replaceVariables(validations[id], [], false)
      const { type } = validations[id]
      const evaluator = evaluators[validation.type]
      if (!evaluator) {
        results[evaluationId] = []
      } else {
        const validationData = itemLevelScoring
          ? produce(validation.validation, (v) => {
              const questionScore = itemLevelScore / numberOfQuestions
              set(v, 'validResponse.score', questionScore)
              if (Array.isArray(v.altResponses) && numberOfQuestions > 1) {
                v.altResponses.forEach((altResp) => {
                  altResp.score = questionScore
                })
              }
            })
          : validation.validation
        const { evaluation, score = 0, maxScore } = await evaluator(
          {
            userResponse: answer,
            hasGroupResponses: validation.hasGroupResponses,
            validation: validationData,
            template: validation.template,
            questionId: id,
          },
          type
        )

        const isCorrect = score === maxScore
        if (allCorrect) {
          allCorrect = isCorrect
        }
        if (itemGradingType === FIRST_CORRECT_MUST && index === 0) {
          firstCorrect = isCorrect
        }
        // console.log('current id', id, {
        //   evaluation,
        //   score,
        //   maxScore,
        //   itemGradingType,
        //   firstCorrect,
        // })
        results[evaluationId] = evaluation
        if (itemLevelScoring) {
          totalScore += round(score, 2)
        } else {
          totalScore += score
        }

        if (!itemLevelScoring) {
          totalMaxScore += maxScore
        }
      }
    } else {
      results[evaluationId] = []
    }
  }
  // console.info({ results, firstCorrect })
  if (itemLevelScoring) {
    let achievedScore = min([
      itemLevelScore,
      allCorrect ? itemLevelScore : totalScore,
    ])
    if (itemGradingType === FIRST_CORRECT_MUST && !firstCorrect) {
      achievedScore = 0
    }

    return {
      evaluation: results,
      maxScore: itemLevelScore,
      score: achievedScore,
    }
  }

  if (itemGradingType === FIRST_CORRECT_MUST && !firstCorrect) {
    totalScore = 0
  }

  return { evaluation: results, maxScore: totalMaxScore, score: totalScore }
}
