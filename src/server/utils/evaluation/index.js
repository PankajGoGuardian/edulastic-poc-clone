import { orderList, multipleChoice, clozeText, graph } from '@edulastic/evaluators';

const evaluators = {
  orderList,
  multipleChoice,
  clozeText,
  clozeDropDown: clozeText,
  graph
};

export const evaluateAnswer = (question) => {
  const evaluator = evaluators[question.type];
  const evaluation = evaluator(question);
  return evaluation;
};
