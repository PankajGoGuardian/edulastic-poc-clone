import { createSelector } from "reselect";
import { values, get } from "lodash";

export const getAnswersListSelector = state => state.answers;
export const getAnswersArraySelector = createSelector(
  getAnswersListSelector,
  answers => values(answers)
);

export const getAnswerByQuestionIdSelector = questionId => answers => (questionId ? answers[questionId] : undefined);

const getActivityFromPropsSelector = (state, props) => props.activity;

const isReviewTabSelector = (state, props) => !!props.isReviewTab;
const getQuestionIdFromPropsSelector = (state, props) => {
  const {
    data: { id },
    questionId
  } = props;
  return questionId || id;
};
const getQuestionSelector = (state, props) => {
  const { data } = props;
  return data;
};

const getQuestionId = questionId => questionId || "tmp";

export const getUserAnswerSelector = createSelector(
  [
    getActivityFromPropsSelector,
    getQuestionIdFromPropsSelector,
    getAnswersListSelector,
    isReviewTabSelector,
    getQuestionSelector
  ],
  (activity, questionId, answers, isReviewTab, question) => {
    if (!questionId) return undefined;

    if (isReviewTab) {
      return get(question, ["validation", "valid_response", "value"]);
    }

    let userAnswer;
    if (activity && activity.userResponse) {
      userAnswer = activity.userResponse;
    } else {
      const qId = getQuestionId(questionId);
      userAnswer = getAnswerByQuestionIdSelector(qId)(answers);
    }

    return userAnswer;
  }
);

const getEvaluationSelector = (state, props) => props.evaluation || state.evaluation;

export const getEvaluationByIdSelector = createSelector(
  [getEvaluationSelector, getQuestionIdFromPropsSelector],
  (evaluation, questionId) => evaluation[getQuestionId(questionId)]
);
