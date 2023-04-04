const LEAST_MASTERY_SCORE = 1
const MASTERY_SCORE_MULTIPLIER = 1
const CHART_PAGE_SIZE = 10
const TABLE_PAGE_SIZE = 200
const CHART_X_AXIS_DATA_KEY = 'standardId'

const comDataForDropDown = {
  COMPARE_BY: 'compareBy',
  ANALYZE_BY: 'analyzeBy',
}

const filterFields = [
  'termId',
  'assessmentTypes',
  'assignedBy',
  'classIds',
  'courseId',
  'curriculumId',
  'domainIds',
  'grades',
  'groupIds',
  'profileId',
  'schoolIds',
  'standardGrade',
  'subjects',
  'teacherIds',
  'testIds',
  'race',
  'gender',
  'iepStatus',
  'frlStatus',
  'ellStatus',
  'hispanicEthnicity',
]
const summaryExtraFields = ['stdPage', 'stdPageSize']
const sharedSummaryFields = ['reportId', ...summaryExtraFields]
const filterSummaryFields = [...filterFields, ...summaryExtraFields]
const detailsExtraFields = [
  'compareBy',
  'analyzeBy',
  'rowPage',
  'rowPageSize',
  'sortOrder',
  'sortKey',
  'requireTotalCount',
]
const sharedDetailsFields = [...sharedSummaryFields, ...detailsExtraFields]
const filterDetailsFields = [...filterSummaryFields, ...detailsExtraFields]

const compareByKeys = {
  SCHOOL: 'school',
  TEACHER: 'teacher',
  CLASS: 'class',
  STUDENT: 'student',
  RACE: 'race',
  GENDER: 'gender',
  FRL_STATUS: 'frlStatus',
  ELL_STATUS: 'ellStatus',
  IEP_STATUS: 'iepStatus',
  HISPANIC_ETHNICITY: 'hispanicEthnicity',
}

const compareByKeyToNameMap = {
  [compareByKeys.SCHOOL]: 'School',
  [compareByKeys.TEACHER]: 'Teacher',
  [compareByKeys.CLASS]: 'Class',
  [compareByKeys.STUDENT]: 'Student',
  [compareByKeys.RACE]: 'Race',
  [compareByKeys.GENDER]: 'Gender',
  [compareByKeys.FRL_STATUS]: 'FRL Status',
  [compareByKeys.ELL_STATUS]: 'ELL Status',
  [compareByKeys.IEP_STATUS]: 'IEP Status',
  [compareByKeys.HISPANIC_ETHNICITY]: 'Hispanic Ethnicity',
}

const compareByDropDownData = [
  {
    key: compareByKeys.SCHOOL,
    title: compareByKeyToNameMap[compareByKeys.SCHOOL],
  },
  {
    key: compareByKeys.TEACHER,
    title: compareByKeyToNameMap[compareByKeys.TEACHER],
  },
  {
    key: compareByKeys.CLASS,
    title: compareByKeyToNameMap[compareByKeys.CLASS],
  },
  {
    key: compareByKeys.STUDENT,
    title: compareByKeyToNameMap[compareByKeys.STUDENT],
  },
  {
    key: compareByKeys.RACE,
    title: compareByKeyToNameMap[compareByKeys.RACE],
  },
  {
    key: compareByKeys.GENDER,
    title: compareByKeyToNameMap[compareByKeys.GENDER],
  },
  {
    key: compareByKeys.FRL_STATUS,
    title: compareByKeyToNameMap[compareByKeys.FRL_STATUS],
  },
  {
    key: compareByKeys.ELL_STATUS,
    title: compareByKeyToNameMap[compareByKeys.ELL_STATUS],
  },
  {
    key: compareByKeys.IEP_STATUS,
    title: compareByKeyToNameMap[compareByKeys.IEP_STATUS],
  },
  {
    key: compareByKeys.HISPANIC_ETHNICITY,
    title: compareByKeyToNameMap[compareByKeys.HISPANIC_ETHNICITY],
  },
]

const analyseByKeys = {
  SCORE_PERCENT: 'score(%)',
  RAW_SCORE: 'rawScore',
  MASTERY_LEVEL: 'masteryLevel',
  MASTERY_SCORE: 'masteryScore',
}

const analyseByKeyToNameMap = {
  [analyseByKeys.SCORE_PERCENT]: 'Score (%)',
  [analyseByKeys.RAW_SCORE]: 'Raw Score',
  [analyseByKeys.MASTERY_LEVEL]: 'Mastery Level',
  [analyseByKeys.MASTERY_SCORE]: 'Mastery Score',
}

const analyseByDropDownData = [
  {
    key: analyseByKeys.SCORE_PERCENT,
    title: analyseByKeyToNameMap[analyseByKeys.SCORE_PERCENT],
  },
  {
    key: analyseByKeys.RAW_SCORE,
    title: analyseByKeyToNameMap[analyseByKeys.RAW_SCORE],
  },
  {
    key: analyseByKeys.MASTERY_LEVEL,
    title: analyseByKeyToNameMap[analyseByKeys.MASTERY_LEVEL],
  },
  {
    key: analyseByKeys.MASTERY_SCORE,
    title: analyseByKeyToNameMap[analyseByKeys.MASTERY_SCORE],
  },
]

module.exports = {
  LEAST_MASTERY_SCORE,
  MASTERY_SCORE_MULTIPLIER,
  CHART_PAGE_SIZE,
  TABLE_PAGE_SIZE,
  CHART_X_AXIS_DATA_KEY,
  comDataForDropDown,
  sharedDetailsFields,
  filterDetailsFields,
  sharedSummaryFields,
  filterSummaryFields,
  compareByKeys,
  compareByKeyToNameMap,
  compareByDropDownData,
  analyseByKeys,
  analyseByKeyToNameMap,
  analyseByDropDownData,
}
