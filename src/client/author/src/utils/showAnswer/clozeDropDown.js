const createEvaluation = ({ hasGroupResponses, validation }, answer = []) => {
  const correctAnswers = validation.validResponse.value;
  const evaluation = answer.map((option, index) => {
    if (hasGroupResponses) {
      return correctAnswers[index].group === option.group && correctAnswers[index].data === option.data;
    }
    return correctAnswers[index] === option;
  });
  return evaluation;
};

export default createEvaluation;
