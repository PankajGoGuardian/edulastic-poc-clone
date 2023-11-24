const isURL = (input) => {
  try {
    // eslint-disable-next-line no-new
    new URL(input)
    return true
  } catch (error) {
    return false
  }
}

const getDefaultSearchString = (subjects = [], grades = []) => {
  const [subject = ''] = subjects
  const [grade = ''] = grades

  switch (true) {
    case !!subject && !!grade:
      return `${subject} for Grade ${grade}`
    case !!subject:
      return subject
    case !!grade:
      return `Grade ${grade}`
    default:
      return 'colors and numbers for kids'
  }
}

const parseISO8601Duration = (durationString) => {
  // Create a regular expression to match the ISO 8601 duration format.
  const regex = /(-?)P(?:([.,\d]+)Y)?(?:([.,\d]+)M)?(?:([.,\d]+)W)?(?:([.,\d]+)D)?T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?/

  const match = regex.exec(durationString)

  if (match) {
    const hour = match[6] || 0
    const minute = match[7] || 0
    const second = match[8] || 0

    return `${hour ? `${hour.padStart(2, '0')}:` : ''}${
      minute ? minute.padStart(2, '0') : '00'
    }:${second ? second.padStart(2, '0') : '00'}`
  }
  return '--:--'
}

const trimTextToGivenLength = (text = '', textLength) => {
  if (text.length > textLength) {
    return `${text.substring(0, textLength)}...`
  }
  return text
}

export {
  isURL,
  getDefaultSearchString,
  parseISO8601Duration,
  trimTextToGivenLength,
}
