const questionType = require('./questionType')

// constants
module.exports = {
  resourceTypeQuestions: [
    questionType.PASSAGE,
    questionType.PROTRACTOR,
    questionType.VIDEO,
    questionType.TEXT,
  ],
  DEFAULT_STIMULUS: '<p>[Click here to view the full content]</p>',
  EMPTY_ANSWER: 'EDULASTIC_EMPTY_CORRECT_ANSWER',
}
