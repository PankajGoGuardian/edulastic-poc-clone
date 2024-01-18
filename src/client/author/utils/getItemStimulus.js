import { question } from '@edulastic/constants'
import {
  ENGLISH,
  LANGUAGES_OPTIONS,
} from '@edulastic/constants/const/languages'
import get from 'lodash/get'

const getItemStimulus = (item) => {
  let stimulus
  const language = get(item, 'language', ENGLISH)
  const languageCode = LANGUAGES_OPTIONS.find(
    (lg) => lg?.label?.toLowerCase() === language?.toLowerCase()
  )?.value?.toLowerCase()
  if (language !== ENGLISH) {
    stimulus = get(
      item,
      ['data', 'questions', 0, 'languageFeatures', languageCode, 'stimulus'],
      question.DEFAULT_STIMULUS
    )
  } else {
    stimulus = get(
      item,
      ['data', 'questions', 0, 'stimulus'],
      question.DEFAULT_STIMULUS
    )
  }
  return stimulus
}

export default getItemStimulus
