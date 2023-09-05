const formFields = {
  TEST_NAME: 'testName',
  ITEM_TYPE: 'itemType',
  NUMBER_OF_ITEMS: 'numberOfItems',
  SUBJECT: 'subject',
  GRADES: 'grades',
  DOK: 'dok',
  DIFFICULTY: 'difficulty',
  PREFERENCE: 'preference',
}

const STATUS = {
  INIT: 'init',
  INPROGRESS: 'inprogress',
  FAILED: 'failed',
  SUCCESS: 'success',
}

const Q_TYPES = {
  MCQ_TF: 'MCQ_TF', // mcq true and false question
  MCQ_MS: 'MCQ_MS', // mcq multiple select question
  MCQ_ST: 'MCQ_ST', // mcq multiple choice standard
}

const STATUS_TEXT = {
  [STATUS.INIT]: 'Initialized',
  [STATUS.INPROGRESS]: 'In progress',
  [STATUS.FAILED]: 'Failed',
  [STATUS.SUCCESS]: 'Success',
}

export const itemStructure = {
  _id: 'new',
  rows: [
    {
      tabs: [],
      dimension: '100%',
      widgets: [],
      flowLayout: false,
      content: '',
    },
  ],
  columns: [],
  tags: [],
  status: 'draft',
  createdBy: {},
  maxScore: 1,
  active: 1,
  grades: [],
  subjects: [],
  standards: [],
  curriculums: [],
  data: {
    questions: [],
    resources: [],
  },
  itemLevelScoring: true,
  itemLevelScore: 1,
  analytics: [
    {
      usage: 0,
      likes: 0,
    },
  ],
  multipartItem: false,
  isPassageWithQuestions: false,
  canAddMultipleItems: false,
  unsavedItem: true,
  aiGenerated: true,
}

const itemFields = [
  'v1Id',
  'v1Attributes',
  'uuid',
  'computedDifficulty',
  'externalContentId',
  'rows',
  'columns',
  'tags',
  'metadata',
  'data',
  'isDocBased',
  'maxScore',
  'collections',
  'scrolling',
  'verticalDivider',
  'status',
  'version',
  'active',
  'grades',
  'subjects',
  'standards',
  'curriculums',
  'createdBy',
  'versionId',
  'itemLevelScoring',
  'itemLevelScore',
  'multipartItem',
  'isPassageWithQuestions',
  'canAddMultipleItems',
  'passageId',
  'authors',
  'analytics',
  'cw',
  'mVersion',
  'derivedFromId',
  'language',
  'itemGradingType',
  'assignPartialCredit',
  'derivedFromPremiumBankId',
  'aiGenerated',
]

export { formFields, STATUS, itemFields, STATUS_TEXT, Q_TYPES }
