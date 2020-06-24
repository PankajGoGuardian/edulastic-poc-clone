import { isEmpty, isEqual, keys } from "lodash";
import { rounding as constantsForRoundingOff } from "./const/rounding";
import { ScoringType } from "./const/scoring";

const { ROUND_DOWN, NONE } = constantsForRoundingOff;
const { PARTIAL_MATCH, EXACT_MATCH } = ScoringType;

/**
 *
 * @param {Array} allAnswers
 * get the max score from correct answer or alternate answers
 */
const getMaxScore = allAnswers => {
  const maxScore = allAnswers.reduce((max, current) => {
    if (current.score > max) {
      max = current.score;
    }
    return max;
  }, -1);
  return maxScore;
};

/**
 *
 * @param {Array<Number[]>} userResponse
 * @param {Array<Object>} allAnswers
 *
 * validate the user response against all the answers
 * get evaluations against all the answers
 * also store the total correct, incorrect attempts against each answer set
 */
const getEvaluationExactMatch = (userResponse, allAnswers) => {
  const evaluations = allAnswers.map(answer => {
    const { value, score } = answer;

    const actualCorrectAnswers = keys(value).length;
    let correctAttempts = 0;
    let incorrectAttempts = 0;

    // get the evaluation and score
    const evaluation = {};
    keys(userResponse).forEach(responseId => {
      const correct = isEqual(value[responseId], userResponse[responseId]);
      correct ? correctAttempts++ : incorrectAttempts++;
      evaluation[responseId] = correct;
    });

    return {
      result: evaluation,
      correctAttempts,
      incorrectAttempts,
      maxScore: score,
      actualCorrectAnswers
    };
  });

  return evaluations;
};

/**
 *
 * @param {Array<Number[]>} userResponse
 * @param {Object} validation
 *
 * scoring is given on all or nothing basis
 * highlights are shown according to best match from all answer sets
 */
const exactMatchEvaluator = (userResponse = {}, validation = {}) => {
  const { validResponse = {}, altResponses = [] } = validation;
  const allAnswers = [validResponse, ...altResponses];
  let score = 0;
  let maxScore = getMaxScore(allAnswers);
  let evaluation = {};
  if (isEmpty(userResponse)) {
    // user did not attempt any answer, return back without evaluating anything
    return { score, maxScore, evaluation };
  }

  const evaluations = getEvaluationExactMatch(userResponse, allAnswers);

  const allCorrectAnswerAttempt = evaluations.find(obj => {
    const { correctAttempts, incorrectAttempts, actualCorrectAnswers } = obj;
    return incorrectAttempts === 0 && correctAttempts === actualCorrectAnswers; // no incorrect answer, and exactly same answer as set by user
  });

  if (allCorrectAnswerAttempt) {
    maxScore = allCorrectAnswerAttempt.maxScore;
    score = maxScore;
    evaluation = allCorrectAnswerAttempt.result;
  } else {
    /**
     * show highlight against the best possible match
     * in case of a tie,
     * it will show the hightlights against the first, among the ones having a tie
     *
     * consider score of individual answer set when determining the best match
     * sets having higher score will have higher priority than others
     */
    const bestMatch = evaluations.reduce((acc, curr) => {
      const { correctAttempts, incorrectAttempts, maxScore: maxScoreForAllCorrect, actualCorrectAnswers } = acc;
      const individualScore = maxScoreForAllCorrect / actualCorrectAnswers;
      const accScore = (correctAttempts - incorrectAttempts) * individualScore;
      const {
        correctAttempts: currentCorrectAtttempts,
        incorrectAttempts: currentIncorrectAttempts,
        maxScore: currMaxScoreForAllCorrect,
        actualCorrectAnswers: actualCorrectAnswersCurrent
      } = curr;
      const individualScoreCurrent = currMaxScoreForAllCorrect / actualCorrectAnswersCurrent;
      const currScore = (currentCorrectAtttempts - currentIncorrectAttempts) * individualScoreCurrent;

      if (currScore > accScore) {
        return curr;
      }
      return acc;
    });

    evaluation = bestMatch.result;
  }

  return { score, maxScore, evaluation };
};

/**
 *
 * @param {Array<Number[]>} userResponse
 * @param {Array<Object>} allAnswers
 * @param {Number} penalty
 *
 * get the evaluation against all answers and score for each answer set
 * score and penalty are calculated on individual option basis
 */
const getEvaluationPartialMatch = (userResponse, allAnswers, penalty) => {
  const evaluations = allAnswers.map(answer => {
    const { score: correctAnsMaxScore, value } = answer;
    const actualCorrectAnswers = keys(value).length; // total correct answers set by teacher for current answer set
    const scorePerCorrectAnswer = correctAnsMaxScore / actualCorrectAnswers;
    const penaltyPerIncorrectAnswer = penalty / actualCorrectAnswers;

    let currentScore = 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    // get the evaluation for the current answer set
    const currentEvaluation = {};
    keys(userResponse).forEach(responseId => {
      const isCorrect = isEqual(value[responseId], userResponse[responseId]);
      isCorrect ? correctAnswers++ : incorrectAnswers++;
      currentEvaluation[responseId] = isCorrect;
    });

    const correctAnswerScore = correctAnswers * scorePerCorrectAnswer;
    const penalisation = incorrectAnswers * penaltyPerIncorrectAnswer;
    currentScore = Math.max(0, correctAnswerScore - penalisation); // score achieved for current answer set
    return { evaluation: currentEvaluation, score: currentScore, maxScore: correctAnsMaxScore };
  });

  return evaluations;
};

const partialMatchEvaluator = (userResponse, validation) => {
  const { validResponse = {}, altResponses = [], penalty = 0, rounding = NONE } = validation;
  const allAnswers = [validResponse, ...altResponses];
  let score = 0;
  let maxScore = getMaxScore(allAnswers);
  let evaluation = [];

  const evaluations = getEvaluationPartialMatch(userResponse, allAnswers, penalty);
  if (evaluations.length > 0) {
    const maxByScore = evaluations.reduce((acc, curr) => {
      if (curr.score > acc.score) {
        return curr;
      }
      return acc;
    });
    // if rounding is selected, round down, otherwise keep the score as it is.
    score = rounding === ROUND_DOWN ? Math.floor(maxByScore.score) : maxByScore.score;
    maxScore = maxByScore.maxScore;
    evaluation = maxByScore.evaluation;
  }

  return { score, maxScore, evaluation };
};

/**
 *
 * @param {userResponse} Object
 * @param {validation} Object
 */
const evaluator = ({ userResponse = {}, validation = {} }) => {
  const { scoringType } = validation;
  if (scoringType !== PARTIAL_MATCH && scoringType !== EXACT_MATCH) {
    return { score: 0, maxScore: 0, evaluation: {} };
  }
  const { value = {} } = userResponse;

  switch (scoringType) {
    case EXACT_MATCH:
      return exactMatchEvaluator(value, validation);
    case PARTIAL_MATCH:
      return partialMatchEvaluator(value, validation);
    default:
      return { score: 0, maxScore: 0, evaluation: {} };
  }
};

export default evaluator;
