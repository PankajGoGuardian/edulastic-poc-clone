import { set, round, min } from 'lodash'
import produce from 'immer'
import evaluators from './evaluators'
import { replaceVariables } from '../../../assessment/utils/variables'

export const evaluateItem = async (
  answers,
  validations,
  itemLevelScoring = false,
  itemLevelScore = 0,
  itemId = ''
) => {
  const questionIds = Object.keys(validations)
  const results = {}
  let totalScore = 0
  let totalMaxScore = itemLevelScoring ? itemLevelScore : 0
  const numberOfQuestions = Object.keys(validations).filter(
    (x) => validations?.[x]?.validation
  ).length
  let allCorrect = true
  for (const id of questionIds) {
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
        if (allCorrect) {
          allCorrect = score === maxScore
        }

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
  if (itemLevelScoring) {
    return {
      evaluation: results,
      maxScore: itemLevelScore,
      score: min([itemLevelScore, allCorrect ? itemLevelScore : totalScore]),
    }
  }
  return { evaluation: results, maxScore: totalMaxScore, score: totalScore }
}
