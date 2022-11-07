const { getColorBandBySize } = require('./colors')

const S3_DATA_WAREHOUSE_FOLDER =
  process.env.REACT_APP_AWS_S3_DATA_WAREHOUSE_FOLDER

const caasppDefaultAchievementLevels = [
  { id: '9', name: 'No score', rank: 0 }, // for caaspp, id = 9, represents no score
  { id: '1', name: 'Level 1', color: '#EA9B71', rank: 1 },
  { id: '2', name: 'Level 2', color: '#D9DD52', rank: 2 },
  { id: '3', name: 'Level 3', color: '#4198C9', rank: 3 },
]

const achievementLevelsGrouped = [
  {
    testTitles: [
      'Smarter Balanced Summative for ELA',
      'Smarter Balanced Summative for Mathematics',
      'California Science Test (CAST)',
    ],
    data: [
      { id: '9', name: 'No score', rank: 0 },
      { id: '1', name: 'Standard Not Met', color: '#EA9C71', rank: 1 },
      { id: '2', name: 'Standard Nearly Met', color: '#D8DE52', rank: 2 },
      { id: '3', name: 'Standard Met', color: '#86BD56', rank: 3 },
      { id: '4', name: 'Standard Exceeded', color: '#4298C9', rank: 4 },
    ],
  },
  {
    testTitles: [
      'CAA for ELA',
      'CAA for Mathematics',
      'CAA for Science',
      'California Spanish Assessment', // waiting approval: read field 150 in https://www.caaspp.org/rsc/pdfs/CAASPP.student_data_layout.2022.pdf
    ],
    data: [...caasppDefaultAchievementLevels],
  },
]

const getCAASPPAchievementLevels = (test) => {
  const { testId, title: testTitle, achievementLevelRank: rank } = test
  let result = [...caasppDefaultAchievementLevels]
  for (const achievementLevelsGroup of achievementLevelsGrouped) {
    if (achievementLevelsGroup.testTitles.includes(testTitle)) {
      result = achievementLevelsGroup.data
      break
    }
  }
  const colorBand = getColorBandBySize(result.length).reverse()
  result = result.map((r, i) => ({
    color: colorBand[i],
    ...r,
    testId,
    active:
      typeof rank !== 'undefined'
        ? +rank === r.rank
        : test.achievementLevel === r.id,
  }))
  return result
}

const getIReadyAchievementLevels = (test) => {
  const { testId, achievementLevelRank: rank } = test
  const achievementLevel = test.achievementLevel.toLowerCase()
  const isMid = achievementLevel.startsWith('mid')
  const isLate =
    achievementLevel.startsWith('late') || achievementLevel.startsWith('max')
  const isEarly = achievementLevel.startsWith('early')
  const level = achievementLevel.replace('level', '').trim()
  const levelDiff = (level === 'k' ? 0 : +level) - test.grade
  const colorBand = getColorBandBySize(3).reverse()
  return [
    {
      testId,
      name: 'Two or More Grade Levels Below',
      active: typeof rank !== 'undefined' ? +rank === 0 : levelDiff <= -2,
      color: colorBand[0],
      id: 'Two or More Grade Levels Below',
      rank: 0,
    },
    {
      testId,
      name: 'On (Early) Grade Level or One Grade Level Below',
      active:
        typeof rank !== 'undefined' ? +rank === 1 : isEarly || levelDiff == -1,
      color: colorBand[1],
      id: 'On (Early) Grade Level or One Grade Level Below',
      rank: 1,
    },
    {
      testId,
      name: 'On (Mid/Late) or Above Grade Level',
      active:
        typeof rank !== 'undefined'
          ? +rank === 2
          : isMid || isLate || levelDiff >= 0,
      color: colorBand[2],
      id: 'On (Mid/Late) or Above Grade Level',
      rank: 2,
    },
  ]
}

const getNWEAAchievementLevels = (test) => {
  const { testId, achievementLevelRank: rank } = test
  const score = test.score
  return [
    {
      testId,
      name: 'Low',
      id: 'Low',
      color: '#76211E',
      active: typeof rank !== 'undefined' ? +rank === 0 : score < 21,
      rank: 0,
    },
    {
      testId,
      name: 'LoAvg',
      id: 'LoAvg',
      color: '#E9923F',
      active:
        typeof rank !== 'undefined' ? +rank === 1 : score >= 21 && score <= 40,
      rank: 1,
    },
    {
      testId,
      name: 'Avg',
      id: 'Avg',
      color: '#F6C750',
      active:
        typeof rank !== 'undefined' ? +rank === 2 : score >= 41 && score <= 60,
      rank: 2,
    },
    {
      testId,
      name: 'HiAvg',
      id: 'HiAvg',
      color: '#3B8457',
      active:
        typeof rank !== 'undefined' ? +rank === 3 : score >= 61 && score <= 80,
      rank: 3,
    },
    {
      testId,
      name: 'Hi',
      id: 'Hi',
      color: '#295FA5',
      active: typeof rank !== 'undefined' ? +rank === 4 : score >= 80,
      rank: 4,
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
