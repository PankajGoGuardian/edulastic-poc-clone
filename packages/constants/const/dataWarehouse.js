const S3_DATA_WAREHOUSE_FOLDER =
  process.env.REACT_APP_AWS_S3_DATA_WAREHOUSE_FOLDER

const MAX_UPLOAD_FILE_SIZE = 30000000

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
    id: band.rank,
  }))
  return testBands
}

module.exports = {
  S3_DATA_WAREHOUSE_FOLDER,
  MAX_UPLOAD_FILE_SIZE,
  getAchievementLevels,
}
