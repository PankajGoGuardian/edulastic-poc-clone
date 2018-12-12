import { orderList, multipleChoice, clozeText } from '@edulastic/evaluators';

const evaluators = {
  orderList,
  multipleChoice,
  clozeText,
  clozeDropDown: clozeText
};

export const evaluateAnswer = (question) => {
  const evaluator = evaluators[question.type];
  const evaluation = evaluator(question);
  return evaluation;
};
