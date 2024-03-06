import { isEmpty } from 'lodash'
import moment from 'moment'
import { testTypes } from '@edulastic/constants'

export const getYear = (timestamp) => new Date(timestamp).getFullYear()

export const NON_ACADEMIC_DATA_TYPE_KEY = 'non-academic'
export const ACADEMIC_DATA_TYPE_KEY = 'academic'
export const FEED_TYPES_WITH_TEST_DATE_INPUT = [
  testTypes.FP_BAS,
  testTypes.TERM_GRADES,
  testTypes.MCAS,
  testTypes.ILEARN,
  testTypes.ACCESS,
  testTypes.NHSAS,
  testTypes.KSA,
  testTypes.DRC_WIDA_ELL,
]
export const AdministrationLevelOptions = [
  {
    key: 'Admin 1',
    title: 'Admin 1',
  },
  {
    key: 'Admin 2',
    title: 'Admin 2',
  },
  {
    key: 'Admin 3',
    title: 'Admin 3',
  },
]

export const FastBridgeSessionOptions = [
  {
    key: 'Fall',
    title: 'Fall',
  },
  {
    key: 'October',
    title: 'October',
  },
  {
    key: 'Winter',
    title: 'Winter',
  },
  {
    key: 'Feb/Mar',
    title: 'Feb/Mar',
  },
  {
    key: 'Spring',
    title: 'Spring',
  },
]

const generateDataStructure = (academicFeedTypes, nonAcademicFeedTypes) => {
  const dataStructure = []

  if (nonAcademicFeedTypes.length > 0) {
    dataStructure.push({
      title: 'Non-Academic Data',
      value: NON_ACADEMIC_DATA_TYPE_KEY,
      key: NON_ACADEMIC_DATA_TYPE_KEY,
      selectable: false,
      children: nonAcademicFeedTypes,
    })
  }

  if (academicFeedTypes.length > 0) {
    dataStructure.push({
      title: 'Academic Data',
      value: ACADEMIC_DATA_TYPE_KEY,
      key: ACADEMIC_DATA_TYPE_KEY,
      selectable: false,
      children: academicFeedTypes,
    })
  }

  return dataStructure
}

export const getFeedTypeOptions = (feedTypes) => {
  if (isEmpty(feedTypes)) return []
  const academicFeedTypes = []
  const nonAcademicFeedTypes = []
  feedTypes.forEach(({ key, title, category }) => {
    const obj = {
      key,
      value: key,
      title,
    }
    if (category === ACADEMIC_DATA_TYPE_KEY) {
      academicFeedTypes.push(obj)
    } else {
      nonAcademicFeedTypes.push(obj)
    }
  })

  const dataStructure = generateDataStructure(
    academicFeedTypes,
    nonAcademicFeedTypes
  )
  return dataStructure
}

export const isDateWithinTermTillPresent = (
  date,
  termStartDate,
  termEndDate
) => {
  if (!termStartDate || !termEndDate) return true
  const toDate = Math.min(termEndDate, Date.now())
  return date <= toDate && date >= termStartDate
}

export const formatDate = (date) => {
  // edu-wh & redshift expect date in this format
  return moment(date).format('MM/DD/YYYY')
}
