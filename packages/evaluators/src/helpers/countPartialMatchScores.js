import { isEqual, includes, difference } from "lodash";

const countPartialMatchScores = compareFunction => ({ answers, userResponse = [] }) => {
  let score = 0;
  let maxScore = 0;

  let rightLen = 0;
  let rightIndex = 0;
  const evaluation = [];

  answers.forEach(({ value: answer, score: totalScore }, ind) => {
    if (!answer || !answer.length) {
      return;
    }

    const scorePerAnswer = totalScore / answer.length;

    const matches = userResponse.filter((resp, index) => {
      switch (compareFunction) {
        case "innerDifference":
          return difference(answer[index], resp).length === 0;

        case "isEqual":
          return isEqual(answer[index], resp);

        default:
          return includes(answer, resp);
      }
    }).length;

    const currentScore = matches * scorePerAnswer;

    score = Math.max(score, currentScore);
    maxScore = Math.max(maxScore, totalScore);

    if (currentScore === score) {
      rightLen = answer.length;
      rightIndex = ind;
    }
  });

  userResponse.forEach((item, i) => {
    switch (compareFunction) {
      case "innerDifference":
        evaluation[i] = difference(answers[rightIndex].value[i], item).length === 0;
        break;

      case "isEqual":
        evaluation[i] = isEqual(answers[rightIndex].value[i], item);
        break;

      default:
        evaluation[i] = includes(answers[rightIndex].value, item);
        break;
    }
  });

  return {
    score,
    maxScore,
    rightLen,
    evaluation
  };
};

export default countPartialMatchScores;
