import { createSelector } from 'reselect';

import config from '../config';

const { appName } = config;

const initialList = ['[Choice A]', '[Choice B]', '[Choice C]', '[Choice D]'];

export const initialState = {
  list: initialList,
  stimulus: '[This is the stem.]',
  validation: {
    valid_response: {
      score: 1,
      value: initialList.map((item, i) => i),
    },
    alt_responses: [],
  },
};

export const moduleName = 'questionsOrderList';
export const UPDATE_QUESTIONS_LIST = `${appName}/${moduleName}/UPDATE_QUESTIONS_LIST`;
export const UPDATE_VALIDATION = `${appName}/${moduleName}/UPDATE_VALIDATION`;
export const UPDATE_STIMULUS = `${appName}/${moduleName}/UPDATE_STIMULUS`;
export const SET_STATE = `${appName}/${moduleName}/SET_STATE`;
export const CLEAR = `${appName}/${moduleName}/CLEAR`;
export const ADD_ALT_RESPONSES = `${appName}/${moduleName}/ADD_ALT_RESPONSES`;
export const UPDATE_ALT_VALIDATION_SCORE = `${appName}/${moduleName}/UPDATE_ALT_VALIDATION_SCORE`;
export const UPDATE_CORRECT_VALIDATION_SCORE = `${appName}/${moduleName}/UPDATE_CORRECT_VALIDATION_SCORE`;

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
    case UPDATE_QUESTIONS_LIST:
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
    case UPDATE_VALIDATION:
      return { ...state, validation: payload.validation };
    case UPDATE_ALT_VALIDATION_SCORE:
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
    case UPDATE_CORRECT_VALIDATION_SCORE:
      return {
        ...state,
        validation: {
          ...state.validation,
          valid_response: { ...state.validation.valid_response, score: payload.score },
        },
      };
    case CLEAR:
      return initialState;
    case ADD_ALT_RESPONSES:
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
    case SET_STATE:
      return payload.state;
    case UPDATE_STIMULUS:
      return { ...state, stimulus: payload.stimulus };

    default:
      return state;
  }
}

/**
|--------------------------------------------------
| Actions
|--------------------------------------------------
*/

export function updateQuestionsListAction(questions) {
  return {
    type: UPDATE_QUESTIONS_LIST,
    payload: { questions },
  };
}

export function updateStimulusAction(stimulus) {
  return {
    type: UPDATE_STIMULUS,
    payload: { stimulus },
  };
}

export function updateValidationAction(validation) {
  return {
    type: UPDATE_VALIDATION,
    payload: { validation },
  };
}

export function updateAltValidationScoreAction(score, index) {
  return {
    type: UPDATE_ALT_VALIDATION_SCORE,
    payload: { score, index },
  };
}

export function updateCorrectValidationScoreAction(score) {
  return {
    type: UPDATE_CORRECT_VALIDATION_SCORE,
    payload: { score },
  };
}

export function setQuestionsStateAction(state) {
  return {
    type: SET_STATE,
    payload: { state },
  };
}

export function clearQuestionsAction() {
  return {
    type: CLEAR,
  };
}

export function addAltResponsesAction() {
  return {
    type: ADD_ALT_RESPONSES,
  };
}

/**
|--------------------------------------------------
| Selectors
|--------------------------------------------------
*/

export const getQuestionsStateSelector = state => state[moduleName];
export const getQuestionsListSelector = createSelector(
  getQuestionsStateSelector,
  state => state.list,
);
export const validationSelector = createSelector(
  getQuestionsStateSelector,
  state => state.validation,
);
export const getStimulusSelector = createSelector(
  getQuestionsStateSelector,
  state => state.stimulus,
);
export const getValidationSelector = createSelector(
  validationSelector,
  getQuestionsListSelector,
  (validation, list) => ({
    ...validation,
    valid_response: {
      score: validation.valid_response.score,
      value: validation.valid_response.value.map(val => list[val]),
    },
    alt_responses: validation.alt_responses.map(res => ({
      score: res.score,
      value: res.value.map(val => list[val]),
    })),
  }),
);
