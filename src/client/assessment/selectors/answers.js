import { createSelector } from "reselect";
import { values } from "lodash";

export const getAnswersListSelector = state => state.answers;
export const getAnswersArraySelector = createSelector(
  getAnswersListSelector,
  answers => values(answers)
);

export const getAnswerByQuestionIdSelector = questionId => answers => (questionId ? answers[questionId] : undefined);

const getActivityFromPropsSelector = (state, props) => props.activity;

const getQuestionIdFromPropsSelector = (state, props) => {
  const {
    data: { id },
    questionId
  } = props;
  return questionId || id;
};

const getQuestionId = questionId => questionId || "tmp";

export const getUserAnswerSelector = createSelector(
  [getActivityFromPropsSelector, getQuestionIdFromPropsSelector, getAnswersListSelector],
  (activity, questionId, answers) => {
    if (!questionId) return undefined;

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

// selectors
const itemsSelector = state => state.test.items;
const answersSelector = state => state.answers;

export const getSkippedAnswerSelector = createSelector(
  [itemsSelector, answersSelector],
  (items, answers) => {
    const skippedItems = [];
    const answeredQids = Object.keys(answers).filter(ans => !!answers[ans]);
    items.forEach((item, index) => {
      const qIds = item.data.questions.map(q => q.id);
      const isAnswered = qIds.some(id => answeredQids.includes(id));
      skippedItems[index] = !isAnswered;
    });
    return skippedItems;
  }
);
