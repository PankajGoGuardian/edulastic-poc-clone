/**
 *
 * @param {Array} allAnswers
 * Group all the answers together
 * Input: [{ value: [ [0], [1] ] }, { value: [ [1], [1] ] }
 * Output: [ [0,1], [0,1] ]
 */
const getAnswerSet = allAnswers => {
  const answerSet = [];
  allAnswers.forEach(answer => {
    answer.value.forEach((row, rowIndex) => {
      answerSet[rowIndex] = answerSet[rowIndex] || [];
      row.forEach(ans => {
        if (!answerSet[rowIndex].includes(ans)) {
          answerSet[rowIndex].push(ans);
        }
      });
    });
  });
  return answerSet;
};

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
 * @param {Array} userAnswers
 * transform the user answer for showing correct validation
 * put the value to the correct index
 * Input: [[0], [1], [0], [0]]
 * Output: [[0], [undefined, 1], [0]]
 */
const transformUserAnswer = (userAnswers = []) =>
  userAnswers.map(row => {
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
 * @param {Array} userAnswers
 * @param {Array} answerSet
 */
const evaluateAnswers = (userAnswers, answerSet) => {
  const transformedUserAnswers = transformUserAnswer(userAnswers);
  const evaluation = transformedUserAnswers.map((row, rowIndex) => {
    if (row) {
      return row.map(ans => answerSet[rowIndex].includes(ans));
    }
    return row;
  });
  return evaluation;
};

/**
 *
 * @param {Array.<number[]>} evaluation
 */
const getAnswerCount = evaluation => {
  let correct = 0;
  let incorrect = 0;
  evaluation.forEach(row => {
    if (row) {
      row.forEach(ans => {
        ans === true ? correct++ : incorrect++;
      });
    }
  });
  return [correct, incorrect];
};
/**
 *
 * @param {userResponse} Object
 * @param {validation} Object
 */
const evaluator = ({ userResponse = {}, validation = {} }) => {
  const { value: userAnswers = [] } = userResponse;
  const { validResponse, altResponses, scoringType, penalty = 0 } = validation;
  const allAnswers = [{ ...validResponse }, ...altResponses];
  let score = 0; // initial score
  const maxScore = getMaxScore(allAnswers);
  if (!userAnswers.length) {
    return { score, maxScore, evaluation: [] };
  }
  const answerSet = getAnswerSet(allAnswers);
  const evaluation = evaluateAnswers(userAnswers, answerSet);
  const [correctAnswers, incorrectAnswers] = getAnswerCount(evaluation);

  if (scoringType === "partialMatch") {
    const individualScore = maxScore / evaluation.length;
    const correctAnswerScore = Math.min(correctAnswers * individualScore, maxScore);
    const penalisation = incorrectAnswers * penalty;
    score = Math.max(correctAnswerScore - penalisation, 0);
  } else if (incorrectAnswers === 0) {
    // exact match with all answers correct
    score = maxScore;
  }
  const evaluationObject = { score, maxScore, evaluation };
  return evaluationObject;
};

export default evaluator;
