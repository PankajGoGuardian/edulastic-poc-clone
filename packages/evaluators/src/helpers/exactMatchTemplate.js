import getCalculateScores from "./getCalculateScores";

const exactMatchTemplate = (mainFunction, mainArguments) => {
  const {
    validation: { ignoreCase, allowSingleLetterMistake }
  } = mainArguments;
  const { score, maxScore, evaluation } = mainFunction(mainArguments, { ignoreCase, allowSingleLetterMistake });

  const { newScore, newMaxScore } = getCalculateScores(score, maxScore, mainArguments.validation);

  return {
    score: newScore,
    maxScore: newMaxScore > 0 ? newMaxScore : 1,
    evaluation
  };
};

export default exactMatchTemplate;
