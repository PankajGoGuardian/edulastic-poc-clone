const exactMatchEvaluator = ({ minScoreIfAttempted, validResponse }) => ({
  score: undefined,
  maxScore: validResponse?.score || 0,
  evaluation: {}
});

const evaluator = ({ validation = {} }) => exactMatchEvaluator(validation);

export default evaluator;
