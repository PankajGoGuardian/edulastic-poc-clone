const getPartialPerResponse = count => ({ score, maxScore, evaluation }) => ({
  score: score * count,
  maxScore: maxScore * count,
  evaluation
});

export default getPartialPerResponse;
