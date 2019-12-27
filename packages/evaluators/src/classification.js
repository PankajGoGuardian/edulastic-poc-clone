import { isEqual, flatten, identity } from "lodash";
import { ScoringType } from "./const/scoring";

const rowEvaluation = (answer = [], userResponse = [], prevEvaluation = []) => {
  let mainRow = answer.slice();
  let evaluation = userResponse.map((i, index) => {
    if (mainRow.includes(i)) {
      mainRow.splice(mainRow.indexOf(i), 1);
      return true;
    }
    return prevEvaluation[index] || false;
  });

  return evaluation;
};

/**
 * exact match evaluator
 * @param {Array} answers - possible set of correct answer
 * @param {Array} userReponse - answers set by user
 */
const exactMatchEvaluator = (answers = [], userResponse = []) => {
  let evaluation = [];
  let score = 0;
  let maxScore = 0;

  // evaluate for each set of possible correct answer.
  for (const correctAnswer of answers) {
    const { value: answer, score: possibleMaxScore } = correctAnswer;
    // handle the empty scenario.
    if (!Array.isArray(answer)) {
      continue;
    }
    // maxScore is max amongs all possible maxScores in possible set of responses.
    maxScore = Math.max(possibleMaxScore || 0, maxScore);

    let correct = true;
    // check if all rows matches.
    // check equality in set handles order issue - here order in each row of response doesnt matter.
    answer.forEach((row, i) => {
      if (!userResponse[i] || !isEqual(row.slice().sort(), userResponse[i].slice().sort())) correct = false;
    });

    // if muliple set of correct answer matches, give user max among them!
    if (correct) {
      score = Math.max(score, possibleMaxScore || 0);
    }
  }

  if (score) {
    // if score exist, that means its a perfect match. hence set every element
    // in every row as true.
    evaluation = userResponse.map((row, i) => {
      return new Array(row.length).fill(true);
    });
  } else {
    // if its not a perfect match, construct evaluation based on
    // first possible set of answer.
    const answer = answers[0].value;
    evaluation = userResponse.map((row, i) => {
      const answerRow = answer[i] || [];
      return rowEvaluation(answerRow, row);
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
  let prevEvaluation = [];
  for (const answer of answers) {
    const { value: currentAnswer, score: possibleMaxScore } = answer;
    maxScore = Math.max(maxScore, possibleMaxScore || 0);
    const currentEvalution = userResponse.map((row, i) => {
      const answerRow = currentAnswer[i] || [];
      return rowEvaluation(answerRow, row, prevEvaluation[i]);
    });

    const answersCount = flatten(currentAnswer).length;
    const correctCount = currentEvalution.reduce((correct, item) => {
      let rowCorrectCount = item.filter(identity).length;
      return (correct += rowCorrectCount);
    }, 0);
    const currentScore = (possibleMaxScore * correctCount) / answersCount;
    if (currentScore > score) {
      [score, evaluation] = [currentScore, currentEvalution];
    } else {
      evaluation = currentEvalution;
    }
    prevEvaluation = evaluation;
  }

  return {
    score,
    maxScore,
    evaluation
  };
};

const evaluator = ({ userResponse = [], validation }) => {
  const { validResponse, altResponses = [], scoringType } = validation;
  const answers = [validResponse, ...altResponses];
  return scoringType === ScoringType.EXACT_MATCH
    ? exactMatchEvaluator(answers, userResponse)
    : partialMatchEvaluator(answers, userResponse);
};

export default evaluator;
