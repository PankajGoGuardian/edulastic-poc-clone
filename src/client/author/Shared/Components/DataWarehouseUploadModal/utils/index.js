import { testTypes } from '@edulastic/constants'
import { EXTERNAL_TEST_TYPES } from '@edulastic/constants/const/testTypes'

export const getYear = (timestamp) => new Date(timestamp).getFullYear()

const SUPPORTED_EXTERNAL_TEST_TYPES = [
  EXTERNAL_TEST_TYPES.CAASPP,
  EXTERNAL_TEST_TYPES.iReady_ELA,
  EXTERNAL_TEST_TYPES.iReady_Math,
  EXTERNAL_TEST_TYPES.NWEA,
]

const {
  EXTERNAL_TEST_TYPES: ACADEMIC_TEST_TYPES,
  NON_ACADEMIC_DATA_TYPES,
} = testTypes
export const NON_ACADEMIC_DATA_TYPE_KEY = 'nonAcademicData'
export const ACADEMIC_DATA_TYPE_KEY = 'academicData'

const getOptionValues = ([key, title]) => ({
  key,
  value: key,
  title,
})

const academicDataChildren = Object.entries(ACADEMIC_TEST_TYPES)
  .map(getOptionValues)
  .filter(({ title }) => SUPPORTED_EXTERNAL_TEST_TYPES.includes(title))

const nonAcademicDataChildren = Object.entries(NON_ACADEMIC_DATA_TYPES).map(
  getOptionValues
)

export const dataFormatTreeOptions = [
  {
    title: 'Non-Academic Data',
    value: NON_ACADEMIC_DATA_TYPE_KEY,
    key: NON_ACADEMIC_DATA_TYPE_KEY,
    selectable: false,
    children: nonAcademicDataChildren,
  },
  {
    title: 'Academic Data',
    value: ACADEMIC_DATA_TYPE_KEY,
    key: ACADEMIC_DATA_TYPE_KEY,
    selectable: false,
    children: academicDataChildren,
  },
]
