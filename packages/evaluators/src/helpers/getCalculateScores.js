// eslint-disable-next-line max-len
const getCalculateScores = (score, mScore, { minScoreIfAttempted, automarkable, maxScore }) => {
  let newScore = score;
  let newMaxScore = mScore;

  if (automarkable) {
    if (minScoreIfAttempted) {
      newMaxScore = Math.max(mScore, minScoreIfAttempted);
      newScore = Math.max(minScoreIfAttempted, score);
    }
  } else if (maxScore) {
    newScore = 0;
    newMaxScore = Math.max(mScore, maxScore);
  }

  return {
    newScore,
    newMaxScore
  };
};

export default getCalculateScores;
