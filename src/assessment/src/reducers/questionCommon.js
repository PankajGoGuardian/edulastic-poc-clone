import i18n from '@edulastic/localization';

import {
  QUESTIONCOMMON_ADD_ALT_RESPONSES,
  QUESTIONCOMMON_CLEAR,
  QUESTIONCOMMON_SET_STATE,
  QUESTIONCOMMON_UPDATE_ALT_VALIDATION_SCORE,
  QUESTIONCOMMON_UPDATE_CORRECT_VALIDATION_SCORE,
  QUESTIONCOMMON_UPDATE_QUESTIONS_LIST,
  QUESTIONCOMMON_UPDATE_STIMULUS,
  QUESTIONCOMMON_UPDATE_VALIDATION,
} from '../constants/actions';

const initialList = [
  i18n.t('assessment:common.initialoptionslist.itema'),
  i18n.t('assessment:common.initialoptionslist.itemb'),
  i18n.t('assessment:common.initialoptionslist.itemc'),
  i18n.t('assessment:common.initialoptionslist.itemd'),
];

export const initialState = {
  list: initialList,
  stimulus: '',
  validation: {
    valid_response: {
      score: 1,
      value: [],
    },
    alt_responses: [],
  },
};

const updateValue = (state, payload) => {
  let result = state.validation.valid_response.value.map((qIndex) => {
    const index = payload.questions.indexOf(state.list[qIndex]);
    if (index === -1) {
      return qIndex;
    }
    return payload.questions.indexOf(state.list[qIndex]);
  });

  if (result.length < payload.questions.length) {
    result = [...result, payload.questions.length - 1];
  }

  if (result.length > payload.questions.length) {
    result = result.filter(rItem => payload.questions[rItem] !== undefined);
  }

  return Array.from(new Set(result));
};

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case QUESTIONCOMMON_UPDATE_QUESTIONS_LIST:
      return {
        ...state,
        list: payload.questions.length === 0 ? initialList : payload.questions,
        validation: {
          ...state.validation,
          valid_response: {
            score: state.validation.valid_response.score,
            value: updateValue(state, payload),
          },
        },
      };
    case QUESTIONCOMMON_UPDATE_VALIDATION:
      return { ...state, validation: payload.validation };
    case QUESTIONCOMMON_UPDATE_ALT_VALIDATION_SCORE:
      return {
        ...state,
        validation: {
          ...state.validation,
          alt_responses: state.validation.alt_responses.map((res, i) => {
            if (i === payload.index) {
              return {
                ...res,
                score: payload.score,
              };
            }
            return res;
          }),
        },
      };
    case QUESTIONCOMMON_UPDATE_CORRECT_VALIDATION_SCORE:
      return {
        ...state,
        validation: {
          ...state.validation,
          valid_response: { ...state.validation.valid_response, score: payload.score },
        },
      };
    case QUESTIONCOMMON_CLEAR:
      return initialState;
    case QUESTIONCOMMON_ADD_ALT_RESPONSES:
      return {
        ...state,
        validation: {
          ...state.validation,
          alt_responses: [
            ...state.validation.alt_responses,
            {
              score: 1,
              value: state.list.map((item, i) => i),
            },
          ],
        },
      };
    case QUESTIONCOMMON_SET_STATE:
      return payload.state;
    case QUESTIONCOMMON_UPDATE_STIMULUS:
      return { ...state, stimulus: payload.stimulus };

    default:
      return state;
  }
}
