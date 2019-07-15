import axios from "axios";
import { omitBy } from "lodash";
import { ScoringType } from "./const/scoring";

const url = process.env.POI_APP_MATH_EVALUATE_API || "https://edulastic-poc.snapwiz.net/math-api/evaluate";

export const evaluate = data =>
  axios
    .post(url, {
      ...data
    })
    .then(result => result.data);

export const getChecks = answer => {
  const values = answer.value || [];
  return values.reduce((valAcc, val, valIndex) => {
    let options = val.options || {};
    options = omitBy(options, f => f === false);

    let midRes = Object.keys(options).reduce((acc, key, i) => {
      if (key === "allowedVariables" || key === "allowNumericOnly") {
        return acc;
      }
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
          if (fieldVal.includes(".") && !options.setDecimalSeparator) {
            acc += `${key}=${stringArr},setDecimalSeparator=','`;
          } else {
            acc += `${key}=${stringArr}`;
          }
        } else {
          return acc;
        }
      } else if (key === "setDecimalSeparator") {
        if (fieldVal === "," && !options.setThousandsSeparator) {
          acc += `${key}='${fieldVal}',setThousandsSeparator='.'`;
        } else {
          acc += `${key}='${fieldVal}'`;
        }
      } else if (key === "allowedUnits") {
        acc += `${key}=[${fieldVal}]`;
      } else if (key === "syntax") {
        acc += options.argument === undefined ? fieldVal : `${fieldVal}=${options.argument}`;
      } else if (key === "field") {
        acc += `${fieldVal}`;
      } else {
        acc += `${key}`;
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

// exact match evaluator
const exactMatchEvaluator = async (userResponse, answers) => {
  let score = 0;
  let maxScore = 1;
  let evaluation = [];
  try {
    const getAnswerCorrectMethods = answer => {
      if (answer.value && answer.value.length) {
        return answer.value.map(val => val.value);
      }
      return [];
    };
    /* eslint-disable */
    for (let answer of answers) {
      const checks = getChecks(answer);
      const corrects = getAnswerCorrectMethods(answer);
      let valid = false;
      for (let correct of corrects) {
        const data = {
          input: userResponse.replace(/\\ /g, " "),
          expected: correct ? correct.replace(/\\ /g, " ") : "",
          checks
        };
        const { result } = await evaluate(data);
        if (result === "true") {
          valid = true;
          break;
        }
      }
      if (valid) {
        score = Math.max(answer.score, score);
      }
      maxScore = Math.max(answer.score, maxScore);
      evaluation = [...evaluation, valid];
    }
  } catch (e) {
    console.log(e);
  } finally {
    return {
      score,
      maxScore,
      evaluation
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
      result = await exactMatchEvaluator(userResponse, answers);
  }

  // if score for attempting is greater than current score
  // let it be the score!
  if (!Number.isNaN(attemptScore) && attemptScore > result.score) {
    result.score = attemptScore;
  }

  return result;
};

export default evaluator;
