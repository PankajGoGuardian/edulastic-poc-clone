const getHSLFromRange1 = (val, light = 79) => `hsla(${val}, 100%, ${light}%, 1)`

const analyseByOptions = {
  scorePerc: 'score(%)',
  rawScore: 'rawScore',
  aboveBelowStandard: 'aboveBelowStandard',
  proficiencyBand: 'proficiencyBand',
}

const standardConst = {
  above: 1,
  below: 0,
}

const calculateStudentsInPerformanceBands = (
  performanceBandDetails,
  performanceBand,
  totalStudents
) => {
  if (!performanceBandDetails) {
    return {}
  }
  const studentsInPerformanceBands = performanceBand.reduce(
    (acc, { name }) => ({ ...acc, [name]: 0, [`${name}Percentage`]: 0 }),
    {}
  )

  performanceBand.forEach(({ threshold, name, aboveStandard }) => {
    const band = performanceBandDetails.find((b) => b.threshold === threshold)
    if (band) {
      studentsInPerformanceBands[name] += band.studentsInBand
      const perc = Number((band.studentsInBand * 100) / totalStudents).toFixed(
        0
      )
      studentsInPerformanceBands[`${name}Percentage`] =
        aboveStandard === standardConst.above ? perc : -perc
    }
  })

  return studentsInPerformanceBands
}

const transformByProficiencyBand = (data, bandInfo) => {
  const transformedData = data.map((item) => {
    const bandDetails = calculateStudentsInPerformanceBands(
      item?.performanceBandDetails,
      bandInfo?.performanceBand,
      item?.submittedStudents
    )
    return {
      ...item,
      dimensionId: item.dimension._id,
      ...bandDetails,
    }
  })
  return transformedData
}

const transformByAboveBelowStandard = (data) => {
  const transformedData = data.map((item) => {
    const aboveStandardPercentage = Number(
      ((100 * item.aboveStandard) / item.totalStudents).toFixed(0)
    )
    const belowStandardPercentage = aboveStandardPercentage - 100
    return {
      ...item,
      dimensionId: item.dimension._id,
      aboveStandardPercentage,
      belowStandardPercentage,
      fill_0: getHSLFromRange1(100),
      fill_1: getHSLFromRange1(0),
    }
  })
  return transformedData
}

const transformByRawScore = (data) => {
  const transformedData = data.map((item) => {
    const maxScore = (item.dimensionMaxScore / item.submittedStudents)?.toFixed(
      2
    )
    return {
      ...item,
      maxScore,
      dimensionId: item.dimension._id,
      correct: item.dimensionAvg?.toFixed(2),
      incorrect: (maxScore - item.dimensionAvg)?.toFixed(2),
      fill: getHSLFromRange1((100 * item.dimensionAvg) / maxScore),
      dFill: getHSLFromRange1((item.districtAvg * 100) / maxScore),
    }
  })
  return transformedData
}

const transformScorePerc = (data) => {
  const transformedData = data.map((item) => {
    return {
      ...item,
      dimensionId: item.dimension._id,
      correct: item.dimensionAvg?.toFixed(0),
      incorrect: (100 - item.dimensionAvg).toFixed(0),
      fill: getHSLFromRange1(item.dimensionAvg),
      dFill: getHSLFromRange1(item.districtAvg),
    }
  })
  return transformedData
}

const transformData = (filter, bandInfo, data) => {
  if (data?.length) {
    switch (filter.analyseBy) {
      case analyseByOptions.proficiencyBand:
        return transformByProficiencyBand(data, bandInfo)
      case analyseByOptions.aboveBelowStandard:
        return transformByAboveBelowStandard(data)
      case analyseByOptions.rawScore:
        return transformByRawScore(data)
      case analyseByOptions.scorePerc:
        return transformScorePerc(data)
      default:
        return data
    }
  } else return []
}

module.exports = {
  transformData,
  analyseByOptions,
}
