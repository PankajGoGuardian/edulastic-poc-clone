import evaluators from './evaluators';

export const evaluateItem = (answers, validations) => {
  const answerIds = Object.keys(answers);
  const results = {};
  answerIds.forEach((id) => {
    const answer = answers[id];
    if (validations && validations[id]) {
      const validation = validations[id];
      const evaluator = evaluators[validation.type];
      results[id] = evaluator({
        userResponse: answer,
        hasGroupResponses: validation.hasGroupResponses,
        validation: validation.validation,
      });
    } else {
      results[id] = [];
    }
  });

  return results;
};
