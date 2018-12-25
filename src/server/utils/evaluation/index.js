import { orderList, multipleChoice, clozeText, clozeImageDragDrop, clozeImageDropDown, math, graph } from '@edulastic/evaluators';

const evaluators = {
  orderList,
  multipleChoice,
  clozeText,
  clozeDropDown: clozeText,
  clozeImageDragDrop,
  clozeImageDropDown,
  graph,
  math
};

export const evaluateAnswer = (question) => {
  const evaluator = evaluators[question.type];
  const evaluation = evaluator(question);
  return evaluation;
};
