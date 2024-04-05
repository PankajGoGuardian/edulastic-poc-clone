const EDULASTIC = 'edulastic'

// These are 3P test types supported by Edulastic, if a specific feature needs to be implemented for some test types, these constants can be used.
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
const FASTBRIDGE_EARLY_MATH_SCREENING = 'Fastbridge_Early_Math_Screening'
const FASTBRIDGE_EARLY_READING_ENGLISH_SCREENING =
  'Fastbridge_Early_Reading_English_Screening'
const FASTBRIDGE_AMath = 'Fastbridge_aMath'
const FASTBRIDGE_AReading = 'Fastbridge_aReading'
const LEAP_3_8 = 'LEAP_3_8'
const HS_LEAP = 'HS_LEAP'
const DRC_BEACON_MATH = 'DRC_BEACON_MATH'
const MCAS = 'MCAS'
const DRC_BEACON_ELA = 'DRC_BEACON_ELA'
const ACCESS = 'ACCESS'
const NHSAS = 'NHSAS'
const KSA = 'KSA'
const DRC_WIDA_ELL = 'DRC_WIDA_ELL'
const IAP_EOY = 'IAP_EOY'
const IAP_Window = 'IAP_Window'
const MCAS_Historical = 'MCAS_Historical'
const ACCESS_v2 = 'ACCESS_v2'
const IAM = 'IAM'
const Class_Report = 'Class_Report'
const Interim_Data = 'Interim_Data'
const IREAD3 = 'IREAD3'
const IXL = 'IXL'
const On_Course_Grades = 'On_Course_Grades'
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

const TEST_TYPE_SURVEY = 'survey'

const TEST_TYPES = {
  ASSESSMENT: ['assessment'],
  COMMON: ['common assessment', 'school common assessment'],
  PRACTICE: ['practice', 'homework', 'quiz'],
  TESTLET: ['testlet'],
  SURVEY: [TEST_TYPE_SURVEY],
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
  'common assessment': 'District Common',
  'school common assessment': 'School Common',
  assessment: 'Class Assessment',
  practice: 'Practice Assessment',
  homework: 'Homework',
  quiz: 'Quiz',
  survey: 'Survey',
}

const DEFAULT_ADMIN_TEST_TYPE_MAP = {
  'district-admin': TEST_TYPES_VALUES_MAP.COMMON_ASSESSMENT,
  'school-admin': TEST_TYPES_VALUES_MAP.SCHOOL_COMMON_ASSESSMENT,
}

const DEFAULT_TEST_TYPES_BY_USER_ROLES = {
  ...DEFAULT_ADMIN_TEST_TYPE_MAP,
  teacher: TEST_TYPES_VALUES_MAP.ASSESSMENT,
}

const DEFAULT_ADMIN_TEST_TYPE_MAP_FILTER = {
  'district-admin': [TEST_TYPES_VALUES_MAP.COMMON_ASSESSMENT],
  'school-admin': [
    TEST_TYPES_VALUES_MAP.COMMON_ASSESSMENT,
    TEST_TYPES_VALUES_MAP.SCHOOL_COMMON_ASSESSMENT,
  ],
}

const PREMIUM_TEST_TYPES = [
  TEST_TYPES_VALUES_MAP.HOMEWORK,
  TEST_TYPES_VALUES_MAP.QUIZ,
]

const FASTBRIDGE_TEST_TYPES = [
  FASTBRIDGE_EARLY_MATH_SCREENING,
  FASTBRIDGE_EARLY_READING_ENGLISH_SCREENING,
  FASTBRIDGE_AMath,
  FASTBRIDGE_AReading,
]

module.exports = {
  TEST_TYPES,
  ALL_TEST_TYPES_VALUES,
  ALL_TEST_TYPES_KEYS,
  ALL_TEST_TYPES_KEYS_EXCLUDING_TESTLET,
  TEST_TYPES_VALUES_MAP,
  TEST_TYPE_LABELS,
  DEFAULT_ADMIN_TEST_TYPE_MAP,
  DEFAULT_ADMIN_TEST_TYPE_MAP_FILTER,
  DEFAULT_TEST_TYPES_BY_USER_ROLES,
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
  LEAP_3_8,
  DRC_BEACON_ELA,
  DRC_BEACON_MATH,
  HS_LEAP,
  MCAS,
  NHSAS,
  ACCESS,
  ATTENDANCE,
  KSA,
  DRC_WIDA_ELL,
  FASTBRIDGE_EARLY_MATH_SCREENING,
  FASTBRIDGE_EARLY_READING_ENGLISH_SCREENING,
  FASTBRIDGE_AMath,
  FASTBRIDGE_AReading,
  FASTBRIDGE_TEST_TYPES,
  TEST_TYPE_SURVEY,
  IAP_EOY,
  IAP_Window,
  MCAS_Historical,
  ACCESS_v2,
  IAM,
  Class_Report,
  Interim_Data,
  IREAD3,
  IXL,
  On_Course_Grades,
}
