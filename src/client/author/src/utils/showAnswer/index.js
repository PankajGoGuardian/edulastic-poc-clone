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
        const expression = answer.expression || "";
        const unit = answer.unit ? answer.unit : "";
        if (expression.search("=") === -1) {
          answer = expression + unit;
        } else {
          answer = expression.replace(/=/gm, `${unit}=`);
        }
      }
      const { evaluation } = await evaluator({ userResponse: answer, validation: question.validation });
      results[id] = evaluation;
    }
  }

  return results;
};
export default createShowAnswerResult;
