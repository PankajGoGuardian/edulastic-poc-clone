import { identity } from "lodash";
import { ScoringType } from "./const/scoring";

const exactMatchEvaluator = (answers = [], userResponse = []) => {
  let evaluation = [];
  let score = 0;
  let maxScore = 0;

  for (const validAnswer of answers) {
    let { value: answer, score: possibleMaxScore } = validAnswer;
    if (!Array.isArray(answer)) continue;

    maxScore = Math.max(possibleMaxScore || 0, maxScore);

    let currentEvaluation = answer.map((item, index) => {
      let resp = userResponse?.[index]?.value;
      if (!resp) return null;
      return item?.value === resp;
    });

    if (currentEvaluation.every(identity)) score = possibleMaxScore;
  }

  if (score) {
    evaluation = Array(userResponse.length).fill(true);
  } else {
    const correctAnswer = answers[0]?.value || [];
    evaluation = userResponse.map((item, index) => {
      let value = item?.value;
      if (!value) return null;
      return value === correctAnswer[index]?.value;
    });
  }

  return {
    score,
    maxScore,
    evaluation
  };
};

const partialMatchEvaluator = (answers = [], userResponse = []) => {
  let evaluation = [];
  let score = 0;
  let maxScore = 0;

  for (const validAnswer of answers) {
    let { value: answer, score: possibleMaxScore } = validAnswer;
    if (!Array.isArray(answer)) continue;

    maxScore = Math.max(possibleMaxScore || 0, maxScore);

    let currentEvaluation = answer.map((item, index) => {
      let resp = userResponse?.[index]?.value;
      if (!resp) return null;
      return item?.value === resp;
    });

    const correctCount = currentEvaluation.filter(identity).length;
    const currentScore = (possibleMaxScore / answer.length) * correctCount;

    if (currentScore > score) {
      evaluation = currentEvaluation;
      score = currentScore;
    }
  }

  if (evaluation.length === 0) {
    const correctAnswer = answers[0]?.value || [];
    evaluation = userResponse.map((item, index) => {
      let value = item?.value;
      if (!value) return null;
      return value === correctAnswer[index]?.value;
    });
  }

  return {
    score,
    maxScore,
    evaluation
  };
};
/**
 *
 * match list evaluator.
 */
const evaluator = ({ userResponse = [], validation }) => {
  const { validResponse, altResponses = [], scoringType } = validation;
  const answers = [validResponse, ...altResponses];
  return scoringType === ScoringType.EXACT_MATCH
    ? exactMatchEvaluator(answers, userResponse)
    : partialMatchEvaluator(answers, userResponse);
};

export default evaluator;
