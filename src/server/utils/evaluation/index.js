import { orderList, multipleChoice, clozeText, math, graph } from '@edulastic/evaluators';

const evaluators = {
  orderList,
  multipleChoice,
  clozeText,
  clozeDropDown: clozeText,
  graph,
  math
};

export const evaluateAnswer = (question) => {
  const evaluator = evaluators[question.type];
  const evaluation = evaluator(question);
  return evaluation;
};
