import multipleChoice from './multipleChoice';
import orderList from './orderList';

const evaluators = {
  orderList,
  multipleChoice,
};

const createShowAnswerResult = (questions, answers) => {
  const questionIds = Object.keys(questions);
  const results = {};
  // for each question create evaluation obj
  questionIds.forEach((id) => {
    const question = questions[id];
    const evaluator = evaluators[question.type];
    const answer = answers[id];
    results[id] = evaluator(question, answer);
  });

  return results;
};
export default createShowAnswerResult;
