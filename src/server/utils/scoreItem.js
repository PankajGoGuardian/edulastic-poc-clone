import { evaluateAnswer } from './evaluation';
import QuestionModel from '../models/question';

/*
* evaluate a particular test item
* @params userReponses {Obj} - object containing userresponse for a particular item
* @params qIds {[]string} - all questionIds in that testItem
* @return Obj - returns an object containing score, correctAnswer ans maxScore
*/
export const scoreTestItem = async (userResponses, qIds) => {
  const Question = new QuestionModel();

  const questions = await Question.selectQuestionsByIds(qIds);

  // format question for passing to evaluator
  const questionsData = questions.map(({ data, _id }) => ({
    _id,
    type: data.type,
    validation: data.validation,
    userResponse: userResponses[_id]
  }));
  const evaluations = {};

  // evaluation
  questionsData.forEach((item) => {
    evaluations[item._id] = evaluateAnswer(item);
  });

  // calculate score
  const eIds = Object.keys(evaluations);
  let totalScore = 0;
  let correctAnswers = 0;
  let totalMaxScore = 0;

  eIds.forEach((eid) => {
    const { evaluation, score, maxScore } = evaluations[eid];
    const values = Object.values(evaluation);
    if (!values.includes(false)) {
      correctAnswers++;
      totalScore += score;
    }

    totalMaxScore += maxScore;
  });

  return {
    evaluations,
    correct: correctAnswers,
    score: totalScore,
    maxScore: totalMaxScore
  };
};
