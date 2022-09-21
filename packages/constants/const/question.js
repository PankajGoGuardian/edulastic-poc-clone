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
  sectionLabelType: 'sectionLabel',
  EMPTY_ANSWER: 'EDULASTIC_EMPTY_CORRECT_ANSWER',
  allDepthOfKnowledgeMap: {
    '': { value: '', text: 'Not Specified' },
    Recall: { value: 'Recall', text: '1 - Recall' },
    'Skill/Concept': { value: 'Skill/Concept', text: '2 - Skill/Concept' },
    'Strategic Thinking': {
      value: 'Strategic Thinking',
      text: '3 - Strategic Thinking',
    },
    'Extended Thinking': {
      value: 'Extended Thinking',
      text: '4 - Extended Thinking',
    },
  },
}
