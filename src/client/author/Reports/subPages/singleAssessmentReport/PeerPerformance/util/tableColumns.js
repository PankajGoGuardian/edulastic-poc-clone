import { idToName } from './transformers'

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
const avgStudentScoreUnrounded = makeColumn(
  'Avg.Score',
  'avgStudentScoreUnrounded'
)
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

const columns = {
  'score(%)': {},
  rawScore: {},
  aboveBelowStandard: {},
  proficiencyBand: {},
}

// mapping of analyzer Id to helper function
const _analyzeToMake = {
  'score(%)': makeScorePc,
  rawScore: makeRaw,
  aboveBelowStandard: makeAboveBelowStd,
  proficiencyBand: makeProficiencyBand,
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
columns.aboveBelowStandard.teacherId = makeAboveBelowStd(compareTeacher, school)
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
columns.proficiencyBand.teacherId = makeProficiencyBand(compareTeacher, school)
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

export default columns

export const getColumns = (ddfilter) => {
  let _cols =
    columns[ddfilter.analyseBy][
      ddfilter.compareBy === 'group' ? 'groupId' : ddfilter.compareBy
    ]
  if (!_cols) {
    _cols = _analyzeToMake[ddfilter.analyseBy](idToName(ddfilter.compareBy))
  }
  return _cols
}
