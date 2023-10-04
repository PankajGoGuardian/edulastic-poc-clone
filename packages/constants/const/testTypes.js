const EDULASTIC = 'edulastic'
const AIR = 'AIR'
const CAASPP = 'CAASPP'
const ELPAC = 'ELPAC'
const SAT = 'SAT'
const iReady_Math = 'iReady_Math'
const iReady_ELA = 'iReady_ELA'
const NWEA = 'NWEA'
const GMAS_EOC = 'GMAS_EOC'
const GMAS_EOG = 'GMAS_EOG'
const ILEARN = 'ILEARN'
const STARR = 'STARR'
const TERM_GRADES = 'Term_Grades'
const FP_BAS = 'FP_BAS'

// Adding new test types would require edits in color, localization, TEST_TYPE_LABELS, utils
const EXTERNAL_TEST_TYPES = {
  [AIR]: 'AIR',
  [CAASPP]: 'CAASPP',
  [ELPAC]: 'ELPAC',
  [SAT]: 'SAT',
  [iReady_Math]: 'iReady (MATH)',
  [iReady_ELA]: 'iReady (ELA)',
  [NWEA]: 'NWEA',
  [GMAS_EOC]: 'GMAS_EOC',
  [GMAS_EOG]: 'GMAS_EOG',
  [ILEARN]: 'ILEARN',
  [STARR]: 'STARR',
  [TERM_GRADES]: 'Term_Grades',
}

const ATTENDANCE = 'ATTENDANCE'
const NON_ACADEMIC_DATA_TYPES = {
  [ATTENDANCE]: 'Attendance',
}

const TEST_TYPES = {
  ASSESSMENT: ['assessment'],
  COMMON: ['common assessment', 'school common assessment'],
  PRACTICE: ['practice', 'homework', 'quiz'],
  TESTLET: ['testlet'],
}

const ALL_TEST_TYPES_VALUES = Object.values(TEST_TYPES).flat()

const ALL_TEST_TYPES_KEYS = Object.keys(TEST_TYPES).map((item) =>
  item.toLowerCase()
)

const ALL_TEST_TYPES_KEYS_EXCLUDING_TESTLET = ALL_TEST_TYPES_KEYS.filter(
  (item) => !TEST_TYPES.TESTLET.includes(item)
)

const TEST_TYPES_VALUES_MAP = ALL_TEST_TYPES_VALUES.reduce((acc, curr) => {
  const _key = curr.split(' ').join('_').toUpperCase()
  acc[_key] = curr
  return acc
}, {})

const TEST_TYPE_LABELS = {
  'common assessment': 'Common Assessment',
  'school common assessment': 'School Common Assessment',
  assessment: 'Class Assessment',
  practice: 'Practice Assessment',
  homework: 'Homework',
  quiz: 'Quiz',
}

const DEFAULT_ADMIN_TEST_TYPE_MAP = {
  'district-admin': TEST_TYPES_VALUES_MAP.COMMON_ASSESSMENT,
  'school-admin': TEST_TYPES_VALUES_MAP.SCHOOL_COMMON_ASSESSMENT,
}

const PREMIUM_TEST_TYPES = [
  TEST_TYPES_VALUES_MAP.HOMEWORK,
  TEST_TYPES_VALUES_MAP.QUIZ,
]

module.exports = {
  TEST_TYPES,
  ALL_TEST_TYPES_VALUES,
  ALL_TEST_TYPES_KEYS,
  ALL_TEST_TYPES_KEYS_EXCLUDING_TESTLET,
  TEST_TYPES_VALUES_MAP,
  TEST_TYPE_LABELS,
  DEFAULT_ADMIN_TEST_TYPE_MAP,
  PREMIUM_TEST_TYPES,
  EXTERNAL_TEST_TYPES,
  NON_ACADEMIC_DATA_TYPES,
  EDULASTIC,
  AIR,
  CAASPP,
  ELPAC,
  SAT,
  iReady_Math,
  iReady_ELA,
  NWEA,
  GMAS_EOC,
  GMAS_EOG,
  ILEARN,
  STARR,
  TERM_GRADES,
  FP_BAS,
  ATTENDANCE,
}
