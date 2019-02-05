const getPenaltyScore = ({ score, evaluation, penalty }) => {
  const count = Object.keys(evaluation).length;
  const wrongCount = Object.values(evaluation).reduce((acc, val) => {
    if (!val) {
      acc += 1;
    }

    return acc;
  }, 0);

  const result = score - (penalty / count) * wrongCount;

  return result < 0 ? 0 : result;
};

export default getPenaltyScore;
