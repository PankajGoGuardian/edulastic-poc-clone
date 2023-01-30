// Adding new test types would require edits in color, localization, TEST_TYPE_LABELS, utils
const EXTERNAL_TEST_TYPES = {
  AIR: 'AIR',
  CAASPP: 'CAASPP',
  ELPAC: 'ELPAC',
  SAT: 'SAT',
  iReady_Math: 'iReady (MATH)',
  iReady_ELA: 'iReady (ELA)',
  NWEA: 'NWEA',
}

const NON_ACADEMIC_DATA_TYPES = {
  ATTENDANCE: 'Attendance',
}

const TEST_TYPES = {
  ASSESSMENT: ['assessment'],
  COMMON: ['common assessment'],
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
  assessment: 'Class Assessment',
  practice: 'Practice Assessment',
  homework: 'Homework',
  quiz: 'Quiz',
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
  PREMIUM_TEST_TYPES,
  EXTERNAL_TEST_TYPES,
  NON_ACADEMIC_DATA_TYPES,
}
