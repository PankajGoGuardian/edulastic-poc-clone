const LANGUAGE_EN = 'en'
const LANGUAGE_ES = 'es'
const LANGUAGE_FN = 'fr'

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

const TTS_LANGUAGES = [
  {
    value: 'english',
    label: 'English',
  },
  {
    value: 'spanish',
    label: 'Spanish',
  },
  {
    value: 'french',
    label: 'French',
  },
]

module.exports = {
  LANGUAGE_EN,
  LANGUAGE_ES,
  LANGUAGE_FN,
  LANGUAGES_OPTIONS, // this is for multi language feature in question
  TTS_LANGUAGES, // this is for tts of content in item level
}
