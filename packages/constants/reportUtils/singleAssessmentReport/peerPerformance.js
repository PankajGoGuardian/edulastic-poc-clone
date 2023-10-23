const { get, isNil, isEmpty, round } = require('lodash')
const {
  idToName,
} = require('../../../../src/client/author/Reports/subPages/singleAssessmentReport/PeerPerformance/util/transformers')

const getHSLFromRange1 = (val, light = 79) => `hsla(${val}, 100%, ${light}%, 1)`

const analyseByOptions = {
  scorePerc: 'score(%)',
  rawScore: 'rawScore',
  aboveBelowStandard: 'aboveBelowStandard',
  proficiencyBand: 'proficiencyBand',
}

const tableDataIndexKeys = {
  dimensionAvg: 'dimensionAvg',
  districtAvg: 'districtAvg',
  aboveStandard: 'aboveStandard',
  belowStandard: 'belowStandard',
  avgScore: 'avgScore',
}

const standardConst = {
  above: 1,
  below: 0,
}

const getDisplayValue = (data, record, analyseBy, columnKey) => {
  let printData = data
  const NA = 'N/A'
  if (
    printData === 0 &&
    (analyseBy === analyseByOptions.aboveBelowStandard ||
      analyseBy === analyseByOptions.proficiencyBand)
  ) {
    return NA
  }
  if (analyseBy === analyseByOptions.scorePerc) {
    printData = !isNil(record[columnKey])
      ? `${record[columnKey]?.toFixed(0)}%`
      : NA
  } else if (analyseBy === analyseByOptions.rawScore) {
    printData = !isNil(record[columnKey]) ? record[columnKey]?.toFixed(2) : NA
  } else if (
    analyseBy === analyseByOptions.proficiencyBand ||
    analyseBy === analyseByOptions.aboveBelowStandard
  ) {
    printData = `${data} (${Math.abs(
      (record[columnKey] * 100) / record.totalStudents
    )?.toFixed(0)}%)`
  }
  return printData
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
      item?.totalStudents
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
      ((100 * item.aboveStandard) / item.submittedStudents).toFixed(0)
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
    const maxScore = item.submittedStudents
      ? (item.dimensionMaxScore / item.submittedStudents)?.toFixed(2)
      : undefined
    const dimensionRange = (100 * item.dimensionAvg) / maxScore || 0
    return {
      ...item,
      maxScore,
      dimensionId: item.dimension._id,
      correct: item.dimensionAvg?.toFixed(2),
      incorrect: item.submittedStudents
        ? (maxScore - item.dimensionAvg)?.toFixed(2)
        : 0,
      fill: getHSLFromRange1(dimensionRange),
      dFill: getHSLFromRange1((item.districtAvg * 100) / (maxScore || 1)),
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
      incorrect: item.submittedStudents
        ? (100 - item.dimensionAvg).toFixed(0)
        : 0,
      fill: getHSLFromRange1(item.dimensionAvg || 0),
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

// helper function to create column
const makeColumn = (title, dataIndex, width = 250, align, fixed) => ({
  title,
  dataIndex,
  key: dataIndex,
  width,
  align,
  fixed,
})

// helper function to create first column i.e. column with compareByLabel
const compareColumn = (title, ...ext) =>
  makeColumn(title, 'dimension.name', 250, 'left', ...ext)

const makeDimensionAverageColumns = (title) => {
  const _title = typeof title === 'string' ? title : title.title
  return [
    makeColumn(`${_title} Average`, 'districtAvg'),
    makeColumn(`Filtered ${_title} Average`, 'avgScore'),
  ]
}

const compareSchool = compareColumn('School')
const compareTeacher = compareColumn('Teacher')
const compareStudGroup = compareColumn('Student Group')
const compareRace = compareColumn('Race')
const compareGender = compareColumn('Gender')
const compareFrlStatus = compareColumn('FRL Status')
const compareEllStatus = compareColumn('ELL Status')
const compareIepStatus = compareColumn('IEP Status')
const compareClass = compareColumn('Class')
const compareHispanicEthnicity = compareColumn('Hispanic Ethnicity')

const submitted = makeColumn('#Submitted', 'submittedStudents', 70)
const absent = makeColumn('#Absent', 'absentStudents', 70)
const school = makeColumn('School', 'schoolName', 250)
const teacher = makeColumn('Teacher', 'teacherName', 250)
const createdBy = makeColumn('Created By', 'teacherName', 250)
const belowStandard = makeColumn('Below Standard', 'belowStandard')
const aboveStandard = makeColumn('Above Standard', 'aboveStandard')

// helper functions to create rows for "Score %" analyzer
const makeScorePc = (title, ...extColumns) => [
  typeof title === 'string' ? compareColumn(title) : title,
  ...extColumns,
  submitted,
  absent,
  ...makeDimensionAverageColumns(title),
]
// helper functions to create rows for "Raw Score" analyzer
const makeRaw = (title, ...extColumns) => [
  typeof title === 'string' ? compareColumn(title) : title,
  ...extColumns,
  submitted,
  absent,
  ...makeDimensionAverageColumns(title),
]
// helper functions to create rows for "Above/Below Standard" analyzer
const makeAboveBelowStd = (title, ...extColumns) => [
  typeof title === 'string' ? compareColumn(title) : title,
  ...extColumns,
  submitted,
  absent,
  belowStandard,
  aboveStandard,
]
// helper functions to create rows for "Proficiency Band" analyzer
const makeProficiencyBand = (title, ...extColumns) => [
  typeof title === 'string' ? compareColumn(title) : title,
  ...extColumns,
  submitted,
  absent,
]
// mapping of analyzer Id to helper function
const _analyzeToMake = {
  'score(%)': makeScorePc,
  rawScore: makeRaw,
  aboveBelowStandard: makeAboveBelowStd,
  proficiencyBand: makeProficiencyBand,
}

const createColumns = () => {
  const columns = {
    'score(%)': {},
    rawScore: {},
    aboveBelowStandard: {},
    proficiencyBand: {},
  }

  columns['score(%)'].school = makeScorePc({
    ...compareSchool,
    align: 'left',
  })
  columns['score(%)'].teacher = makeScorePc(
    { ...compareTeacher, align: 'left' },
    { ...school }
  )
  columns['score(%)'].class = makeScorePc(
    { ...compareClass, align: 'left', fixed: 'left' },
    { ...teacher },
    { ...school }
  )
  columns['score(%)'].group = makeScorePc(
    { ...compareStudGroup, fixed: 'left' },
    { ...createdBy },
    { ...school }
  )
  columns['score(%)'].race = makeScorePc(compareRace)
  columns['score(%)'].hispanicEthnicity = makeScorePc(compareHispanicEthnicity)
  columns['score(%)'].gender = makeScorePc(compareGender)
  columns['score(%)'].frlStatus = makeScorePc(compareFrlStatus)
  columns['score(%)'].ellStatus = makeScorePc(compareEllStatus)
  columns['score(%)'].iepStatus = makeScorePc(compareIepStatus)

  columns.rawScore.school = makeRaw(compareSchool)
  columns.rawScore.teacher = makeRaw(compareTeacher, school)
  columns.rawScore.group = makeRaw(compareStudGroup, createdBy, school)
  columns.rawScore.class = makeRaw(compareClass, teacher, school)
  columns.rawScore.race = makeRaw(compareRace)
  columns.rawScore.hispanicEthnicity = makeRaw(compareHispanicEthnicity)
  columns.rawScore.gender = makeRaw(compareGender)
  columns.rawScore.frlStatus = makeRaw(compareFrlStatus)
  columns.rawScore.ellStatus = makeRaw(compareEllStatus)
  columns.rawScore.iepStatus = makeRaw(compareIepStatus)

  columns.aboveBelowStandard.school = makeAboveBelowStd(compareSchool)
  columns.aboveBelowStandard.teacher = makeAboveBelowStd(compareTeacher, school)
  columns.aboveBelowStandard.group = makeAboveBelowStd(
    compareStudGroup,
    createdBy,
    school
  )
  columns.aboveBelowStandard.class = makeAboveBelowStd(
    compareClass,
    teacher,
    school
  )
  columns.aboveBelowStandard.race = makeAboveBelowStd(compareRace)
  columns.aboveBelowStandard.hispanicEthnicity = makeAboveBelowStd(
    compareHispanicEthnicity
  )
  columns.aboveBelowStandard.gender = makeAboveBelowStd(compareGender)
  columns.aboveBelowStandard.frlStatus = makeAboveBelowStd(compareFrlStatus)
  columns.aboveBelowStandard.ellStatus = makeAboveBelowStd(compareEllStatus)
  columns.aboveBelowStandard.iepStatus = makeAboveBelowStd(compareIepStatus)

  columns.proficiencyBand.school = makeProficiencyBand(compareSchool)
  columns.proficiencyBand.teacher = makeProficiencyBand(compareTeacher, school)
  columns.proficiencyBand.group = makeProficiencyBand(
    compareStudGroup,
    createdBy,
    school
  )
  columns.proficiencyBand.class = makeProficiencyBand(
    compareClass,
    teacher,
    school
  )
  columns.proficiencyBand.race = makeProficiencyBand(compareRace)
  columns.proficiencyBand.hispanicEthnicity = makeProficiencyBand(
    compareHispanicEthnicity
  )
  columns.proficiencyBand.gender = [
    compareGender,
    { ...submitted, width: 250 },
    { ...absent, width: 250 },
  ]
  columns.proficiencyBand.frlStatus = makeProficiencyBand(compareFrlStatus)
  columns.proficiencyBand.ellStatus = makeProficiencyBand(compareEllStatus)
  columns.proficiencyBand.iepStatus = makeProficiencyBand(compareIepStatus)

  return columns
}

const getColumns = ({ compareBy, analyseBy }, bandInfo = []) => {
  const columns = createColumns()
  let _cols = columns[analyseBy][compareBy]
  if (!_cols) {
    _cols = _analyzeToMake[analyseBy](idToName(compareBy)) || []
  }
  const additionalColumns = []
  if (analyseBy === analyseByOptions.proficiencyBand) {
    for (const { name } of bandInfo) {
      additionalColumns.push({
        title: name,
        dataIndex: name,
        key: name,
        [analyseByOptions.proficiencyBand]: true,
      })
    }
  }
  _cols.push(...additionalColumns)
  return _cols
}

const columnValueTransform = [
  tableDataIndexKeys.dimensionAvg,
  tableDataIndexKeys.districtAvg,
  tableDataIndexKeys.aboveStandard,
  tableDataIndexKeys.belowStandard,
  tableDataIndexKeys.avgScore,
]

const columnKeyMap = {
  avgScore: 'dimensionAvg',
}

const prepareTableDataRow = (columns, dataSource, analyseBy) => {
  const result = []
  for (const data of dataSource) {
    const row = []
    for (const column of columns) {
      const columnKey = column.dataIndex
      let value = get(data, columnKey)
      if (columnValueTransform.includes(columnKey) || column.proficiencyBand) {
        const _columnKey = columnKeyMap[columnKey]
          ? columnKeyMap[columnKey]
          : columnKey
        value = getDisplayValue(value, data, analyseBy, _columnKey)
      }
      row.push(value)
    }
    result.push(row)
  }
  return result
}

const prepareHeaderRow = (columns) => {
  return columns.map((item) => item.title)
}

const getOverallAvg = (data, analyseBy) => {
  const { overallAvg, overallAvgPerf } = data[0]
  return analyseBy === analyseByOptions.scorePerc
    ? overallAvgPerf
      ? round(overallAvgPerf)
      : overallAvgPerf
    : overallAvg
}

const getOverallRow = (data, analyseBy, bandInfo) => {
  const districtAvg = getOverallAvg(data, analyseBy)
  const {
    submittedStudents,
    absentStudents,
    aboveStandard,
    belowStandard,
    totalStudents,
    performanceBandDetails,
    totalWeightedScore,
  } = data.reduce(
    (acc, curr) => {
      acc.submittedStudents += curr.submittedStudents
      acc.absentStudents += curr.absentStudents
      acc.aboveStandard += curr.aboveStandard
      acc.belowStandard += curr.belowStandard
      acc.totalStudents += curr.totalStudents
      acc.totalWeightedScore += curr.dimensionAvg * curr.submittedStudents
      if (!isEmpty(bandInfo)) {
        bandInfo.forEach(({ name }) => {
          acc.performanceBandDetails[name] =
            (acc.performanceBandDetails[name] || 0) + curr[name]
        })
      }
      return acc
    },
    {
      submittedStudents: 0,
      absentStudents: 0,
      aboveStandard: 0,
      belowStandard: 0,
      totalStudents: 0,
      performanceBandDetails: {},
      totalWeightedScore: 0,
    }
  )
  const dimensionAvg = totalWeightedScore / submittedStudents
  return {
    dimension: {
      _id: null,
      name: 'Overall',
    },
    districtAvg,
    dimensionAvg,
    submittedStudents,
    absentStudents,
    totalStudents,
    aboveStandard,
    belowStandard,
    ...performanceBandDetails,
  }
}

module.exports = {
  transformData,
  analyseByOptions,
  getColumns,
  prepareHeaderRow,
  prepareTableDataRow,
  getDisplayValue,
  getOverallAvg,
  getOverallRow,
}
