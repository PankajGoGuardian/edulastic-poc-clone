import {
  orderList,
  multipleChoice,
  sortList,
  hotspot,
  clozeText,
  clozeImageDragDrop,
  clozeImageDropDown,
  math,
  shortText,
  clozeDragDrop,
  classification,
  graph,
  tokenhighlight,
  choiceMatrix,
  shading
} from '@edulastic/evaluators';

const evaluators = {
  orderList,
  multipleChoice,
  shortText,
  clozeText,
  clozeDropDown: clozeText,
  clozeImageDragDrop,
  clozeImageDropDown,
  clozeDragDrop,
  choiceMatrix,
  graph,
  classification,
  matchList: sortList,
  sortList,
  math,
  hotspot,
  tokenhighlight,
  shading
};

export const evaluateAnswer = (question) => {
  const evaluator = evaluators[question.type];
  const evaluation = evaluator(question);
  return evaluation;
};
