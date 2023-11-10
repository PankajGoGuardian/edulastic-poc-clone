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

const SUBJECT = 'subject'
const GRADES = 'grades'
const STANDARD_SET = 'standardSet'
const CURRICULUM_STANDARDS = 'curriculumStandards'

export const standardsFields = {
  SUBJECT,
  GRADES,
  STANDARD_SET,
  CURRICULUM_STANDARDS,
}

const FORWARD = 'FORWARD'
const BACKWARD = 'BACKWARD'
const SEEK_STEP_COUNT = 1

export const SEEK_DATA = {
  FORWARD,
  BACKWARD,
  SEEK_STEP_COUNT,
}

export const KEYCODES = {
  SPACE: 32,
  LEFT_ARROW: 37,
  RIGHT_ARROW: 39,
}

export const questionGenerationLoadingTexts = [
  'Your personalized quiz is in the making!',
  'AI engines are analyzing your inputs',
  'Crafting tailored items just for you',
  'AI wizards are curating items based on your inputs',
  'Aligning items with your chosen standards and subjects',
  'Building your quiz empire!',
  'Your questions are in the oven, baking to perfection. Thanks for your patience',
]

export const questionGenerationStatus = {
  INITIAL: 'INITIAL',
  IN_PROGRESS: 'IN_PROGRESS',
  SUCCESS: 'SUCCESS',
}
