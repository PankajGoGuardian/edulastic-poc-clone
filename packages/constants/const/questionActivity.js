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
  { title: 'Zero Point', value: 'unscoredItems', countValue: 'unscoredItems' },
  { title: 'Not Graded', value: 'notGraded', countValue: 'notGradedNumber' },
]
const surveyStatusOptions = [
  { title: 'All', value: null, countValue: 'totalNumber' },
  { title: 'Skipped', value: 'skipped', countValue: 'skippedNumber' },
  { title: 'Attempted', value: 'attempted', countValue: 'attemptedNumber' },
]

module.exports = {
  questionStatusOptions,
  surveyStatusOptions,
}
