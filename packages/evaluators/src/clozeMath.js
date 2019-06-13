import axios from "axios";
import { omitBy, flatten, isNumber, isString, round, trim, isNaN, cloneDeep } from "lodash";
import { ScoringType } from "./const/scoring";
import clozeTextEvaluator from "./clozeText";

const url = process.env.POI_APP_MATH_EVALUATE_API || "https://edulastic-poc.snapwiz.net/math-api/evaluate";

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
      input: isString(userResponse) || isNumber(userResponse) ? userResponse.replace(/\\ /g, " ") : "",
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

const sortResponses = (userResponse, validResponse) => {
  const _userRes = [];
  const _validRes = [];
  if (userResponse) {
    Object.keys(userResponse).map(id => {
      const response = userResponse[id].value;
      if (validResponse.value) {
        const valid = validResponse.value.find(_valid => _valid.id === id);
        _validRes.push(valid.value);
      }
      _userRes.push(response);
    });
  }
  if (_validRes.length) {
    validResponse.value = _validRes;
  }
  return { userResponse: _userRes, validResponse };
};

const evaluator = async ({ userResponse = {}, validation }) => {
  const {
    valid_response,
    valid_dropdown,
    valid_inputs,
    alt_responses = [],
    alt_dropdowns = [],
    alt_inputs = [],
    scoring_type,
    min_score_if_attempted: attemptScore
  } = validation;
  let entered = 1;
  const answers = [valid_response, ...alt_responses];
  const { dropDowns = {}, inputs = {}, maths = {} } = userResponse;
  const { userResponse: _inputsResponse = [], validResponse: validInputs } = sortResponses(
    cloneDeep(inputs),
    cloneDeep(valid_inputs)
  );
  entered += _inputsResponse.length;
  const inputsResults = await clozeTextEvaluator({
    userResponse: _inputsResponse,
    validation: {
      scoring_type,
      alt_responses: alt_inputs,
      valid_response: {
        ...validInputs
      }
    }
  });

  const { userResponse: _dropDownResponse = [], validResponse: validDropDown } = sortResponses(
    cloneDeep(dropDowns),
    cloneDeep(valid_dropdown)
  );
  entered += _dropDownResponse.length;
  const dropDownResults = await clozeTextEvaluator({
    userResponse: _dropDownResponse,
    validation: {
      scoring_type,
      alt_responses: alt_dropdowns,
      valid_response: {
        ...validDropDown
      }
    }
  });

  let mathResults = {};
  const { userResponse: _mathResponse = [] } = sortResponses(cloneDeep(maths), cloneDeep(answers));
  entered += _mathResponse.length;
  switch (scoring_type) {
    case ScoringType.EXACT_MATCH:
    default:
      const checks = getChecks(validation);
      mathResults = await exactMatchEvaluator(_mathResponse.map(r => (r ? trim(r) : "")), answers, checks);
  }

  // if score for attempting is greater than current score
  // let it be the score!
  if (!Number.isNaN(attemptScore) && attemptScore > mathResults.score) {
    mathResults.score = attemptScore;
  }

  let corrects = inputsResults.evaluation.filter(answer => answer).length;
  corrects += dropDownResults.evaluation.filter(answer => answer).length;
  corrects += mathResults.evaluation ? mathResults.evaluation.filter(answer => answer).length : 0;

  // evaluation results to one list dropDown, inputs, maths
  let _evaluation = [];

  Object.keys(dropDowns).map((key, i) => {
    _evaluation[dropDowns[key].index] = dropDownResults.evaluation[i];
  });

  Object.keys(inputs).map((key, i) => {
    _evaluation[inputs[key].index] = inputsResults.evaluation[i];
  });

  Object.keys(maths).map((key, i) => {
    _evaluation[maths[key].index] = mathResults.evaluation[i];
  });

  let score = round(corrects / entered, 2);

  if (isNaN(score)) {
    score = 0;
  }

  const maxScore = 1;

  return {
    evaluation: _evaluation,
    score,
    maxScore
  };
};

export default evaluator;
