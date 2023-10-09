import { isEmpty } from 'lodash'

export const getYear = (timestamp) => new Date(timestamp).getFullYear()

export const NON_ACADEMIC_DATA_TYPE_KEY = 'non-academic'
export const ACADEMIC_DATA_TYPE_KEY = 'academic'
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
