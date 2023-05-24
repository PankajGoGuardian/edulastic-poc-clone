const { startCase, get } = require('lodash')

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
  avgSore: 'avgSore',
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
    printData = `${record[columnKey]?.toFixed(0)}%`
  } else if (analyseBy === analyseByOptions.rawScore) {
    printData = record[columnKey]?.toFixed(2)
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

const _idToName = {
  school: 'School',
  class: 'Class',
  group: 'Student Group',
  teacher: 'Teacher',
  race: 'Race',
  gender: 'Gender',
  frlStatus: 'FRL Status',
  ellStatus: 'ELL Status',
  iepStatus: 'IEP Status',
  hispanicEthnicity: 'Hispanic Ethnicity',
}
const idToName = (id) => _idToName[id] || startCase(id)

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
  makeColumn(title, 'dimension.name', 250, ...ext)

const compareSchool = compareColumn('School')
const compareTeacher = compareColumn('Teacher')
const compareStudGroup = compareColumn('Student Group', 'left')
const compareRace = compareColumn('Race')
const compareGender = compareColumn('Gender')
const compareFrlStatus = compareColumn('FRL Status')
const compareEllStatus = compareColumn('ELL Status')
const compareIepStatus = compareColumn('IEP Status')
const compareClass = compareColumn('Class')
const compareHispanicEthnicity = compareColumn('Hispanic Ethnicity')

const submitted = makeColumn('#Submitted', 'totalStudents', 70)
const absent = makeColumn('#Absent', 'absentStudents', 70)
const districtAvgPc = makeColumn('District(Score%)', 'districtAvg')
const avgStudentScorePercentUnrounded = makeColumn(
  'Avg.Student(Score%)',
  'avgSore'
)
const school = makeColumn('School', 'schoolName', 250)
const teacher = makeColumn('Teacher', 'teacherName', 250)
const districtAvg = makeColumn('District Avg.Score', 'districtAvg')
const avgStudentScoreUnrounded = makeColumn('Avg.Score', 'avgSore')
const belowStandard = makeColumn('Below Standard', 'belowStandard')
const aboveStandard = makeColumn('Above Standard', 'aboveStandard')

// helper functions to create rows for "Score %" analyzer
const makeScorePc = (title, ...extColumns) => [
  typeof title === 'string' ? compareColumn(title) : title,
  ...extColumns,
  submitted,
  absent,
  districtAvgPc,
  avgStudentScorePercentUnrounded,
]
// helper functions to create rows for "Raw Score" analyzer
const makeRaw = (title, ...extColumns) => [
  typeof title === 'string' ? compareColumn(title) : title,
  ...extColumns,
  submitted,
  absent,
  districtAvg,
  avgStudentScoreUnrounded,
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

  columns['score(%)'].schoolId = makeScorePc({
    ...compareSchool,
    align: 'left',
  })
  columns['score(%)'].teacherId = makeScorePc(
    { ...compareTeacher, align: 'left' },
    { ...school, align: 'left' }
  )
  columns['score(%)'].groupId = makeScorePc(
    { ...compareClass, align: 'left', fixed: 'left' },
    { ...teacher, align: 'left' },
    { ...school, align: 'left' }
  )
  columns['score(%)'].group = makeScorePc(
    { ...compareStudGroup, fixed: 'left' },
    { ...teacher, align: 'left' },
    { ...school, align: 'left' }
  )
  columns['score(%)'].race = makeScorePc(compareRace)
  columns['score(%)'].hispanicEthnicity = makeScorePc(compareHispanicEthnicity)
  columns['score(%)'].gender = makeScorePc(compareGender)
  columns['score(%)'].frlStatus = makeScorePc(compareFrlStatus)
  columns['score(%)'].ellStatus = makeScorePc(compareEllStatus)
  columns['score(%)'].iepStatus = makeScorePc(compareIepStatus)

  columns.rawScore.schoolId = makeRaw(compareSchool)
  columns.rawScore.teacherId = makeRaw(compareTeacher, school)
  columns.rawScore.groupId = makeRaw(compareClass, teacher, school)
  columns.rawScore.race = makeRaw(compareRace)
  columns.rawScore.hispanicEthnicity = makeRaw(compareHispanicEthnicity)
  columns.rawScore.gender = makeRaw(compareGender)
  columns.rawScore.frlStatus = makeRaw(compareFrlStatus)
  columns.rawScore.ellStatus = makeRaw(compareEllStatus)
  columns.rawScore.iepStatus = makeRaw(compareIepStatus)

  columns.aboveBelowStandard.schoolId = makeAboveBelowStd(compareSchool)
  columns.aboveBelowStandard.teacherId = makeAboveBelowStd(
    compareTeacher,
    school
  )
  columns.aboveBelowStandard.groupId = makeAboveBelowStd(
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

  columns.proficiencyBand.schoolId = makeProficiencyBand(compareSchool)
  columns.proficiencyBand.teacherId = makeProficiencyBand(
    compareTeacher,
    school
  )
  columns.proficiencyBand.groupId = makeProficiencyBand(
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
  tableDataIndexKeys.avgSore,
]

const columnKeyMap = {
  avgSore: 'dimensionAvg',
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

module.exports = {
  transformData,
  analyseByOptions,
  idToName,
  getColumns,
  prepareHeaderRow,
  prepareTableDataRow,
  getDisplayValue,
}
