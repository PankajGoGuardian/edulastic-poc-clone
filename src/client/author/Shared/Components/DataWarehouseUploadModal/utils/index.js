import { isEmpty } from 'lodash'

export const getYear = (timestamp) => new Date(timestamp).getFullYear()

export const NON_ACADEMIC_DATA_TYPE_KEY = 'non-academic'
export const ACADEMIC_DATA_TYPE_KEY = 'academic'

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
  return [
    {
      title: 'Non-Academic Data',
      value: NON_ACADEMIC_DATA_TYPE_KEY,
      key: NON_ACADEMIC_DATA_TYPE_KEY,
      selectable: false,
      children: nonAcademicFeedTypes,
    },
    {
      title: 'Academic Data',
      value: ACADEMIC_DATA_TYPE_KEY,
      key: ACADEMIC_DATA_TYPE_KEY,
      selectable: false,
      children: academicFeedTypes,
    },
  ]
}
