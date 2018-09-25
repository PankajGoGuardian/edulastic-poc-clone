import { translate } from '../utils/localization';
import {
  ORDERLIST_ADD_ALT_RESPONSES,
  ORDERLIST_CLEAR,
  ORDERLIST_SET_STATE,
  ORDERLIST_UPDATE_ALT_VALIDATION_SCORE,
  ORDERLIST_UPDATE_CORRECT_VALIDATION_SCORE,
  ORDERLIST_UPDATE_QUESTIONS_LIST,
  ORDERLIST_UPDATE_STIMULUS,
  ORDERLIST_UPDATE_VALIDATION,
} from '../constants/actions';

const initialList = [
  translate('common.initialoptionslist.itema'),
  translate('common.initialoptionslist.itemb'),
  translate('common.initialoptionslist.itemc'),
  translate('common.initialoptionslist.itemd'),
];

export const initialState = {
  list: initialList,
  stimulus: translate('component.orderlist.questionsorderlist.stimulusplaceholder'),
  validation: {
    valid_response: {
      score: 1,
      value: initialList.map((item, i) => i),
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
    case ORDERLIST_UPDATE_QUESTIONS_LIST:
      return {
        ...state,
        list: payload.questions,
        validation: {
          ...state.validation,
          valid_response: {
            score: state.validation.valid_response.score,
            value: updateValue(state, payload),
          },
        },
      };
    case ORDERLIST_UPDATE_VALIDATION:
      return { ...state, validation: payload.validation };
    case ORDERLIST_UPDATE_ALT_VALIDATION_SCORE:
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
    case ORDERLIST_UPDATE_CORRECT_VALIDATION_SCORE:
      return {
        ...state,
        validation: {
          ...state.validation,
          valid_response: { ...state.validation.valid_response, score: payload.score },
        },
      };
    case ORDERLIST_CLEAR:
      return initialState;
    case ORDERLIST_ADD_ALT_RESPONSES:
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
    case ORDERLIST_SET_STATE:
      return payload.state;
    case ORDERLIST_UPDATE_STIMULUS:
      return { ...state, stimulus: payload.stimulus };

    default:
      return state;
  }
}
