const exactMatchEvaluator = ({ minScoreIfAttempted, maxScore }) => ({
  score: minScoreIfAttempted || 0,
  maxScore: maxScore || 1,
  evaluation: {}
});

const evaluator = ({ validation = {} }) => exactMatchEvaluator(validation);

export default evaluator;
