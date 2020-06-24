import { identity, zip } from "lodash";
import { ScoringType } from "./const/scoring";

const exactMatchEvaluator = (rawAnswers = [], rawUserResponse = {}) => {
  const listKeys = Object.keys(rawAnswers[0].value);
  const answers = rawAnswers.map(ans => ({
    score: ans.score,
    value: listKeys.map(l => ans.value[l] || null)
  }));
  const userResponse = listKeys.map(l => rawUserResponse[l] || null);
  let evaluation = [];
  let score = 0;
  let maxScore = 0;

  for (const validAnswer of answers) {
    const { value: answer, score: possibleMaxScore } = validAnswer;
    if (!Array.isArray(answer)) continue;

    maxScore = Math.max(possibleMaxScore || 0, maxScore);

    const currentEvaluation = answer.map((item, index) => {
      const resp = userResponse?.[index];
      if (!item && !resp) return true;
      return item === resp;
    });

    if (currentEvaluation.every(identity)) score = possibleMaxScore;
  }

  if (score) {
    evaluation = Array(userResponse.length).fill(true);
  } else {
    const correctAnswer = zip(...answers.map(i => i.value));
    evaluation = userResponse.map((item, index) => {
      if (!item) return null;
      return correctAnswer[index].includes(item);
    });
  }

  const evaluationMap = {};
  listKeys.forEach((l, ind) => evaluationMap[l] = evaluation[ind]);

  return {
    score,
    maxScore,
    evaluation: evaluationMap
  };
};

const partialMatchEvaluator = (rawAnswers = [], rawUserResponse = {}) => {
  const listKeys = Object.keys(rawAnswers[0].value);
  const answers = rawAnswers.map(ans => ({ 
    score: ans.score,
    value: listKeys.map(l => ans.value[l] || null)
  }));
  const userResponse = listKeys.map(l => rawUserResponse[l] || null);
  let evaluation = [];
  let score = 0;
  let maxScore = 0;

  for (const validAnswer of answers) {
    const { value: answer, score: possibleMaxScore } = validAnswer;
    if (!Array.isArray(answer)) continue;

    maxScore = Math.max(possibleMaxScore || 0, maxScore);

    const answerLength = answer.filter(identity).length;
    const currentEvaluation = answer.map((item, index) => {
      const resp = userResponse?.[index];
      if (!resp) return null;
      return item === resp;
    });

    const correctCount = currentEvaluation.filter(identity).length;
    const currentScore = (possibleMaxScore / answerLength) * correctCount;

    if (currentScore > score) {
      evaluation = currentEvaluation;
      score = currentScore;
    }
  }

  if (evaluation.length === 0) {
    const correctAnswer = answers[0]?.value || [];
    evaluation = userResponse.map((item, index) => {
      if (!item) return null;
      return item === correctAnswer[index];
    });
  }

  const evaluationMap = {};
  listKeys.forEach((l, ind) => evaluationMap[l] = evaluation[ind]);

  return {
    score,
    maxScore,
    evaluation: evaluationMap
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
