import { orderList, multipleChoice } from '@edulastic/evaluators';

const evaluators = {
  orderList,
  multipleChoice
};

export const evaluateAnswer = (question) => {
  const evaluator = evaluators[question.type];
  const evaluation = evaluator(question);
  return evaluation.evaluation;
};
