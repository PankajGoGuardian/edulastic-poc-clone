import TestItemActivityModel from '../models/userTestItemActivity';
import QuestionModel from '../models/question';
import { evaluateAnswer } from './evaluation';

const scoreTestActivty = async (testActivityId, userId) => {
  const TestItemActivity = new TestItemActivityModel();
  const Question = new QuestionModel();
  const itemActivities = await TestItemActivity.getByTestActivityId(
    testActivityId,
    userId
  );

  let answers = {};
  itemActivities.forEach((item) => {
    answers = { ...answers, ...item.answers };
  });

  const qIds = Object.keys(answers);
  const questions = await Question.selectQuestionsByIds(qIds);

  const questionsData = questions.map(({ data, _id }) => ({
    _id,
    type: data.type,
    validation: data.validation,
    userResponse: answers[_id]
  }));
  const evaluations = {};

  questionsData.forEach((item) => {
    evaluations[item._id] = evaluateAnswer(item);
  });

  const eIds = Object.keys(evaluations);
  let totalScore = 0;
  let correctAnswers = 0;
  eIds.forEach((eid) => {
    const { evaluation, score } = evaluations[eid];
    const values = Object.values(evaluation);
    if (!values.includes(false)) {
      correctAnswers++;
      totalScore += score;
    }
  });
  return { correctAnswers, score: totalScore };
};

export default scoreTestActivty;
