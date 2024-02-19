import { test as testConstants } from '@edulastic/constants'

const { languageCodes } = testConstants

const transcribeConfig = {
  language: {
    [languageCodes.ENGLISH]: 'en-US',
    [[languageCodes.SPANISH]]: 'es-US',
  },
  sampleRate: 44100,
  mediaEncoding: 'pcm',
}

export default transcribeConfig
