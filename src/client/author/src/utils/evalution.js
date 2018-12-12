import evaluators from './evaluators';

export const evaluateItem = (answers, validations) => {
  const answerIds = Object.keys(answers);
  const results = {};
  let totalScore = 0;
  let totalMaxScore = 0;

  answerIds.forEach((id) => {
    const answer = answers[id];
    if (validations && validations[id]) {
      const validation = validations[id];
      const evaluator = evaluators[validation.type];

      if (!evaluator) {
        results[id] = [];
      } else {
        const { evaluation, score, maxScore } = evaluator({
          userResponse: answer,
          hasGroupResponses: validation.hasGroupResponses,
          validation: validation.validation
        });

        results[id] = evaluation;
        totalScore += score;
        totalMaxScore += maxScore;
      }
    } else {
      results[id] = [];
    }
  });

  return { evaluation: results, maxScore: totalMaxScore, score: totalScore };
};
