const { FP_BAS } = require('./testTypes')

const S3_DATA_WAREHOUSE_FOLDER =
  process.env.REACT_APP_AWS_S3_DATA_WAREHOUSE_FOLDER

const MAX_UPLOAD_FILE_SIZE = 30000000

const CHAR_CODE_LETTER_A = 'A'.charCodeAt(0)
const FP_BAS_SCORES_MAP = Object.fromEntries(
  [
    '< A',
    ...Array(26)
      .fill()
      .map((_, i) => String.fromCharCode(CHAR_CODE_LETTER_A + i)),
    'Z+',
  ].map((score, index) => [index, score])
)

function getScoreLabelNoSuffix(score, test) {
  const type = test.externalTestType ?? test.testCategory
  if (type === FP_BAS) {
    return FP_BAS_SCORES_MAP[Math.round(score)]
  }
  return score
}

function getScoreLabel(score, test) {
  const externalTestType = test.externalTestType ?? test.testCategory
  score = getScoreLabelNoSuffix(score, test)
  const suffix = externalTestType ? '' : '%'
  return `${score}${suffix}`
}

const getAchievementLevels = (test, allExternalBands) => {
  let testBandsGroup = allExternalBands.find(
    (band) =>
      band.testCategory === test.externalTestType &&
      band.testTitle === test.title
  )
  if (!testBandsGroup) {
    testBandsGroup = allExternalBands.find(
      (band) => band.testCategory === test.externalTestType && !band.testTitle
    )
  }
  // After returning `[]`, chart bar won't be shown and table will have `-` in perf. band
  if (!testBandsGroup) return []
  const { bands } = testBandsGroup
  const testBands = bands.map((band) => ({
    ...band,
    active: band.rank === test.achievementLevel,
    testId: test.testId,
    termId: test.termId,
    id: band.rank,
  }))
  return testBands
}

const FEED_NAME_LABEL = 'Session'

module.exports = {
  S3_DATA_WAREHOUSE_FOLDER,
  MAX_UPLOAD_FILE_SIZE,
  FEED_NAME_LABEL,
  getAchievementLevels,
  FP_BAS_SCORES_MAP,
  getScoreLabelNoSuffix,
  getScoreLabel,
}
