import { testTypes } from '@edulastic/constants'

export const getYear = (timestamp) => new Date(timestamp).getFullYear()

const {
  EXTERNAL_TEST_TYPES: ACADEMIC_TEST_TYPES,
  NON_ACADEMIC_DATA_TYPES,
} = testTypes

const getOptionValues = ([key, value]) => ({
  key,
  value,
  title: value,
})

const academicDataChildren = Object.entries(ACADEMIC_TEST_TYPES).map(
  getOptionValues
)
const nonAcademicDataChildren = Object.entries(NON_ACADEMIC_DATA_TYPES).map(
  getOptionValues
)

export const dataFormatTreeOptions = [
  {
    title: 'Non-Academic Data',
    value: 'nonAcademicData',
    key: 'nonAcademicData',
    selectable: false,
    children: nonAcademicDataChildren,
  },
  {
    title: 'Academic Data',
    value: 'academicData',
    key: 'academicData',
    selectable: false,
    children: academicDataChildren,
  },
]
