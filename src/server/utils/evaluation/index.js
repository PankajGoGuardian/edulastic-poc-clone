import multipleChoice from './evaluators/mcq';
import orderList from './evaluators/orderlist';

const evaluators = {
  orderList,
  multipleChoice
};

export const evaluateAnswer = (question) => {
  const evaluator = evaluators[question.type];
  return evaluator(question);
};
