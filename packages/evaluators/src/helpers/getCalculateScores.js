// eslint-disable-next-line max-len
const getCalculateScores = (score, maxScore, { min_score_if_attempted, automarkable, max_score }, userResponse) => {
  let newScore = automarkable ? score : 0;
  let newMaxScore = maxScore;

  if (automarkable) {
    if (min_score_if_attempted) {
      newMaxScore = Math.max(maxScore, min_score_if_attempted);
      if (userResponse && userResponse.length > 0) {
        newScore = Math.max(min_score_if_attempted, score);
      }
    }
  } else if (max_score) {
    newMaxScore = Math.max(max_score, maxScore);
  }

  return {
    newScore,
    newMaxScore
  };
};

export default getCalculateScores;
