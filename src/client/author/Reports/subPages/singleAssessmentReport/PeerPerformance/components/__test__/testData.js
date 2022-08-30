export const initialState = {
  reportReducer: {
    reportPeerPerformanceReducer: {
      peerPerformance: {
        meta: {
          test: {
            _id: 'id',
            title: 'title',
          },
        },
        districtAvg: 0,
        districtAvgPerf: 0,
        metaInfo: [],
        metricInfo: [],
      },
    },
    reports: {
      isPrinting: false,
    },
  },
}

export const bandInfo = [
  {
    color: '#60B14F',
    threshold: 71,
    aboveStandard: 1,
    name: 'Proficient',
  },
]

//  for peerPerformance.spec.js
export const metricInfo = [
  {
    ellStatus: '',
    frlStatus: '',
    gender: '',
    groupId: '61122f057a71150009318dc9',
    groupName: 'class_new1',
    groupType: 'class',
    hispanicEthnicity: '',
    iepStatus: '',
    maxScore: 6,
    progressStatus: 1,
    race: '',
    schoolId: '5f44e0ba2b31310008d6f6c9',
    schoolName: 'Vinay School',
    studentId: '61122f1038b58c0009d3830e',
    teacherId: '6112266d7d73fd000956edc0',
    teacherName: 'smvuat ',
    totalScore: 6,
  },
]

export const settings = {
  selectedTest: {
    key: '62c6bdc719502e00095185f0',
    title: 'Edit test SA-cloned-07/07/2022 16:34',
  },
  requestFilters: {
    termId: '5f3f9bab463c8800087ecb77',
    assignedBy: 'anyone',
    assessmentTypes: 'common assessment',
  },
  tagsData: {
    termId: {
      key: '5f3f9bab463c8800087ecb77',
      title: '2021-2022',
    },
    assessmentTypes: [
      {
        key: 'common assessment',
        title: 'Common Assessment',
      },
    ],
    assignedBy: {
      key: 'anyone',
      title: 'Anyone',
    },
    grades: [],
    performanceBandProfile: {
      key: '61d70279b82b9d00092de164',
      title: 'alok per#2',
    },
    standardsProficiencyProfile: {
      key: '5dce67dac9607d00070ad88c',
      title: 'Standard Mastery - Da default',
    },
    subjects: [],
    testGrades: [],
    testId: {
      key: '62b30bcdbbe54e00091bb6a6',
      title: 'clone lcb',
    },
    testSubjects: [],
  },
}

export const filters = {
  ellStatus: 'all',
  frlStatus: 'all',
  gender: 'all',
  hispanicEthnicity: 'all',
  iepStatus: 'all',
  race: 'all',
}

// for peerPerformanceTable.spec.js
export const dataSource = [
  {
    absent: 0,
    avgStudentScorePercent: 0,
    avgStudentScorePercentUnrounded: 0,
    className: 'New 2021 class',
    compareBy: 'schoolId',
    compareBylabel: 'Vinay School',
    correct: 0,
    dFill: 'hsla(0, 100%, 79%, 1)',
    districtAvg: 0,
    fill: 'hsla(0, 100%, 79%, 1)',
    graded: 1,
    incorrect: 100,
    schoolId: '5f44e0ba2b31310008d6f6c9',
    schoolName: 'Vinay School',
    teacherName: 'Vinay Teacher',
    totalMaxScore: 1,
    totalTotalScore: 0,
  },
]

export const columns = [
  {
    align: 'left',
    dataIndex: 'compareBylabel',
    fixed: undefined,
    key: 'compareBylabel',
    title: 'School',
    width: 250,
  },
  {
    align: undefined,
    dataIndex: 'graded',
    fixed: undefined,
    key: 'graded',
    title: '#Submitted',
    width: 70,
  },
  {
    align: undefined,
    dataIndex: 'absent',
    fixed: undefined,
    key: 'absent',
    title: '#Absent',
    width: 70,
  },
  {
    align: undefined,
    dataIndex: 'districtAvg',
    fixed: undefined,
    key: 'districtAvg',
    title: 'District(Score%)',
    width: 250,
  },
  {
    align: undefined,
    dataIndex: 'avgStudentScorePercentUnrounded',
    fixed: undefined,
    key: 'avgStudentScorePercentUnrounded',
    title: 'Avg.Student(Score%)',
    width: 250,
  },
]

// for signedStackedBarChartContainer.spec.js
export const dataSignedStackedBarChartContainer = [
  {
    aboveStandard: 0,
    aboveStandardPercentage: 0,
    absent: 0,
    belowStandard: 3,
    belowStandardPercentage: -100,
    className: '2021-2022 Class#04',
    compareBy: 'schoolId',
    compareBylabel: 'Karthik Agani School',
    districtAvg: 0,
    fill_0: 'hsla(100, 100%, 79%, 1)',
    fill_1: 'hsla(0, 100%, 79%, 1)',
    graded: 3,
    schoolId: '5f71c14478e86d0007b09b46',
    schoolName: 'Karthik Agani School',
    teacherName: 'Karthik Agani',
    total: 3,
  },
]

// for simpleStackedBarChartContainer.js
export const dataSimpleStackedBarChartContainer = [
  {
    absent: 0,
    avgStudentScorePercent: 0,
    avgStudentScorePercentUnrounded: 0,
    className: 'New 2021 class',
    compareBy: 'schoolId',
    compareBylabel: 'Vinay School',
    correct: 0,
    dFill: 'hsla(0, 100%, 79%, 1)',
    districtAvg: 0,
    fill: 'hsla(0, 100%, 79%, 1)',
    graded: 1,
    incorrect: 100,
    schoolId: '5f44e0ba2b31310008d6f6c9',
    schoolName: 'Vinay School',
    teacherName: 'Vinay Teacher',
    totalMaxScore: 1,
    totalTotalScore: 0,
  },
]
