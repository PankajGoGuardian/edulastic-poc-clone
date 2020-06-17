import axios from "axios";
import { omitBy } from "lodash";
import { ScoringType } from "./const/scoring";

const url = process.env.POI_APP_MATH_EVALUATE_API || "https://edulastic-poc.snapwiz.net/math-api/evaluate";

export const evaluate = data =>
  axios
    .post(url, {
      ...data
    })
    .then(result => result.data)
    .catch(err => {

      // for certain req err respose is undefined
      if(err && !err.response) throw err;

      if (!data.expected) {
        console.error("Error from mathengine", err.response.data);
        return {};
      }
      throw err.response.data;
    });

export const getChecks = answer => {
  const values = answer.value || [];
  return values.reduce((valAcc, val, valIndex) => {
    let options = val.options || {};
    options = omitBy(options, f => f === false);

    const optionsKeyed = Object.keys(options);
    const optionsToFilter = ["allowedVariables", "allowNumericOnly", "unit", "argument"];
    const filteredOptions = optionsKeyed.filter(key => !optionsToFilter.includes(key));
    // combine the method and options using colon
    // combine only if there are sub options
    const initialValue = filteredOptions.length > 0 ? `${val.method}:` : `${val.method}`;

    let midRes = optionsKeyed.reduce((acc, key, i) => {
      if (key === "interpretAsInterval" || key === "interpretAsNumber") {
        acc = acc === "equivSymbolic" ? "symbolic" : acc;
      }
      if (key === "allowedVariables" || key === "allowNumericOnly" || key === "unit") {
        return acc;
      }
      const fieldVal = options[key];

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
      } else if (key === "tolerance") {
        acc += `${key}=${fieldVal}`;
      } else {
        acc += `${key}`;
      }
      return `${acc},`;
    }, initialValue);

    if (midRes[midRes.length - 1] === ",") {
      midRes = midRes.slice(0, midRes.length - 1);
    }

    valAcc += midRes;

    valAcc += valIndex + 1 === values.length ? "" : ";";

    return valAcc;
  }, "");
};

// exact match evaluator
const exactMatchEvaluator = async (userResponse = "", answers) => {
  let score = 0;
  let maxScore = 0;
  let evaluation = [];
  try {
    const getAnswerCorrectMethods = answer => {
      if (answer.value && answer.value.length) {
        return answer.value.map(val => {
          const { options = {} } = val;
          if (options.unit) {
            if (val.value.search("=") === -1) {
              return val.value + options.unit;
            }
            return val.value.replace(/=/gm, `${options.unit}=`);
          }
          return val.value;
        });
      }
      return [];
    };
    /* eslint-disable */
    for (let answer of answers) {
      maxScore = Math.max(answer.score, maxScore);
      let checks = getChecks(answer);
      if (typeof checks === "string") {
        if (checks.includes("equivLiteral")) {
          checks = checks.replace(/equivLiteral/g, "literal");
        } else if (checks.includes("equivSyntax")) {
          checks = checks.replace(/equivSyntax/g, "syntax");
        }
      }
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
      // Below code runs successfully only when mathEngine doesn't trow error
      if (valid) {
        score = Math.max(answer.score, score);
      }
      evaluation = [...evaluation, valid];
    }
  } catch (e) {
    console.log(e);
  } finally {
    /** 
     * Max score and evalution are now getting set
     * And Handling the case when math engine thorws error
    */
    return {
      score,
      maxScore,
      evaluation: !evaluation.length ? [false] : evaluation
    };
  }
};

const evaluator = async ({ userResponse, validation }) => {
  const { validResponse, altResponses = [], scoringType, minScoreIfAttempted: attemptScore } = validation;
  const answers = [validResponse, ...altResponses];

  // if its math unit type, derive answer by making into a string.
  if (typeof userResponse === "object" && (userResponse.expression || userResponse.unit)) {
    const expression = userResponse.expression || "";
    const unit = userResponse.unit || "";
    if (expression.search("=") === -1) {
      userResponse = expression + unit;
    } else {
      userResponse = expression.replace(/=/gm, `${unit}=`);
    }
  }
  let result;

  // TODO: Why....? fix-this.
  switch (scoringType) {
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
