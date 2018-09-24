const evaluateMCQ = (answer, uAnswer) => answer == uAnswer;

const evaluateMapper = {
  mcq: evaluateMCQ
};

export const evaluateQuestion = (question, uAnswer) => {
  let { type, answer } = question._doc;
  return evaluateMapper[type](answer, uAnswer);
};
