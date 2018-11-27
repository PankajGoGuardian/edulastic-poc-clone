import multipleChoice from './evaluators/mcq';
import orderList from './evaluators/orderlist';
import clozeDragDrop from './evaluators/clozeDragDrop';
import clozeImageDragDrop from './evaluators/clozeImageDragDrop';

const evaluators = {
  orderList,
  multipleChoice,
  clozeDragDrop,
  clozeImageDragDrop
};

export const evaluateAnswer = (question) => {
  const evaluator = evaluators[question.type];
  return evaluator(question);
};
