export const storeData = {
  user: {
    user: {
      features: {},
    },
  },
  reportReducer: {
    reportResponseFrequencyReducer: {
      responseFrequency: {
        metrics: {
          32829: {
            options: [],
            validation: [],
            qType: 'Math, Text & Dropdown',
            qLabel: 'Q2',
            standards: ['-'],
            resp_cnts: {},
            corr_cnt: 1,
            skip_cnt: 1,
            part_cnt: 0,
            incorr_cnt: 0,
            groupId: '632bcfc9e7d06d0009059cbd',
            assignmentId: '632bd0b912530a0009a88b67',
            maxScore: 1,
            total_score: 1,
            total_max_score: 2,
          },
          34244: {
            options: [],
            validation: [],
            qType: 'Choice matrix - standard',
            qLabel: 'Q1',
            standards: ['-'],
            resp_cnts: {},
            corr_cnt: 2,
            skip_cnt: 0,
            part_cnt: 0,
            incorr_cnt: 0,
            groupId: '632bcfc9e7d06d0009059cbd',
            assignmentId: '632bd0b912530a0009a88b67',
            maxScore: 1,
            total_score: 2,
            total_max_score: 2,
          },
        },
        meta: {},
      },
      loading: false,
    },
    reports: {
      isCsvDownloading: false,
    },
  },
}

export const tableColumns = [
  {
    title: 'Q#',
    dataIndex: 'qLabel',
    key: 'qLabel',
    fixed: 'left',
    width: 50,
  },
  {
    title: 'Question Type',
    dataIndex: 'qType',
    key: 'qType',
    width: 150,
    align: 'left',
  },
  {
    title: 'Standards',
    dataIndex: 'standards',
    key: 'standards',
    width: 150,
  },
  {
    title: 'Max Score',
    dataIndex: 'maxScore',
    key: 'maxScore',
    width: 50,
  },
  {
    title: 'Performance %',
    dataIndex: 'total_score',
    key: 'total_score',
    width: 100,
  },
  {
    title: 'Skip %',
    dataIndex: 'skip_cnt',
    key: 'skip_cnt',
    width: 70,
  },
  {
    title: 'Response',
    dataIndex: 'resp_cnts',
    key: 'resp_cnts',
    width: 400,
  },
]

export const tableData = [
  {
    options: [],
    validation: [],
    qType: 'Math, Text & Dropdown',
    qLabel: 'Q2',
    standards: ['-'],
    resp_cnts: {},
    corr_cnt: 1,
    skip_cnt: 1,
    part_cnt: 0,
    incorr_cnt: 0,
    groupId: '632bcfc9e7d06d0009059cbd',
    assignmentId: '632bd0b912530a0009a88b67',
    maxScore: 1,
    total_score: 1,
    total_max_score: 2,
    uid: '32829',
  },
]

export const settings = {
  selectedTest: {
    key: '632bcdae8de8ae000a0324a1',
    title: 'test',
  },
  requestFilters: {
    termId: '62727a9911af9a0009c02f05',
    testGrades: '',
    testSubjects: '',
    tagIds: '',
    assessmentTypes: 'assessment',
    grades: '',
    subjects: '',
    courseId: '',
    classIds: '',
    groupIds: '',
    standardsProficiencyProfile: '',
    performanceBandProfile: '',
    assignedBy: 'anyone',
    profileId: '',
  },
  tagsData: {
    termId: {
      key: '62727a9911af9a0009c02f05',
      title: '2022-23',
    },
    testGrades: [],
    testSubjects: [],
    assessmentTypes: [
      {
        key: 'assessment',
        title: 'Class Assessment',
      },
    ],
    grades: [],
    subjects: [],
    standardsProficiencyProfile: {
      key: '5dce67dac9607d00070ad88c',
      title: 'Standard Mastery - Da default',
    },
    performanceBandProfile: {
      key: '5ffd3c79234e5800085e8b38',
      title: 'Karthik1',
    },
    assignedBy: {
      key: 'anyone',
      title: 'Anyone',
    },
    testId: {
      key: '632bcdae8de8ae000a0324a1',
      title: 'test',
    },
  },
  reportType: '',
}
