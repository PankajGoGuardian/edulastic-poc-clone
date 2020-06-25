import { maxBy, keys } from "lodash";
import { get as levenshteinDistance } from "fast-levenshtein";

import { rounding as RoundOffTypes } from "./const/rounding";

/**
 *
 * @param {string} answer  // correct answer
 * @param {string} response  // user response
 * @param {boolean} allowSingleLetterMistake  // is single letter mistake accepted
 * @param {boolean} ignoreCase  // ignore case of answer
 */
const compareChoice = (answer, response, allowSingleLetterMistake = false, ignoreCase = false) => {
  const attempted = response && response.length;
  if (!attempted) return null;

  answer = ignoreCase ? answer.trim().toLowerCase() : answer.trim();
  response = ignoreCase ? response.trim().toLowerCase() : response.trim();

  // is single letter mistake allowed?
  // if yes, then check if "levenshtein-distance" is less than 1
  // else it should be a an exact match

  // eslint-disable-next-line max-len
  return allowSingleLetterMistake ? levenshteinDistance(answer, response) <= 1 : answer === response;
};

/**
 *
 * @param {Array} userResponse
 * @param {Object} validation
 */
const groupChoiceByIndex = (answers, validation) => {
  // grouping the answers at particular index together
  // [[a11, a12], [a21, a22]] => [[a11, a21], a[12, a22]]
  const responses = validation.validResponse?.value || {};
  const answerSet = [];
  keys(responses).forEach(id => {
    answers.forEach(answer => {
      answerSet[id] = answerSet[id] || new Set([]);
      answerSet[id].add(answer.value[id]);
    });
  });
  return answerSet;
};

const mixAndMatchEvaluator = ({ userResponse, validation }) => {
  const response = userResponse;
  const { allowSingleLetterMistake, ignoreCase } = validation;

  // combining validAnswer and alternate answers
  const answers = [{ ...validation.validResponse }, ...(validation.altResponses || [])];
  const optionCount = keys(validation.validResponse?.value).length || 0;
  const maxScore = answers.reduce((_maxScore, answer) => Math.max(_maxScore, answer.score), 0);
  let score = 0;

  // grouping all the responses at particular index together
  const answerSet = groupChoiceByIndex(answers, validation);

  const evaluation = {};
  keys(response).forEach(id => {
    const answersById = answerSet[id].values();
    let found = false;
    for (const answer of answersById) {
      found = compareChoice(answer, response[id], allowSingleLetterMistake, ignoreCase);
      if (found) break;
    }
    evaluation[id] = found;
  });

  const correctAnswerCount = keys(evaluation).filter(id => evaluation[id]).length;

  if (validation.scoringType === "partialMatch") {
    // get partial score
    score = maxScore * (correctAnswerCount / optionCount);
    if (validation.penalty) {
      const { penalty: totalPenalty } = validation;
      const wrongAnswerCount = keys(evaluation).filter(id => evaluation[id] === false).length;
      const penalty = (totalPenalty / optionCount) * wrongAnswerCount;
      score = Math.max(0, score - penalty);
      // if round down, but score achieved is not full score, then round down to nearest integer
      if (validation.rounding === RoundOffTypes.ROUND_DOWN && score !== maxScore) {
        score = Math.floor(score);
      }
    }
  } else if (correctAnswerCount === optionCount) {
    // exactMatch  (all correct)
    score = maxScore;
  }
  return { score, maxScore, evaluation };
};

const normalEvaluator = ({ userResponse, validation }) => {
  const { validResponse: { value = {} } = {} } = validation;
  const optionCount = keys(value).length || 0;
  const { allowSingleLetterMistake, ignoreCase } = validation;

  // combining the correct answer and alternate answers
  const answers = [{ ...validation.validResponse }, ...(validation.altResponses || [])];

  const maxScore = answers.reduce((_maxScore, answer) => Math.max(_maxScore, answer.score), 0);
  const evaluations = [];
  const response = userResponse;

  answers.forEach(answer => {
    let currentScore = 0;
    // calculating the evaluation for every answer
    // comparing user respose with the answer
    const evaluation = {};
    keys(answer.value).forEach(id => {
      evaluation[id] = compareChoice(answer.value[id], response[id], allowSingleLetterMistake, ignoreCase);
    });

    const correctAnswerCount = keys(evaluation).filter(id => evaluation[id]).length;
    if (validation.scoringType === "partialMatch") {
      currentScore = parseFloat(answer.score * (correctAnswerCount / optionCount));
      if (validation.penalty) {
        const { penalty: totalPenalty } = validation;
        const wrongAnswerCount = keys(evaluation).filter(id => evaluation[id] === false).length;
        const penalty = (totalPenalty / optionCount) * wrongAnswerCount;
        currentScore = Math.max(0, currentScore - penalty);
        // if round down, but score achieved is not full score, then round down to nearest integer
        if (validation.rounding === RoundOffTypes.ROUND_DOWN && currentScore !== answer.score) {
          currentScore = Math.floor(currentScore);
        }
      }
    } else if (correctAnswerCount === optionCount && optionCount !== 0) {
      // exact match (all correct)
      currentScore = answer.score;
    }
    evaluations.push({
      score: currentScore,
      evaluation
    });
  });

  // the evaluation which gave the highest score
  const correct = maxBy(evaluations, "score");
  // returning the first evaluation if no answers are correct
  const evaluation = correct.score === 0 ? evaluations[0].evaluation : correct.evaluation;
  return { evaluation, score: parseFloat(correct.score), maxScore };
};

/**
 *
 * @param {Array} userResponse
 * @param {Object} validation
 */
const evaluator = ({ userResponse = {}, validation = {} }) =>
  validation.mixAndMatch
    ? mixAndMatchEvaluator({ userResponse, validation })
    : normalEvaluator({ userResponse, validation });

export default evaluator;
