const colorConstants = require('./colors')

const S3_DATA_WAREHOUSE_FOLDER =
  process.env.REACT_APP_AWS_S3_DATA_WAREHOUSE_FOLDER

const achievementLevelsGrouped = [
  {
    testTitles: [
      'Smarter Balanced Summative for ELA',
      'Smarter Balanced Summative for Mathematics',
      'California Science Test (CAST)',
    ],
    data: [
      { id: '9', name: 'No score' },

      { id: '1', name: 'Standard Not Met' },
      { id: '2', name: 'Standard Nearly Met' },
      { id: '3', name: 'Standard Met' },
      { id: '4', name: 'Standard Exceeded' },
    ],
  },
  {
    testTitles: [
      'CAA for ELA',
      'CAA for Mathematics',
      'CAA for Science',
      'California Spanish Assessment', // waiting approval: read field 150 in https://www.caaspp.org/rsc/pdfs/CAASPP.student_data_layout.2022.pdf
    ],
    data: [
      { id: '9', name: 'No score' },

      { id: '1', name: 'Level 1' },
      { id: '2', name: 'Level 2' },
      { id: '3', name: 'Level 3' },
    ],
  },
]

const getAchievementLevels = (testTitle) => {
  let result = [
    { id: '9', name: 'No score' },

    { id: '1', name: 'Level 1' },
    { id: '2', name: 'Level 2' },
    { id: '3', name: 'Level 3' },
    { id: '4', name: 'Level 4' },
  ]
  for (const achievementLevelsGroup of achievementLevelsGrouped) {
    if (achievementLevelsGroup.testTitles.includes(testTitle)) {
      result = achievementLevelsGroup.data
      break
    }
  }
  result = result.map((r, i) => ({
    ...r,
    testTitle,
    color: colorConstants.externalPerformanceBandColors[i],
  }))
  return result
}

module.exports = {
  S3_DATA_WAREHOUSE_FOLDER,
  getAchievementLevels,
}
