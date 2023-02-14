export const selectedPerformanceBand = [
  {
    color: '#60B14F',
    threshold: 70,
    name: 'Proficient',
  },
  {
    color: '#EBDD54',
    threshold: 50,
    name: 'Basic',
  },
  {
    color: '#EF9202',
    threshold: 0,
    name: 'Below Basic',
  },
]

export const tableFilters = {
  compareBy: { key: 'class', title: 'Class' },
  analyseBy: { key: 'score', title: 'Score %' },
  preBandScore: '',
  postBandScore: '',
}

export const preTestName = 'Pre Assessment'
export const postTestName = 'Post Assessment'
export const totalStudentCount = 5

export const summary = {
  preTestAverageScore: 2,
  preTestMaxScore: 4,
  postTestAverageScore: 4,
  postTestMaxScore: 4,
}

export const summaryMetricInfo = [
  {
    preBandScore: 50,
    postBandScore: 70,
    totalStudentCount: '5',
    preTestMaxScore: 2,
    postTestMaxScore: 2,
    preTestScore: 1.2,
    postTestScore: 2,
  },
]

export const tableData = [
  {
    compareByColumnTitle: 'class-pre',
    className: 'class-pre',
    studentsCount: 5,
    preTestName: 'PreVsPostTest1',
    postTestName: 'PreVsPostTest2',
    preAvgScorePercentage: 60,
    postAvgScorePercentage: 100,
    preAvgScore: 1.2,
    postAvgScore: 2,
    preBand: {
      color: '#EBDD54',
      name: 'Basic',
    },
    postBand: {
      color: '#60B14F',
      name: 'Proficient',
    },
    preBandProfile: {
      Proficient: 0,
      Basic: 1,
      'Below Basic': 0,
    },
    postBandProfile: {
      Proficient: 1,
      Basic: 0,
      'Below Basic': 0,
    },
  },
]

export const compareByStudentTableData = [
  {
    compareByColumnTitle: 'student2',
    firstName: 'student2',
    lastName: '',
    schoolName: 'El Dorado Adventist School',
    teacherName: 'Laura Bush',
    className: 'class-pre',
    studentId: '63de0fc17aa40474126c4689',
    studentsCount: 1,
    preTestName: 'PreVsPostTest1',
    postTestName: 'PreVsPostTest2',
    preAvgScorePercentage: 60,
    postAvgScorePercentage: 100,
    preAvgScore: 1.2,
    postAvgScore: 2,
    preBand: {
      color: '#EBDD54',
      name: 'Basic',
    },
    postBand: {
      color: '#60B14F',
      name: 'Proficient',
    },
    preBandProfile: {
      Proficient: 0,
      Basic: 1,
      'Below Basic': 0,
    },
    postBandProfile: {
      Proficient: 1,
      Basic: 0,
      'Below Basic': 0,
    },
  },
]
