import { question } from '@edulastic/constants'
import get from 'lodash/get'

/* 
  Description: 
  This function get stimulus of item based on certain criteria
  1. Default stimulus will be of english content.
  2. If english content is empty, then will get the stimulus of first language in languageFeatures object.
  3. If both the stimulus is empty then will show default stimulus
*/
const getItemStimulus = (item) => {
  let stimulus = get(item, ['data', 'questions', 0, 'stimulus'])
  const languageFeatures = get(item, [
    'data',
    'questions',
    0,
    'languageFeatures',
  ])
  if (languageFeatures && !stimulus) {
    // Extracting the first languageCode from keys of languageFeatures
    const languageCode = Object.keys(languageFeatures).shift()
    stimulus = languageFeatures?.[languageCode]?.stimulus
  }
  return stimulus || question.DEFAULT_STIMULUS
}

export default getItemStimulus
