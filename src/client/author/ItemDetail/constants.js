export const Types = {
  WIDGET: 'widget',
}

// TODO move these constants to @edulastic/constants
export const ITEM_SCORING_TYPE = 'itemScoringType'
export const ITEM_GRADING_TYPE = 'itemGradingType'
export const PART_SCORING_TYPE = 'partScoringType'
export const ALL_CORRECT_MUST = 'allCorrectMust'
export const FIRST_CORRECT_MUST = 'firstCorrectMust'
export const ANY_CORRECT = 'anyCorrect'

export const multipartEvaluationSettings = {
  [ITEM_SCORING_TYPE]: ['itemLevelScoring', 'partLevelScoring'],
  [ITEM_GRADING_TYPE]: [ALL_CORRECT_MUST, FIRST_CORRECT_MUST, ANY_CORRECT],
  [PART_SCORING_TYPE]: ['assignPartialCredit'],
}
