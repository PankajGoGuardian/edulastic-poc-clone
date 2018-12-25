import multipleChoice from './multipleChoice';
import orderList from './orderList';
import clozeDragDrop from './clozeDragDrop';
import clozeImageDragDrop from './clozeImageDragDrop';
import clozeImageDropDown from './clozeImageDropDown';
import clozeDropDown from './clozeDropDown';
import clozeText from './clozeText';

const evaluators = {
  orderList,
  multipleChoice,
  clozeDragDrop,
  clozeImageDragDrop,
  clozeImageDropDown,
  clozeDropDown,
  clozeText,
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
    if (evaluator) {
      results[id] = evaluator(question, answer);
    }
  });
  console.log('utils show answer result', results);
  return results;
};
export default createShowAnswerResult;
