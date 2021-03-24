import { set, round, min } from 'lodash'
import produce from 'immer'
import {
  multipartEvaluationTypes,
  PARTIAL_MATCH,
} from '@edulastic/constants/const/evaluationType'
import { manuallyGradableQn } from '@edulastic/constants/const/questionType'

import evaluators from './evaluators'
import { replaceVariables } from '../../../assessment/utils/variables'

const { FIRST_CORRECT_MUST, ALL_CORRECT_MUST } = multipartEvaluationTypes

export const evaluateItem = async (
  answers,
  validations,
  itemLevelScoring = false,
  itemLevelScore = 0,
  itemId = '',
  itemGradingType,
  assignPartialCredit
) => {
  const questionIds = Object.keys(validations)
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
        allCorrect = false
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
        if (assignPartialCredit) {
          validationData.scoringType = PARTIAL_MATCH
        }
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
        // manually gradeable should not account for all correct
        if (allCorrect && !manuallyGradableQn.includes(type)) {
          allCorrect = isCorrect
        }
        if (index === 0) {
          firstCorrect = isCorrect
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
      allCorrect = false
    }
  }
  console.info({
    answers,
    results,
    firstCorrect,
    allCorrect,
    itemGradingType,
    assignPartialCredit,
  })
  if (itemLevelScoring) {
    let achievedScore = min([
      itemLevelScore,
      allCorrect ? itemLevelScore : totalScore,
    ])
    if (itemGradingType === FIRST_CORRECT_MUST && !firstCorrect) {
      achievedScore = 0
    } else if (itemGradingType === ALL_CORRECT_MUST) {
      if (Object.keys(answers).length === 0 || !allCorrect) {
        achievedScore = 0
      }
    }

    return {
      evaluation: results,
      maxScore: itemLevelScore,
      score: achievedScore,
    }
  }

  if (itemGradingType === FIRST_CORRECT_MUST && !firstCorrect) {
    totalScore = 0
  } else if (itemGradingType === ALL_CORRECT_MUST) {
    if (Object.keys(answers).length === 0 || !allCorrect) {
      totalScore = 0
    }
  }

  return { evaluation: results, maxScore: totalMaxScore, score: totalScore }
}
