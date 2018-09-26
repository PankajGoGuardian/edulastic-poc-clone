import { translate } from '../utils/localization';
import {
  ORDERLIST_ADD_ALT_RESPONSES,
  ORDERLIST_UPDATE_ALT_VALIDATION_SCORE,
  ORDERLIST_UPDATE_CORRECT_VALIDATION_SCORE,
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

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
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
    default:
      return state;
  }
}
