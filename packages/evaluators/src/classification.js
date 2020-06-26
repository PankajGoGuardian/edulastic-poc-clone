import { isEqual, identity, flatMap } from "lodash";
import { ScoringType } from "./const/scoring";

function getEvaluations(correctAnswer = {}, userAnswer = {}) {
  const evaluation = {};
  Object.keys(userAnswer).forEach(containerId => {
    const userAttemptedResponseIds = userAnswer[containerId] || [];
    const correctAnswerResponseIds = correctAnswer[containerId] || [];
    userAttemptedResponseIds.forEach(responseId => {
      evaluation[containerId] = evaluation[containerId] || {};
      evaluation[containerId][responseId] = correctAnswerResponseIds.includes(responseId);
    });
  });
  return evaluation;
}

/**
 * exact match evaluator
 * @param {Array} answers - possible set of correct answer
 * @param {Array} userReponse - answers set by user
 */
const exactMatchEvaluator = (answers = [], userResponse = []) => {
  let evaluation = {};
  let score = 0;
  let maxScore = 0;
  // evaluate for each set of possible correct answer.
  for (const correctAnswer of answers) {
    const { value: answer, score: possibleMaxScore } = correctAnswer;
    // handle the empty scenario.
    // if (!Array.isArray(answer)) {
    //   continue;
    // }
    // maxScore is max amongs all possible maxScores in possible set of responses.
    maxScore = Math.max(possibleMaxScore || 0, maxScore);

    let correct = true;
    // check if all rows matches.
    // check equality in set handles order issue - here order in each row of response doesnt matter.
    Object.keys(answer).forEach(key => {
      const correctAnswers = answer[key] || [];
      const userAnswers = userResponse[key] || [];
      if (!userAnswers.length > 0 || !isEqual(correctAnswers.slice().sort(), userAnswers.slice().sort())) {
        correct = false;
      }
    });

    // if muliple set of correct answer matches, give user max among them!
    if (correct) {
      score = Math.max(score, possibleMaxScore || 0);
    }
  }

  if (score) {
    // if score exist, that means its a perfect match. hence set every element
    // in every row as true.
    Object.keys(userResponse).forEach(containerId => {
      const responseIds = userResponse[containerId] || [];
      evaluation[containerId] = evaluation[containerId] || {};
      responseIds.forEach(responseId => {
        evaluation[containerId][responseId] = true;
      });
    });
  } else {
    // if its not a perfect match,
    // construct evaluation based on first possible set of answer.
    const answer = answers[0].value;
    evaluation = getEvaluations(answer, userResponse);
  }
  return {
    score,
    maxScore,
    evaluation
  };
};

const partialMatchEvaluator = (answers = [], userResponse = []) => {
  let evaluation = {};
  let score = 0;
  let maxScore = 0;

  for (const answer of answers) {
    const { value: currentAnswer, score: possibleMaxScore } = answer;
    maxScore = Math.max(maxScore, possibleMaxScore || 0);
    const currentEvalution = getEvaluations(currentAnswer, userResponse);
    const answersCount = flatMap(Object.values(currentAnswer), identity).length;
    const correctCount = Object.values(currentEvalution).reduce((acc, obj) => {
      const correct = Object.values(obj).filter(identity).length;
      acc += correct;
      return acc;
    }, 0);
    const currentScore = (possibleMaxScore * correctCount) / answersCount;

    if (currentScore > score) {
      [score, evaluation] = [currentScore, currentEvalution];
    } else {
      evaluation = currentEvalution;
    }
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
