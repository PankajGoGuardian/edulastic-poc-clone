export const reportChartData = {
  data: [
    {
      criteriaId: 'bd1aad9e-dd68-48d3-a5b6-ca6c30e74bbf',
      responsesByRating: {
        '41cffb94-2e24-4862-8d1c-473cf8d69673': 4,
        'cf7d618c-7bcc-4adc-852f-23f74c8c7a4f': 1,
        'bec8f8d8-baed-42e2-bbb9-88b40e61f424': 1,
        '1d5a49a9-e69d-4f4e-894a-c6edf3143c4a': 1,
      },
    },
  ],
}

export const rubric = {
  _id: '636cb286e0cf7700081f4d18',
  name: 'Speaking and Listening Rubric',
  description: '',
  criteria: [
    {
      name: 'Content',
      id: 'bd1aad9e-dd68-48d3-a5b6-ca6c30e74bbf',
      ratings: [
        {
          name: 'Content Not Good',
          desc: '',
          id: 'dc0e4122-c694-4ac2-aebd-6bab9fa1bb52',
          points: 1,
        },
        {
          name: 'Content Acceptable',
          desc: '',
          id: 'a112ad7e-c816-427c-85c0-bf61108538cc',
          points: 2,
        },
        {
          name: 'Content Excellent',
          desc: '',
          id: '642b1687-eb67-40dc-bf0e-5931c525b5c2',
          points: 3,
        },
      ],
    },
  ],
}

export const reportTableData = {
  data: [
    {
      criteriaId: 'bd1aad9e-dd68-48d3-a5b6-ca6c30e74bbf',
      scoreGrouped: {
        '62bbe6d553288a00096f8c4c': 3.142857142857143,
      },
      countGrouped: {
        '62bbe6d553288a00096f8c4c': 7,
      },
    },
  ],
  compareByNames: {
    '62bbe6d553288a00096f8c4c': 'Fanta Ione',
  },
  rubric,
}

export const tableData = [
  {
    rowName: 'Fanta School01',
    rowId: '62bbe73738cd4d0009ffd740',
    averageRatingPoints: 3.5,
    totalResponses: 2,
    maxRubricPoints: 9,
    averageRatingPercPoints: 39,
    'bd1aad9e-dd68-48d3-a5b6-ca6c30e74bbf': {
      avgScore: 1.5,
      avgScorePercentage: 50,
      maxScore: 3,
      responseCount: 2,
    },
  },
]

export const selectedTableFilters = {
  compareBy: {
    key: 'school',
    title: 'School',
    hiddenFromRole: ['teacher'],
  },
  analyseBy: {
    key: 'score',
    title: 'Score %',
  },
}

export const tableFilterOptions = {
  compareByData: [
    {
      key: 'school',
      title: 'School',
      hiddenFromRole: ['teacher'],
    },
    {
      key: 'teacher',
      title: 'Teacher',
      hiddenFromRole: ['teacher'],
    },
  ],
  analyseByData: [
    {
      key: 'score',
      title: 'Score %',
    },
    {
      key: 'rawScore',
      title: 'Raw Score',
    },
  ],
}

export const settings = {
  requestFilters: {},
  tagsData: {},
}
