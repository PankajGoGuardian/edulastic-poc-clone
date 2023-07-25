import {
  SHORT_TEXT,
  MULTIPLE_CHOICE,
  CLOZE_DROP_DOWN,
  MATH,
  TRUE_OR_FALSE,
  ESSAY_PLAIN_TEXT,
  AUDIO_RESPONSE,
} from '@edulastic/constants/const/questionType'
import uuid from 'uuid/v4'
import { math } from '@edulastic/constants'

const { methods, defaultNumberPad } = math

export const defaultQuestionValue = {
  [MULTIPLE_CHOICE]: [],
  [SHORT_TEXT]: '',
  [TRUE_OR_FALSE]: [],
  [CLOZE_DROP_DOWN]: [],
  [MATH]: [
    {
      method: methods.EQUIV_SYMBOLIC,
      options: {
        inverseResult: false,
      },
      value: '',
    },
  ],
}

export const defaultQuestionOptions = {
  [MULTIPLE_CHOICE]: [
    { label: 'A', value: uuid() },
    { label: 'B', value: uuid() },
    { label: 'C', value: uuid() },
    { label: 'D', value: uuid() },
  ],
  [CLOZE_DROP_DOWN]: {
    0: ['A', 'B'],
  },
  [TRUE_OR_FALSE]: [
    { label: 'TRUE', value: uuid() },
    { label: 'FALSE', value: uuid() },
  ],
}

export const mathData = {
  isMath: true,
  uiStyle: {
    type: 'floating-keyboard',
  },
  numberPad: defaultNumberPad,
  symbols: ['basic', 'units_si', 'units_us'],
  template: '',
}

export const multipleChoiceData = {
  uiStyle: { type: 'horizontal' },
}

export const clozeDropDownData = {
  responseIds: [{ index: 0, id: '0' }],
  stimulus: '',
}

export const essayData = {
  uiStyle: {
    numberOfRows: 10, // textarea number of rows
  },
  showWordCount: true,
}

export const trueOrFalseData = {
  type: 'multipleChoice',
  subType: 'trueOrFalse',
  uiStyle: { type: 'horizontal' },
}

/**
 * SHORT_TEXT,
  MULTIPLE_CHOICE,
  CLOZE_DROP_DOWN,
  MATH,
  TRUE_OR_FALSE,
  ESSAY_PLAIN_TEXT
 */

export const typeTitleHash = {
  [SHORT_TEXT]: 'Text Entry',
  [MULTIPLE_CHOICE]: 'Multiple choice - standard',
  [CLOZE_DROP_DOWN]: 'Cloze with Drop Down',
  [MATH]: 'Math - standard',
  [TRUE_OR_FALSE]: 'True or false',
  [ESSAY_PLAIN_TEXT]: 'Essay with plain text',
  [AUDIO_RESPONSE]: 'Audio Response',
}
