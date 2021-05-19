const questionStatusOptions = [
  { title: 'All', value: null, countValue: 'totalNumber' },
  { title: 'Correct', value: 'correct', countValue: 'correctNumber' },
  { title: 'Incorrect', value: 'wrong', countValue: 'wrongNumber' },
  {
    title: 'Partially Correct',
    value: 'partial',
    countValue: 'partiallyCorrectNumber',
  },
  { title: 'Skipped', value: 'skipped', countValue: 'skippedNumber' },
  { title: 'Unscored', value: 'unscoredItems', countValue: 'unscoredItems' },
  { title: 'Not Graded', value: 'notGraded', countValue: 'notGradedNumber' },
]

module.exports = {
  questionStatusOptions,
}
