import multipleChoice from './multipleChoice';
import orderList from './orderList';
import clozeDragDrop from './clozeDragDrop';
import clozeImageDragDrop from './clozeImageDragDrop';

const evaluators = {
  orderList,
  multipleChoice,
  clozeDragDrop,
  clozeImageDragDrop
};

const createShowAnswerResult = (questions, answers) => {
  const questionIds = Object.keys(questions);
  const results = {};
  console.log('here utils show answer');
  // for each question create evaluation obj
  questionIds.forEach((id) => {
    const question = questions[id];
    const evaluator = evaluators[question.type];
    const answer = answers[id];
    results[id] = evaluator(question, answer);
  });
  console.log('utils show answer result', results);
  return results;
};
export default createShowAnswerResult;
