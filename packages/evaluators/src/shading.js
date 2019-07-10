import { isEqual } from "lodash";
import { ScoringType } from "./const/scoring";
import partialMatchTemplate from "./helpers/partialMatchTemplate";
import exactMatchTemplate from "./helpers/exactMatchTemplate";

const BY_COUNT_METHOD = "byCount";

const exactCompareFunction = ({ answers, userResponse = [] }) => {
  let score = 0;
  let maxScore = 1;

  let rightIndex = 0;

  answers.forEach(({ value: { method, value: answer }, score: totalScore }, ind) => {
    if (!answer || !answer.length) {
      return;
    }

    let matches = 0;
    const totalMatches = method === BY_COUNT_METHOD ? answer[0] : answer.length;

    if (method === BY_COUNT_METHOD) {
      matches = userResponse.length;
    } else {
      userResponse.forEach(col => {
        if (answer.some(ans => isEqual(ans, col))) {
          matches++;
        }
      });
    }

    let currentScore;
    if (method === BY_COUNT_METHOD) {
      currentScore = matches === totalMatches ? totalScore : 0;
    } else {
      currentScore = userResponse.length === answer.length && matches === totalMatches ? totalScore : 0;
    }
    score = Math.max(score, currentScore);
    maxScore = Math.max(maxScore, totalScore);

    if (currentScore === score && score !== 0) {
      rightIndex = ind;
    }
  });

  const evaluation = [];
  if (answers[rightIndex].value.method === BY_COUNT_METHOD) {
    userResponse.forEach((col, i) => {
      if (i < answers[rightIndex].value.value[0]) {
        evaluation.push(true);
      } else {
        evaluation.push(false);
      }
    });
  } else {
    userResponse.forEach(col => {
      evaluation.push(answers[rightIndex].value.value.some(ans => isEqual(ans, col)));
    });
  }

  return {
    score,
    maxScore,
    evaluation
  };
};

const partialCompareFunction = ({ answers, userResponse = [] }) => {
  let score = 0;
  let maxScore = 1;

  let rightIndex = 0;

  answers.forEach(({ value: { method, value: answer }, score: totalScore }, ind) => {
    if (!answer || !answer.length) {
      return;
    }

    let matches = 0;
    const totalMatches = method === BY_COUNT_METHOD ? answer[0] : answer.length;
    const scorePerAnswer = totalScore / totalMatches;

    if (method === BY_COUNT_METHOD) {
      matches = userResponse.length;
    } else {
      userResponse.forEach(col => {
        if (answer.some(ans => isEqual(ans, col))) {
          matches++;
        }
      });
    }

    const currentScore = scorePerAnswer * matches;

    score = Math.max(score, currentScore);
    maxScore = Math.max(maxScore, totalScore);

    if (currentScore === score && score !== 0) {
      rightIndex = ind;
    }
  });

  const evaluation = [];
  if (answers[rightIndex].value.method === BY_COUNT_METHOD) {
    userResponse.forEach((col, i) => {
      if (i < answers[rightIndex].value.value[0]) {
        evaluation.push(true);
      } else {
        evaluation.push(false);
      }
    });
  } else {
    userResponse.forEach(col => {
      evaluation.push(answers[rightIndex].value.value.some(ans => isEqual(ans, col)));
    });
  }

  const rightLen =
    answers[rightIndex].value.method === BY_COUNT_METHOD
      ? answers[rightIndex].value.value[0]
      : answers[rightIndex].value.value.length;

  return {
    score: score > maxScore ? maxScore : score,
    maxScore,
    evaluation,
    rightLen
  };
};

const evaluator = ({ userResponse = [], validation }) => {
  const { valid_response, alt_responses, scoring_type } = validation;
  const answers = [valid_response, ...alt_responses];

  switch (scoring_type) {
    case ScoringType.EXACT_MATCH:
      return exactMatchTemplate(exactCompareFunction, {
        userResponse,
        answers,
        validation
      });
    case ScoringType.PARTIAL_MATCH:
    case ScoringType.PARTIAL_MATCH_V2:
    default:
      return partialMatchTemplate(partialCompareFunction, {
        userResponse,
        answers,
        validation
      });
  }
};

export default evaluator;
