const getMaxScore = answers =>
  answers.reduce((acc, answer) => {
    acc = Math.max(acc, answer.score);
    return acc;
  }, 0);

export default getMaxScore;
