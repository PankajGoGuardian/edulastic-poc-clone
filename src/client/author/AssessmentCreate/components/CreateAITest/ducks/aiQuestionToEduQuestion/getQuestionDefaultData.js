import { questionType, questionTitle } from '@edulastic/constants'
import { EXACT_MATCH } from '@edulastic/constants/const/evaluationType'
import uuid from 'uuid/v4'

export const getDefaultDataByQuestionType = (type) => {
  const uuids = [uuid(), uuid(), uuid(), uuid()]

  const defaultDataByQuestionType = {
    MCQ_TF: {
      title: questionTitle.MCQ_TRUE_OR_FALSE,
      type: questionType.MULTIPLE_CHOICE,
      stimulus: '',
      uiStyle: {
        type: 'standard',
      },
      options: [
        { value: uuids[0], label: 'True' },
        { value: uuids[1], label: 'False' },
      ],
      validation: {
        scoringType: EXACT_MATCH,
        validResponse: {
          score: 1,
          value: [uuids[0]],
        },
        altResponses: [],
      },
      multipleResponses: false,
      hints: [{ value: uuids[0], label: '' }],
    },
    MCQ_MS: {
      title: questionTitle.MCQ_MULTIPLE_RESPONSE,
      type: questionType.MULTIPLE_CHOICE,
      stimulus: '',
      uiStyle: {
        type: 'standard',
      },
      options: [
        { value: uuids[0], label: '' },
        { value: uuids[1], label: '' },
        { value: uuids[2], label: '' },
        { value: uuids[3], label: '' },
      ],
      validation: {
        scoringType: EXACT_MATCH,
        validResponse: {
          score: 1,
          value: [uuids[1]],
        },
        altResponses: [],
      },
      multipleResponses: true,
      hints: [{ value: uuids[0], label: '' }],
    },
    MCQ_ST: {
      title: questionTitle.MCQ_STANDARD,
      type: questionType.MULTIPLE_CHOICE,
      stimulus: '',
      uiStyle: {
        type: 'standard',
      },
      options: [
        { value: uuids[0], label: '' },
        { value: uuids[1], label: '' },
        { value: uuids[2], label: '' },
        { value: uuids[3], label: '' },
      ],
      validation: {
        scoringType: EXACT_MATCH,
        validResponse: {
          score: 1,
          value: [uuids[0]],
        },
        altResponses: [],
      },
      multipleResponses: false,
      hints: [{ value: uuids[0], label: '' }],
    },
  }

  return defaultDataByQuestionType[type]
}
