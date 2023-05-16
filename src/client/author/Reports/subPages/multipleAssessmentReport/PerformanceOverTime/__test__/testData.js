export const settings = {
  requestFilters: {
    termId: '6241caa403b18c0009a66c70',
    testSubjects: '',
    testGrades: '',
    tagIds: '',
    assessmentTypes: '',
    testIds: '',
    subjects: '',
    grades: '',
    courseId: '',
    classIds: '',
    groupIds: '',
    profileId: '6241caa403b18c0009a66c6d',
    assignedBy: 'anyone',
  },
  tagsData: {
    termId: {
      key: '6241caa403b18c0009a66c70',
      title: '2022-23',
    },
    testSubjects: [],
    testGrades: [],
    assessmentTypes: [],
    subjects: [],
    grades: [],
    profileId: {
      key: '6241caa403b18c0009a66c6d',
      title: 'Standard Performance Band',
    },
    assignedBy: {
      key: 'anyone',
      title: 'Anyone',
    },
  },
}

export const MARFilterData = {
  data: {
    result: {
      testTypes: [
        {
          key: 'common assessment',
          title: 'Common Assessment',
        },
        {
          key: 'assessment',
          title: 'Class Assessment',
        },
        {
          key: 'practice',
          title: 'Practice Assessment',
        },
        {
          key: 'homework',
          title: 'Homework',
        },
        {
          key: 'quiz',
          title: 'Quiz',
        },
      ],
      bandInfo: [
        {
          _id: '6241caa403b18c0009a66c6d',
          orgType: 'district',
          orgId: '6241caa403b18c0009a66c6a',
          name: 'Standard Performance Band',
          performanceBand: [
            {
              color: '#60B14F',
              threshold: 70,
              aboveStandard: 1,
              name: 'Proficient',
            },
            {
              color: '#EBDD54',
              threshold: 50,
              aboveStandard: 1,
              name: 'Basic',
            },
            {
              color: '#EF9202',
              threshold: 0,
              aboveStandard: 0,
              name: 'Below Basic',
            },
          ],
        },
      ],
      demographics: [
        {
          key: 'race',
          title: 'Race',
          data: [
            {
              key: 'all',
              title: 'All',
            },
          ],
        },
        {
          key: 'gender',
          title: 'Gender',
          data: [
            {
              key: 'all',
              title: 'All',
            },
          ],
        },
        {
          key: 'iepStatus',
          title: 'Iep Status',
          data: [
            {
              key: 'all',
              title: 'All',
            },
          ],
        },
        {
          key: 'frlStatus',
          title: 'Frl Status',
          data: [
            {
              key: 'all',
              title: 'All',
            },
          ],
        },
        {
          key: 'ellStatus',
          title: 'Ell Status',
          data: [
            {
              key: 'all',
              title: 'All',
            },
          ],
        },
        {
          key: 'hispanicEthnicity',
          title: 'Hispanic Ethnicity',
          data: [
            {
              key: 'all',
              title: 'All',
            },
          ],
        },
      ],
    },
  },
}

export const performanceOverTime = {
  data: {
    result: {
      metricInfo: [
        {
          maxPossibleScore: 6,
          totalScore: 1,
          minScore: 1,
          maxScore: 1,
          assessmentDate: '1658224247208',
          testId: '62d681c4a1f9d3000a03df4e',
          testName: 'test add',
          totalTestItems: 6,
          totalAssigned: '1',
          testType: 'assessment',
          totalAbsent: '0',
          totalGraded: '1',
          aboveStandard: '0',
          bandScore: '0',
        },
      ],
      testsCount: 1,
      incompleteTests: ['62d681c4a1f9d3000a03df4e'],
    },
  },
}

export const dataSource = [
  {
    maxScore: 1,
    minScore: 1,
    maxPossibleScore: 6,
    totalAbsent: 0,
    totalGraded: 1,
    diffScore: 83,
    testId: '62d681c4a1f9d3000a03df4e',
    testName: 'test add',
    totalTestItems: 6,
    uniqId: '62d681c4a1f9d3000a03df4eassessment',
    testType: 'Class Assessment',
    assessmentDate: '1658224247208',
    assessmentDateFormatted: 'Jul 19, 2022',
    totalAssigned: 1,
    totalScore: 1,
    totalMaxScore: 6,
    score: 17,
    rawScore: 1,
    records: [
      {
        maxPossibleScore: 6,
        totalScore: 1,
        minScore: 1,
        maxScore: 1,
        assessmentDate: '1658224247208',
        testId: '62d681c4a1f9d3000a03df4e',
        testName: 'test add',
        totalTestItems: 6,
        totalAssigned: '1',
        testType: 'assessment',
        totalAbsent: '0',
        totalGraded: '1',
        aboveStandard: '0',
        bandScore: '0',
        bandName: 'Below Basic',
      },
    ],
    isIncomplete: true,
  },
]

export const backendPagination = {
  page: 1,
  pageSize: 10,
  itemsCount: 1,
}
