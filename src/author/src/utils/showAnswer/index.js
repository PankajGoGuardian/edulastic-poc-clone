import multipleChoice from './multipleChoice';
import orderList from './orderList';

const evaluators = {
  orderList,
  multipleChoice,
};

const createShowAnswerResult = (questions) => {
  const questionIds = Object.keys(questions);
  const results = {};
  // for each question create evaluation obj
  questionIds.forEach((id) => {
    const question = questions[id];
    const evaluator = evaluators[question.type];
    results[id] = evaluator(question);
  });

  return results;
};
export default createShowAnswerResult;
