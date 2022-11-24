import { set, round, min, cloneDeep, isEmpty, get } from 'lodash'
import {
  multipartEvaluationTypes,
  PARTIAL_MATCH,
} from '@edulastic/constants/const/evaluationType'
import {
  manuallyGradableQn,
  PASSAGE,
  EXPRESSION_MULTIPART,
} from '@edulastic/constants/const/questionType'

import { MathKeyboard, notification } from '@edulastic/common'

import evaluator from './evaluators'
import { replaceVariables } from '../../../assessment/utils/variables'

const { FIRST_CORRECT_MUST, ALL_CORRECT_MUST } = multipartEvaluationTypes

export const getMathUnits = (item) => {
  if (!item.isMath || !item.isUnits) {
    return ''
  }

  if (item?.keypadMode === 'custom') {
    return (item?.customUnits || '').split(',')
  }

  const customKeys = get(item, 'customKeys', [])
  const symbol = item.showDropdown
    ? item.keypadMode // dropdown mode
    : get(item, 'symbols', [])[0] // keypad mode

  return MathKeyboard.KEYBOARD_BUTTONS.filter((btn) =>
    btn.types.includes(symbol)
  )
    .map((btn) => btn.handler)
    .concat(customKeys)
    .filter((x) => x)
}

export const getClozeMathUnits = (item) => {
  const mathUnitsResponses = get(item, 'responseIds.mathUnits', [])
  const mathUnitInputs = get(
    item,
    'validation.validResponse.mathUnits.value',
    []
  )

  return mathUnitInputs
    .map(({ id }) => {
      const matched = mathUnitsResponses.find((r) => r.id === id)
      if (matched) {
        const { keypadMode, customUnits } = matched
        if (keypadMode === 'custom') {
          return {
            id,
            units: (customUnits || '').split(','),
          }
        }
        return {
          id,
          units: MathKeyboard.KEYBOARD_BUTTONS.filter((btn) =>
            btn.types.includes(keypadMode)
          )
            .map((btn) => btn.handler)
            .filter((x) => x),
        }
      }
      return null
    })
    .filter((x) => x)
}

export const evaluateItem = async (
  answers,
  validations,
  itemLevelScoring = false,
  newScore,
  itemScore = 0,
  itemId = '',
  itemGradingType,
  assignPartialCredit,
  testSettings = {}
) => {
  const questionIds = Object.keys(validations)
  const results = {}
  const errors = new Set()
  let totalScore = 0
  const itemLevelScore = newScore || itemScore
  let totalMaxScore = itemLevelScoring ? itemLevelScore : 0
  const numberOfQuestions = Object.keys(validations).filter(
    (x) => validations?.[x]?.validation
  ).length
  let allCorrect = true
  let firstCorrect = false
  for (const [index, id] of questionIds.entries()) {
    const evaluationId = `${itemId}_${id}`
    const answer = answers[id]
    /**
     * @see https://snapwiz.atlassian.net/browse/EV-28137
     * calculate maxScore upfront as evaluation request is not sent for empty user response
     * exclude passage item score from being added to maxScore
     */
    if (!itemLevelScoring && validations && validations[id]?.type !== PASSAGE) {
      totalMaxScore += validations[id]?.validation?.validResponse?.score || 0
    }
    if (validations && validations[id] && !isEmpty(answer)) {
      const validation = replaceVariables(validations[id], [], false)
      const { type } = validations[id]
      if (!evaluator) {
        results[evaluationId] = []
        allCorrect = false
      } else {
        const validationData = cloneDeep(validation.validation)
        if (itemLevelScoring) {
          const questionScore = itemLevelScore / numberOfQuestions
          set(validationData, 'validResponse.score', questionScore)
          if (
            Array.isArray(validationData.altResponses) &&
            numberOfQuestions > 1
          ) {
            validationData.altResponses.forEach((altResp) => {
              altResp.score = questionScore
            })
          }
        }
        if (assignPartialCredit) {
          validationData.scoringType = PARTIAL_MATCH
        }

        const payload = {
          userResponse: answer,
          hasGroupResponses: validation.hasGroupResponses,
          validation: validationData,
          template: validation.template,
          questionId: id,
          testSettings,
        }
        if (validation.isUnits && validation.isMath) {
          payload.isUnitAllowedUnits = getMathUnits(validation)
        } else if (validation.type === EXPRESSION_MULTIPART) {
          payload.isUnitAllowedUnits = getClozeMathUnits(validation)
        }

        const {
          evaluation,
          score = 0,
          maxScore,
          errors: _errors,
        } = await evaluator(payload, type)

        if (Array.isArray(_errors)) {
          const addError = (e) => errors.add(e)
          _errors.forEach(addError)
        }

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
      }
    } else {
      results[evaluationId] = []
      allCorrect = false
    }
  }

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
    if (newScore) {
      achievedScore *= newScore / itemScore
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

  if (errors.size) {
    const showNotificationForError = (err) =>
      notification({
        type: 'error',
        duration: 0,
        msg: err,
        exact: true,
      })
    Array.from(errors).forEach(showNotificationForError)
  }
  if (newScore) {
    totalScore *= newScore / totalMaxScore
    totalMaxScore *= newScore / totalMaxScore
  }
  return { evaluation: results, maxScore: totalMaxScore, score: totalScore }
}
