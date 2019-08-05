import { ScoringType } from "../const/scoring";

const checkAnswer = (answer, userResponse) => {
  const result = [];

  const trueAnswerValue = answer.value;

  userResponse.forEach(testLabel => {
    const resultForLabel = {
      label: testLabel,
      result: false
    };

    if (
      trueAnswerValue.findIndex(item => item.point === testLabel.point && item.position === testLabel.position) > -1
    ) {
      resultForLabel.result = true;
    }

    result.push(resultForLabel);
  });

  return result;
};

const exactMatchEvaluator = (userResponse, answers) => {
  let score = 0;
  let maxScore = 1;

  const evaluation = {};

  answers.forEach((answer, index) => {
    const answerResult = {
      result: false,
      details: checkAnswer(answer, userResponse),
      score: 0
    };

    const trueLabelsCount = answerResult.details.filter(item => item.result).length;
    const allIsTrue = trueLabelsCount === answerResult.details.length;
    answerResult.result = answer.value.length === userResponse.length && allIsTrue;

    if (answerResult.result) {
      answerResult.score = answer.score;
      score = Math.max(answerResult.score, score);
    }

    maxScore = Math.max(answer.score, maxScore);
    evaluation[index] = answerResult;
  });

  return {
    score,
    maxScore,
    evaluation
  };
};

const partialMatchPerResponseEvaluator = (userResponse, answers, penalty) => {
  let score = 0;
  let maxScore = 1;

  const evaluation = {};

  answers.forEach((answer, index) => {
    const answerResult = {
      result: false,
      details: checkAnswer(answer, userResponse),
      score: 0
    };

    const trueLabelsCount = answerResult.details.filter(item => item.result).length;
    const penaltyScore = (answerResult.details.length - trueLabelsCount) * penalty;
    const allIsTrue = trueLabelsCount === answerResult.details.length;
    answerResult.result = answer.value.length === userResponse.length && allIsTrue;

    answerResult.score = answer.score * trueLabelsCount - penaltyScore;

    score = Math.max(answerResult.score, score);
    maxScore = Math.max(answer.score * answer.value.length, maxScore);
    evaluation[index] = answerResult;
  });

  return {
    score,
    maxScore,
    evaluation
  };
};

const partialMatchEvaluator = (userResponse, answers, roundingIsNone, penalty) => {
  let score = 0;
  let maxScore = 1;

  const evaluation = {};

  answers.forEach((answer, index) => {
    const answerResult = {
      result: false,
      details: checkAnswer(answer, userResponse),
      score: 0
    };

    const trueLabelsCount = answerResult.details.filter(item => item.result).length;
    const penaltyScore = (answerResult.details.length - trueLabelsCount) * penalty;
    const allIsTrue = trueLabelsCount === answerResult.details.length;
    answerResult.result = answer.value.length === userResponse.length && allIsTrue;

    const pointsPerOneLabel = answer.value.length ? answer.score / answer.value.length : 0;
    answerResult.score = roundingIsNone
      ? pointsPerOneLabel * trueLabelsCount
      : Math.floor(pointsPerOneLabel * trueLabelsCount);
    answerResult.score -= penaltyScore;

    score = Math.max(answerResult.score, score);
    maxScore = Math.max(answer.score, maxScore);
    evaluation[index] = answerResult;
  });

  return {
    score,
    maxScore,
    evaluation
  };
};

const evaluator = ({ userResponse, validation }) => {
  const { validResponse, altResponses, scoringType, rounding, penalty = 0 } = validation;

  let answers = [validResponse];
  if (altResponses) {
    answers = answers.concat([...altResponses]);
  }

  const roundingIsNone = rounding && rounding === "none";

  switch (scoringType) {
    case ScoringType.PARTIAL_MATCH:
      return partialMatchEvaluator(userResponse, answers, roundingIsNone, penalty);
    case ScoringType.PARTIAL_MATCH_V2:
      return partialMatchPerResponseEvaluator(userResponse, answers, penalty);
    case ScoringType.EXACT_MATCH:
    default:
      return exactMatchEvaluator(userResponse, answers);
  }
};

export default evaluator;
