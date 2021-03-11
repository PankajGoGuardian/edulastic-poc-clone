export const Types = {
  WIDGET: 'widget',
}

// TODO move these constants to @edulastic/constants
export const ITEM_SCORING_TYPE = 'itemScoringType'
export const ITEM_GRADING_TYPE = 'itemGradingType'
export const PART_SCORING_TYPE = 'partScoringType'

export const multipartEvaluationSettings = {
  [ITEM_SCORING_TYPE]: ['itemLevelScoring', 'partLevelScoring'],
  [ITEM_GRADING_TYPE]: ['allCorrectMust', 'firstCorrectMust', 'anyCorrect'],
  [PART_SCORING_TYPE]: ['assignPartialCredit']
}
