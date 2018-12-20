export const createTestActivityReport = (items) => {
  let totalScore = 0;
  let totalMaxScore = 0;
  let totalCorrect = 0;
  let totalWrong = 0;

  items.forEach(({ score = 0, maxScore = 0, correct = 0, wrong = 0 }) => {
    totalScore += score;
    totalMaxScore += maxScore;
    totalCorrect += correct;
    totalWrong += wrong;
  });


  return {
    score: totalScore,
    maxScore: totalMaxScore,
    correct: totalCorrect,
    wrong: totalWrong
  };
};
