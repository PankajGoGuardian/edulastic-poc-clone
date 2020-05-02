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
 * @param {Array<Number[]>} arr
 *
 *  put the value to the correct index
 *
 * Input: [[0], [1], [0], [1]]
 * Output: [[0], [empty, 1], [0], [empty, 1]]
 *
 * needed for determining the evaluation highlight for each cell
 */
const transformArray = (arr = []) =>
  arr.map(row => {
    const _row = [];
    if (row) {
      row.forEach(col => {
        _row[col] = _row[col] || col;
      });
    }
    return _row;
  });

/**
 *
 * @param {Array<Number[]>} answers particular answer set (correct answer | alt answer 1 | alt answer 2 | ... )
 * @returns total number of correct answers set by author in the current anwwer set
 */
const totalAnswerCount = (answers = []) => {
  const answersFlattened = answers.reduce((acc, curr) => {
    // total correct answers set by user for current answer set
    if (Array.isArray(curr)) {
      /**
       * if user does not set answers for some rows,
       * it comes as null
       * that should not be considered for actualCorrectAnswers,
       * else it will mess up the count
       */
      acc = acc.concat(curr);
    }
    return acc;
  });
  return answersFlattened.length;
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
    const { value, score: maxScoreForAllCorrect } = answer;

    const actualCorrectAnswers = totalAnswerCount(value);
    let correctAttempts = 0;
    let incorrectAttempts = 0;
    if (!userResponse.length) {
      // user did not attempt, no score and evaluation highlights
      return {
        result: [],
        maxScore: maxScoreForAllCorrect,
        correctAttempts,
        incorrectAttempts,
        actualCorrectAnswers
      };
    }
    const transformedAnswer = transformArray(value);
    // get the evaluation and score
    const evaluation = userResponse.map((row, rowIndex) => {
      let rowEvaluation = [];
      if (Array.isArray(row)) {
        rowEvaluation = row.map((col, columnIndex) => {
          const correct = transformedAnswer[rowIndex][columnIndex] === col;
          correct ? correctAttempts++ : incorrectAttempts++;
          return correct;
        });
      }
      return { evaluation: rowEvaluation };
    });

    return {
      result: evaluation.map(obj => obj.evaluation),
      correctAttempts,
      incorrectAttempts,
      maxScore: maxScoreForAllCorrect,
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
const exactMatchEvaluator = (userResponse = [], validation = {}) => {
  const { validResponse = {}, altResponses = [] } = validation;
  const allAnswers = [{ ...validResponse }, ...altResponses];
  let score = 0;
  let maxScore = getMaxScore(allAnswers);
  let evaluation = [];

  if (!userResponse.length) {
    // user did not attempt any answer, return back without evaluating anything
    return { score, maxScore, evaluation };
  }
  const transformedUserAnswer = transformArray(userResponse);
  const evaluations = getEvaluationExactMatch(transformedUserAnswer, allAnswers);
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
    const actualCorrectAnswers = totalAnswerCount(value); // total correct answers set by user for current answer set
    const scorePerCorrectAnswer = correctAnsMaxScore / actualCorrectAnswers;
    const penaltyPerIncorrectAnswer = penalty / actualCorrectAnswers;
    const transformedAnswer = transformArray(value); // move values in array to proper indexes
    let currentScore = 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    // get the evaluation for the current answer set
    const currentEvaluation = userResponse.map((row, rowIndex) => {
      if (Array.isArray(row)) {
        return row.map((col, colIndex) => {
          const isCorrect = transformedAnswer[rowIndex][colIndex] === col;
          isCorrect ? correctAnswers++ : incorrectAnswers++;
          return isCorrect;
        });
      }
      return [];
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
  const allAnswers = [{ ...validResponse }, ...altResponses];
  let score = 0;
  let maxScore = getMaxScore(allAnswers);
  let evaluation = [];
  const transformedUserAnswer = transformArray(userResponse);

  const evaluations = getEvaluationPartialMatch(transformedUserAnswer, allAnswers, penalty);
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
    return { score: 0, maxScore: 0, evaluation: [] };
  }
  const { value = [] } = userResponse;

  switch (scoringType) {
    case EXACT_MATCH:
      return exactMatchEvaluator(value, validation);
    case PARTIAL_MATCH:
      return partialMatchEvaluator(value, validation);
    default:
      return { score: 0, maxScore: 0, evaluation: [] };
  }
};

export default evaluator;
