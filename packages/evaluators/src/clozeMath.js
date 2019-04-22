import axios from "axios";
import { omitBy, flatten } from "lodash";
import { ScoringType } from "./const/scoring";

const url = "https://1nz4dq81w6.execute-api.us-east-1.amazonaws.com/dev/evaluate";

const evaluate = data =>
  axios
    .post(url, {
      ...data
    })
    .then(result => result.data);

const getChecks = validation => {
  const altResponses = validation.alt_responses || [];
  const flattenValidResponses = flatten(validation.valid_response.value);
  const flattenAltResponses = altResponses.reduce((acc, res) => [...acc, ...flatten(res.value)], []);

  const values = [...flattenValidResponses, ...flattenAltResponses];

  return values.reduce((valAcc, val, valIndex) => {
    let options = val.options || {};
    options = omitBy(options, f => f === false);

    let midRes = Object.keys(options).reduce((acc, key, i) => {
      const fieldVal = options[key];

      acc += i === 0 ? ":" : "";

      if (key === "argument") {
        return acc;
      }

      if (fieldVal === false) {
        return acc;
      }

      if (key === "setThousandsSeparator") {
        if (fieldVal.length) {
          const stringArr = `[${fieldVal.map(f => `'${f}'`)}]`;
          acc += `${key}=${stringArr}`;
        } else {
          return acc;
        }
      } else if (key === "allowThousandsSeparator") {
        return acc;
      } else if (key === "setDecimalSeparator") {
        acc += `${key}='${fieldVal}'`;
      } else if (key === "allowedUnits") {
        acc += `${key}=[${fieldVal}]`;
      } else if (key === "syntax") {
        acc += options.argument === undefined ? fieldVal : `${fieldVal}=${options.argument}`;
      } else {
        acc += `${key}=${fieldVal}`;
      }

      return `${acc},`;
    }, val.method);

    if (midRes[midRes.length - 1] === ",") {
      midRes = midRes.slice(0, midRes.length - 1);
    }

    valAcc += midRes;

    valAcc += valIndex + 1 === values.length ? "" : ";";

    return valAcc;
  }, "");
};

const checkCorrect = async ({ correctAnswers, userResponse, checks }) => {
  let valid = false;

  for (const correct of correctAnswers) {
    const data = {
      input: userResponse.replace(/\\ /g, " "),
      expected: correct ? correct.replace(/\\ /g, " ") : ":",
      checks
    };

    try {
      const { result } = await evaluate(data);

      if (result === "true") {
        valid = true;
        break;
      }
    } catch {
      continue;
    }
  }

  return valid;
};

// exact match evaluator
const exactMatchEvaluator = async (userResponse, answers, checks) => {
  let score = 0;
  let maxScore = 1;
  const evaluation = [];
  let correctIndex = 0;

  const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  };

  try {
    const getAnswerCorrectMethods = answer => {
      if (Array.isArray(answer.value)) {
        return answer.value.map(val => val.map(({ value }) => value));
      }
      return [];
    };

    await asyncForEach(answers, async (answer, answerIndex) => {
      const corrects = getAnswerCorrectMethods(answer);

      const valid = [];

      await asyncForEach(userResponse, async (userAns, index) => {
        const res = await checkCorrect({ correctAnswers: corrects[index], userResponse: userAns, checks });
        valid.push(res);
      });

      evaluation.push([...valid]);

      const isExact = element => element;

      if (valid.every(isExact)) {
        score = Math.max(answer.score, score);
        correctIndex = answerIndex;
      }

      maxScore = Math.max(answer.score, maxScore);
    });

    /* eslint-disable */
  } catch (e) {
    console.error(e);
  } finally {
    return {
      score,
      maxScore,
      evaluation: evaluation[correctIndex]
    };
  }
};

const evaluator = async ({ userResponse, validation }) => {
  const { valid_response, alt_responses = [], scoring_type, min_score_if_attempted: attemptScore } = validation;
  const answers = [valid_response, ...alt_responses];

  let result;

  switch (scoring_type) {
    case ScoringType.EXACT_MATCH:
    default:
      const checks = getChecks(validation);
      result = await exactMatchEvaluator(userResponse, answers, checks);
  }

  // if score for attempting is greater than current score
  // let it be the score!
  if (!Number.isNaN(attemptScore) && attemptScore > result.score) {
    result.score = attemptScore;
  }

  return result;
};

export default evaluator;
