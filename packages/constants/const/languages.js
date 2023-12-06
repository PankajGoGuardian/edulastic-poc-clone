const { languageCodes } = require('./test')

const LANGUAGE_EN = languageCodes.ENGLISH
const LANGUAGE_ES = languageCodes.SPANISH
const ENGLISH = 'english'
const SPANISH = 'spanish'

const LANGUAGES_OPTIONS = [
  {
    value: LANGUAGE_EN,
    label: 'English',
  },
  {
    value: LANGUAGE_ES,
    label: 'Spanish',
  },
]

const VOICE_LANGUAGE_OPTIONS = [
  {
    value: ENGLISH,
    label: 'English',
  },
  {
    value: SPANISH,
    label: 'Spanish',
  },
]
module.exports = {
  LANGUAGE_EN,
  LANGUAGE_ES,
  LANGUAGES_OPTIONS,
  VOICE_LANGUAGE_OPTIONS,
  ENGLISH,
  SPANISH,
}
