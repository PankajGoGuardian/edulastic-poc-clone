import { get } from 'lodash'

export const getUpdatedAnnotation = ({
  annotations,
  question,
  questionId,
  timestamp,
}) => {
  timestamp = timestamp === 0 ? null : timestamp
  const annotationIndex = (annotations || []).findIndex(
    (annotation) => annotation?.questionId === questionId
  )
  if (annotationIndex === -1) {
    return {
      x: -1,
      y: -1,
      questionId: question.id,
      qIndex: question.qIndex,
      time: timestamp,
    }
  }
  const existingAnnotation = annotations[annotationIndex]
  return {
    ...existingAnnotation,
    time: timestamp,
  }
}

export const isSubmitButton = (ev) => {
  if (ev) {
    return [
      get(ev, 'relatedTarget.id', ''),
      get(ev, 'relatedTarget.parentElement.id', ''),
    ].includes('submitTestButton')
  }
  return false
}
