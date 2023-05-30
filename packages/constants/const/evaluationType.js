const EXACT_MATCH = 'exactMatch'
const PARTIAL_MATCH = 'partialMatch'
const PARTIAL_MATCH_V2 = 'partialMatchV2'

const multipartEvaluationTypes = {
  ITEM_SCORING_TYPE: 'itemScoringType',
  ITEM_GRADING_TYPE: 'itemGradingType',
  PART_SCORING_TYPE: 'assignPartialCredit',
  ALL_CORRECT_MUST: 'allCorrectMust',
  FIRST_CORRECT_MUST: 'firstCorrectMust',
  ANY_CORRECT: 'anyCorrect',
}

const AI_EVALUATION_STATUS = {
  PENDING: 'pending',
  FAILED: 'failed',
  DONE: 'done',
}

module.exports = {
  EXACT_MATCH,
  PARTIAL_MATCH,
  PARTIAL_MATCH_V2,
  exactMatch: {
    value: EXACT_MATCH,
    label: 'Exact match',
  },
  partialMatch: {
    value: PARTIAL_MATCH,
    label: 'Partial match',
  },
  partialMatchV2: {
    value: PARTIAL_MATCH_V2,
    label: 'Partial match per response',
  },
  multipartEvaluationTypes,
  multipartEvaluationSettings: {
    [multipartEvaluationTypes.ITEM_SCORING_TYPE]: [
      'itemLevelScoring',
      'partLevelScoring',
    ],
    [multipartEvaluationTypes.ITEM_GRADING_TYPE]: [
      multipartEvaluationTypes.ALL_CORRECT_MUST,
      multipartEvaluationTypes.FIRST_CORRECT_MUST,
      multipartEvaluationTypes.ANY_CORRECT,
    ],
    [multipartEvaluationTypes.PART_SCORING_TYPE]: 'assignPartialCredit',
  },
  AI_EVALUATION_STATUS,
}
