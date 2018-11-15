import QuestionModel from '../models/question';

// append Questions data to testItems
export const getQuestionsData = async (item, isAuthor) => {
  const { rows, columns } = item;
  let questionIds = [];
  [...rows, ...columns].forEach((entry) => {
    const qIds = entry.widgets.map(w => w.reference);
    questionIds = [...questionIds, ...qIds];
  });

  const question = new QuestionModel();
  const questions = await question.selectQuestionsByIds(questionIds);
  questions.forEach((q) => {
    if (!isAuthor) {
      delete q.data.validation;
    }
  });
  return questions;
};
