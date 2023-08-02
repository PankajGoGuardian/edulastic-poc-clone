const formFields = {
  testName: 'testName',
  itemTypes: 'itemTypes',
  numberOfItems: 'numberOfItems',
  subjects: 'subjects',
  grades: 'grades',
  dok: 'dok',
  difficulty: 'difficulty',
  description: 'description',
}

const STATUS = {
  INIT: 'init',
  INPROGRESS: 'inprogress',
  FAILED: 'failed',
  DRAFT: 'draft',
  SUCCESS: 'success',
  SAVED: 'saved',
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
  aiGenerated: true,
}

export { formFields, STATUS }
