export const getUpdatedAnnotation = ({
  annotations,
  question,
  questionId,
  timestamp,
  qNumber,
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
      qIndex: qNumber,
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
      ev?.relatedTarget?.id || '',
      ev?.relatedTarget?.parentElement?.id || '',
    ].includes('submitTestButton')
  }
  return false
}

export const validateStandardsData = (data) => {
  const requiredFieldsTitleMap = {
    subject: 'Subject',
    grades: 'Grades',
    curriculum: 'Curriculum',
  }
  let isValid = true
  let message = ''
  const inValidFieldsTitle = []

  Object.keys(requiredFieldsTitleMap).forEach((field) => {
    const value = data[field]
    if (!value || value?.length <= 0) {
      isValid = false
      inValidFieldsTitle.push(requiredFieldsTitleMap[field])
    }
  })

  if (!isValid) {
    message = `${inValidFieldsTitle.join(', ')} field(s) cannot be empty`
  }

  return { isValid, message }
}
