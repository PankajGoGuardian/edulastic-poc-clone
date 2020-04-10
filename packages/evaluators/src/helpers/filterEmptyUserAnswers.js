import produce from "immer";

const filterEmptyResponses = {
  maths(maths = {}) {
    // do not mutate the original answers
    // return a new copy
    return produce(maths, draft => {
      for (const [key, value] of Object.entries(draft)) {
        if (value.value === "") {
          delete draft[key];
        }
      }
    });
  },
  mathWithUnits(mathUnits = {}) {
    // do not mutate the original answers
    // return a new copy
    return produce(mathUnits, draft => {
      for (const [key, value] of Object.entries(draft)) {
        if (value.value === "" && !value.unit) {
          delete draft[key];
        }
      }
    });
  }
};

/**
 * This function filters out empty responses given by user
 * Ideally, We should not evaluate the empty responses
 *
 * @param {Object} userAnswers (answers given by user)
 * @param {String} type  (type of the question)
 */

export function filterEmptyAnswers({ userAnswers, type }) {
  if (filterEmptyResponses[type]) {
    return filterEmptyResponses[type](userAnswers);
  }
  return userAnswers;
}
