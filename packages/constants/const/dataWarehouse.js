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

const getCAASPPAchievementLevels = (test) => {
  const { testId, title: testTitle } = test
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
    testId,
    color: colorConstants.externalPerformanceBandColors[i],
    active: test.achievementLevel === r.id,
  }))
  return result
}

const getIReadyAchievementLevels = (test) => {
  const { testId } = test
  const achievementLevel = test.achievementLevel.toLowerCase()
  const isMid = achievementLevel.startsWith('mid')
  const isLate = achievementLevel.startsWith('late')
  const isEarly = achievementLevel.startsWith('early')
  const level = achievementLevel.match(/(?<=level\s+)\w+/)?.[0]
  const levelDiff = (level === 'k' ? 0 : +level) - test.grade
  return [
    {
      testId,
      name: 'Two or More Grade Levels Below',
      active: levelDiff <= -2,
      color: colorConstants.threeBandColors[0],
      id: 'Two or More Grade Levels Below',
    },
    {
      testId,
      name: 'On (Early) Grade Level or One Grade Level Below',
      active: isEarly || levelDiff == -1,
      color: colorConstants.threeBandColors[1],
      id: 'On (Early) Grade Level or One Grade Level Below',
    },
    {
      testId,
      name: 'On (Mid/Late) or Above Grade Level',
      active: isMid || isLate || levelDiff >= 0,
      color: colorConstants.threeBandColors[2],
      id: 'On (Mid/Late) or Above Grade Level',
    },
  ]
}

const getNWEAAchievementLevels = (test) => {
  const { testId } = test
  const score = test.score
  return [
    {
      testId,
      name: 'Low',
      id: 'Low',
      color: colorConstants.fiveBandColors[4],
      active: score < 21,
    },
    {
      testId,
      name: 'LoAvg',
      id: 'LoAvg',
      color: colorConstants.fiveBandColors[3],
      active: score >= 21 && score <= 40,
    },
    {
      testId,
      name: 'Avg',
      id: 'Avg',
      color: colorConstants.fiveBandColors[2],
      active: score >= 41 && score <= 60,
    },
    {
      testId,
      name: 'HiAvg',
      id: 'HiAvg',
      color: colorConstants.fiveBandColors[1],
      active: score >= 61 && score <= 80,
    },
    {
      testId,
      name: 'Hi',
      id: 'Hi',
      color: colorConstants.fiveBandColors[0],
      active: score >= 80,
    },
  ]
}

// order of returned achievementLevels must be worst to best
const getAchievementLevels = (test) => {
  switch (test.externalTestType) {
    case 'CAASPP':
      return getCAASPPAchievementLevels(test)
    case 'NWEA':
      return getNWEAAchievementLevels(test)
    case 'iReady_Math':
    case 'iReady_ELA':
      return getIReadyAchievementLevels(test)
    default:
      throw new Error('Invalid Test Category')
  }
}

module.exports = {
  S3_DATA_WAREHOUSE_FOLDER,
  getAchievementLevels,
}
