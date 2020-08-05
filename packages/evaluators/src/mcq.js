import maxBy from "lodash/maxBy";

import { ScoringType } from "./const/scoring";
import { rounding as constantsForRoundingOff } from "./const/rounding";

const { PARTIAL_MATCH, EXACT_MATCH } = ScoringType;
const { ROUND_DOWN, NONE } = constantsForRoundingOff;

function getMaxScoreFromValidAnswers(answers) {
  const getMaxScore = (maxScore, obj) => {
    maxScore = Math.max(maxScore, obj.score);
    return maxScore;
  };
  return answers.reduce(getMaxScore, 0);
}

function getEvaluations({ validation = {}, userResponse = [] }) {
  const { validResponse = {}, altResponses = [] } = validation;
  const answers = [validResponse, ...altResponses];
  const evaluations = [];
  const maxScore = getMaxScoreFromValidAnswers(answers);
  for (const answer of answers) {
    const { score: answerScore, value = [] } = answer;
    if (!value.length) {
      throw new Error(`answer cannot be empty`);
    }
    let correctCount = 0;
    let incorrectCount = 0;
    const totalCount = value.length;
    let allCorrect = userResponse.length === value.length; // basic length check
    const currentEvaluation = {};
    const userAnswers = userResponse.entries();

    for (const [index, id] of userAnswers) {
      const isCorrect = value.includes(id);
      if (isCorrect) {
        correctCount++;
      } else {
        allCorrect = false;
        incorrectCount++;
      }
      currentEvaluation[index] = isCorrect;
    }

    const currentScore = (answerScore / totalCount) * correctCount;
    evaluations.push({
      correctCount,
      incorrectCount,
      totalCount,
      allCorrect,
      currentScore,
      maxScore,
      evaluation: currentEvaluation
    });
  }

  return evaluations;
}

function exactMatchEvaluator({ validation = {}, userResponse = [] }) {
  if (!userResponse.length) {
    const { validResponse: { score: maxScore = 0 } = {} } = validation;
    return {
      score: 0,
      maxScore,
      evaluation: {}
    };
  }
  const evaluations = getEvaluations({ validation, userResponse });
  const allCorrect = obj => obj.allCorrect;
  const bestMatch = evaluations.find(allCorrect);
  if (bestMatch) {
    const { currentScore, maxScore, evaluation } = bestMatch;
    return {
      score: currentScore,
      maxScore,
      evaluation
    };
  }
  const [evaluation = {}] = evaluations;
  const { maxScore, evaluation: highlights } = evaluation;
  return {
    score: 0,
    maxScore,
    evaluation: highlights
  };
}

function partialMatchEvaluator({ validation = {}, userResponse = [] }) {
  if (!userResponse.length) {
    const { validResponse: { score: maxScore = 0 } = {} } = validation;
    return {
      score: 0,
      maxScore,
      evaluation: {}
    };
  }
  const evaluations = getEvaluations({ validation, userResponse });
  const maxByScore = obj => obj.currentScore;
  const bestMatch = maxBy(evaluations, maxByScore);
  const { maxScore, incorrectCount, totalCount, evaluation } = bestMatch;
  let { currentScore: score } = bestMatch;
  const { penalty: penaltyPoints, rounding = NONE } = validation;
  if (penaltyPoints && incorrectCount) {
    const penalisation = (penaltyPoints / totalCount) * incorrectCount;
    score = Math.max(0, score - penalisation);
  }
  // if round down is selected, but score achieved is not maxScore, round down to nearest integer
  if (rounding === ROUND_DOWN && score !== maxScore) {
    score = Math.floor(score);
  }
  return {
    score,
    maxScore,
    evaluation
  };
}

const evaluator = ({ userResponse = [], validation = {} }) => {
  const { validResponse } = validation;
  if (!validResponse) {
    throw new Error("validResponse cannot be empty");
  }
  const { scoringType } = validation;
  switch (scoringType) {
    case EXACT_MATCH:
      return exactMatchEvaluator({ userResponse, validation });
    case PARTIAL_MATCH:
      return partialMatchEvaluator({ userResponse, validation });
    default:
      throw new Error(
        `Invalid scoring type
         Provided: ${scoringType}
         Expected: one of [${EXACT_MATCH}, ${PARTIAL_MATCH}] `
      );
  }
};

export default evaluator;
