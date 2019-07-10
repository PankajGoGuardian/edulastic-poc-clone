import evaluators from "../evaluators";

const createShowAnswerResult = async (questions, answers) => {
  const questionIds = Object.keys(questions);
  const results = {};
  // for each question create evaluation obj
  for (const id of questionIds) {
    const question = questions[id];
    const evaluator = evaluators[question.type];
    const answer = answers[id];
    if (evaluator && question) {
      const { evaluation } = await evaluator({ userResponse: answer, validation: question.validation });
      results[id] = evaluation;
    }
  }

  return results;
};
export default createShowAnswerResult;
