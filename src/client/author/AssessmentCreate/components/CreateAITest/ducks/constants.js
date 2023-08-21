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

export { formFields, STATUS }
