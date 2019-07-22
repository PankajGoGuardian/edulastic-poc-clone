import evaluators from "../evaluators";

const createShowAnswerResult = async (questions, answers) => {
  const questionIds = Object.keys(questions);
  const results = {};
  // for each question create evaluation obj
  for (const id of questionIds) {
    const question = questions[id];
    const evaluator = evaluators[question.type];
    let answer = answers[id];
    if (evaluator && question && answer) {
      const { isUnits, is_math, showDropdown } = question;
      if (isUnits && is_math && showDropdown) {
        answer = (answer.expression || "").replace(/=/gm, `${answer.unit || ""}=`);
      }
      const { evaluation } = await evaluator({ userResponse: answer, validation: question.validation });
      results[id] = evaluation;
    }
  }

  return results;
};
export default createShowAnswerResult;
