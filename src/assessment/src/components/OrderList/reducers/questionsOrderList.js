import i18n from '@edulastic/localization';

import {
  ORDERLIST_ADD_ALT_RESPONSES,
  ORDERLIST_UPDATE_ALT_VALIDATION_SCORE,
  ORDERLIST_UPDATE_CORRECT_VALIDATION_SCORE,
} from '../constants/actions';

const initialList = [
  i18n.t('assessment:common.initialoptionslist.itema'),
  i18n.t('assessment:common.initialoptionslist.itemb'),
  i18n.t('assessment:common.initialoptionslist.itemc'),
  i18n.t('assessment:common.initialoptionslist.itemd'),
];

export const initialState = {
  list: initialList,
  stimulus: i18n.t('assessment:component.orderlist.questionsorderlist.stimulusplaceholder'),
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
