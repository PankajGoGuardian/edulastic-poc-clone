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
    Recall: { value: 'Factual', text: '1 - Recall' },
    'Skill/Concept': { value: 'Conceptual', text: '2 - Skill/Concept' },
    'Strategic Thinking': {
      value: 'Critical thinking',
      text: '3 - Strategic Thinking',
    },
    'Extended Thinking': {
      value: 'Creative questions',
      text: '4 - Extended Thinking',
    },
  },
  IR_MCQ_LABEL_SELECTOR: 'mcqLabelImmersiveReader',
  IR_CONTENT_SELECTOR: 'immersive-reader-content',
}
