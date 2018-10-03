import { createSelector } from 'reselect';

export const moduleName = 'questionCommon';

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
