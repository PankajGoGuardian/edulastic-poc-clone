import { flatten, groupBy, identity, get, maxBy, cloneDeep,isEmpty } from "lodash";
import { evaluationType } from "@edulastic/constants";
import { evaluate, getChecks } from "./math";
import clozeTextEvaluator from "./clozeText";
import { filterEmptyAnswers } from "./helpers/filterEmptyUserAnswers";

// combine unit and value for the clozeMath type Math w/Unit

const combineUnitAndExpression = (expression = "", unit) => {
  if (expression.search("=") === -1) {
    return expression + unit;
  }
  return expression.replace(/=/gm, `${unit}=`);
};

const mathEval = async ({ userResponse, validation }) => {
  const _validation = cloneDeep(validation);
  const _userResponse = cloneDeep(userResponse);
  const validResponses = groupBy(flatten(_validation.validResponse.value), "id");
  const evaluation = {};
  // parallelize network request!!
  for (const id of Object.keys(_userResponse)) {
    const checks = getChecks({ value: validResponses[id] });

    const answers = (validResponses[id] || []).map(item => {
      const { options = {} } = item;
      if (options.unit) {
        return combineUnitAndExpression(item.value, options.unit);
      }
      return item.value;
    });

    const requests = answers.map(ans => {
      let { value = "" } = _userResponse[id];
      const { unit } = _userResponse[id];
      if (unit) {
        value = combineUnitAndExpression(value, unit);
      }

      // removing pattern `<space> after \\`
      const data = {
        input: value.replace(/(\\\s|\s)+/g, "").replace(/(\\)?\$]/g, "\\$"),
        expected: ans ? ans.replace(/(\\\s|\s)+/g, "").replace(/(\\)?\$/g, "\\$") : "",
        checks
      };

      return evaluate(data);
    });

    const results = await Promise.all(requests);
    const correct = results.some(item => item.result === "true");
    evaluation[id] = correct;
  }

  return evaluation;
};

/**
 * transform user repsonse for the clozeText type evaluator.
 */
const transformUserResponse = userResponse =>
  Object.keys(userResponse).map(id => ({
    id,
    ...userResponse[id]
  }));

const normalEvaluator = async ({ userResponse = {}, validation }) => {
  const {
    validResponse,
    altResponses = [],
    scoringType,
    minScoreIfAttempted,
    penalty = 0,
    ignoreCase = false,
    allowSingleLetterMistake = false
  } = validation;

  const { inputs = {}, dropDowns = {}, maths = {}, mathUnits = {} } = userResponse;
  let score = 0;
  let maxScore = 0;
  const allEvaluations = [];

  const _maths = filterEmptyAnswers({ type: "maths", userAnswers: maths });
  const _mathUnits = filterEmptyAnswers({ type: "mathWithUnits", userAnswers: mathUnits });

  const validAnswers = [validResponse, ...altResponses];
  for (let i = 0; i < validAnswers.length; i++) {
    let evaluations = {};
    let currentScore = 0;
    const questionScore = (validAnswers[i] && validAnswers[i].score) || 1;
    maxScore = Math.max(questionScore, maxScore);

    if (!isEmpty(validAnswers[i].dropdown)) {
      const dropDownEvaluation = clozeTextEvaluator({
        userResponse: transformUserResponse(dropDowns),
        validation: {
          scoringType: evaluationType.EXACT_MATCH,
          validResponse: { score: 1, ...validAnswers[i].dropdown }
        }
      }).evaluation;

      evaluations = { ...evaluations, ...dropDownEvaluation };
    }

    if (!isEmpty(validAnswers[i].textinput)) {
      const clozeTextEvaluation = clozeTextEvaluator({
        userResponse: transformUserResponse(inputs),
        validation: {
          scoringType: evaluationType.EXACT_MATCH,
          validResponse: { score: 1, ...validAnswers[i].textinput },
          ignoreCase,
          allowSingleLetterMistake
        }
      }).evaluation;
      evaluations = { ...evaluations, ...clozeTextEvaluation };
    }

    if (!isEmpty(validAnswers[i].value)) {
      const mathEvaluation = await mathEval({
        userResponse: _maths,
        validation: {
          scoringType: evaluationType.EXACT_MATCH,
          validResponse: validAnswers[i]
        }
      });
      evaluations = { ...evaluations, ...mathEvaluation };
    }

    if (!isEmpty(validAnswers[i].mathUnits)) {
      const mathEvaluation = await mathEval({
        userResponse: _mathUnits,
        validation: {
          scoringType: evaluationType.EXACT_MATCH,
          validResponse: validAnswers[i].mathUnits
        }
      });
      evaluations = { ...evaluations, ...mathEvaluation };
    }

    const correctCount = Object.values(evaluations).filter(identity).length;

    const answersCount =
      get(validAnswers[i].dropdown, ["value", "length"], 0) +
      get(validAnswers[i].mathUnits, ["value", "length"], 0) +
      get(validAnswers[i], ["value", "length"], 0) +
      get(validAnswers[i].textinput, ["value", "length"], 0);

    const scoreOfAnswer = maxScore / answersCount;
    const penaltyOfAnwer = penalty / answersCount;
    const penaltyScore = penaltyOfAnwer * (answersCount - correctCount);

    if (scoringType === evaluationType.EXACT_MATCH) {
      currentScore = correctCount === answersCount ? maxScore : 0;
    } else {
      // partial match
      currentScore = scoreOfAnswer * correctCount;
      currentScore -= penaltyScore;
    }

    score = Math.max(score, currentScore);
    allEvaluations.push({ evaluation: evaluations, score: currentScore });
  }

  let selectedEvaluation = maxBy(allEvaluations, "score");
  if (score === 0) {
    selectedEvaluation = allEvaluations[0].evaluation;
  } else {
    selectedEvaluation = selectedEvaluation.evaluation;
  }

  if (score < 0) {
    score = 0;
  }

  if (minScoreIfAttempted && score < minScoreIfAttempted) {
    score = minScoreIfAttempted;
  }

  return {
    score,
    evaluation: selectedEvaluation,
    maxScore
  };
};

/**
 * mix and match math evluator
 *
 */
const mixAndMatchMathEvaluator = async ({ userResponse, validation }) => {
  const _validation = cloneDeep(validation);
  const _userResponse = cloneDeep(userResponse);
  const answersArray = _validation.validResponse.value || [];
  for (const altResp of _validation.altResponses) {
    if (altResp.value && Array.isArray(altResp.value)) answersArray.push(...altResp.value);
  }
  const answersById = groupBy(flatten(answersArray), "id");
  const evaluations = {};
  // parallelize this at some point
  for (const id of Object.keys(_userResponse)) {
    const validAnswers = answersById[id];
    const calculations = validAnswers.map(validAnswer => {
      const checks = getChecks({ value: [validAnswer] });
      let expected = validAnswer.value || "";
      let input = _userResponse[id].value || "";
      const { options = {} } = validAnswer;
      if (options.unit) {
        const correctAnswerExpression = validAnswer.value || "";
        const correctAnswerUnit = options.unit;
        expected = combineUnitAndExpression(correctAnswerExpression, correctAnswerUnit );
      }
      if (_userResponse[id].unit) {
        const userAnswerExpression = _userResponse[id].value || "";
        const userAnswerUnit = _userResponse[id].unit
        input = combineUnitAndExpression(userAnswerExpression, userAnswerUnit);
      }
      // removing pattern `<space> after \\`
      return evaluate({
        checks,
        input: input.replace(/(\\\s|\s)+/g, "").replace(/(\\)?\$]/g, "\\$"),
        expected: expected.replace(/(\\\s|\s)+/g, "").replace(/(\\)?\$]/g, "\\$")
      });
    });

    const result = await Promise.all(calculations);
    const correct = result.some(item => item.result === "true");
    evaluations[id] = correct;
  }

  return evaluations;
};

/**
 * mix and match evaluators
 */
const mixAndMatchEvaluator = async ({ userResponse, validation }) => {
  const {
    validResponse,
    altResponses = [],
    // scoringType,
    minScoreIfAttempted = 0,
    penalty = 0,
    ignoreCase = false,
    allowSingleLetterMistake = false
  } = validation;

  const { inputs = {}, dropDowns = {}, maths = {}, mathUnits = {} } = userResponse;

  const _maths = filterEmptyAnswers({ type: "maths", userAnswers: maths });
  const _mathUnits = filterEmptyAnswers({ type: "mathWithUnits", userAnswers: mathUnits });

  const alt_inputs = altResponses.map(alt_res => ({ score: 1, ...alt_res.textinput }));
  const alt_dropdowns = altResponses.map(alt_res => ({ score: 1, ...alt_res.dropdown }));
  const altMathUnits = altResponses.map(alt_res => ({ score: 1, ...alt_res.mathUnits }));

  const questionScore = (validResponse && validResponse.score) || 1;

  let score = 0;
  const optionCount =
    get(validResponse.dropdown, ["value", "length"], 0) +
    get(validResponse.mathUnits, ["value", "length"], 0) +
    get(validResponse, ["value", "length"], 0) +
    get(validResponse.textinput, ["value", "length"], 0);

  // cloze-text evaluation!
  const clozeTextEvaluation =
    (!isEmpty(validResponse.textinput) &&
      clozeTextEvaluator({
        userResponse: transformUserResponse(inputs),
        validation: {
          scoringType: evaluationType.EXACT_MATCH,
          validResponse: { score: 1, ...validResponse.textinput },
          altResponses: alt_inputs,
          mixAndMatch: true,
          ignoreCase,
          allowSingleLetterMistake
        }
      }).evaluation) ||
    {};

  // dropdown evaluation
  const dropDownEvaluation =
    (!isEmpty(validResponse.dropdown) &&
      clozeTextEvaluator({
        userResponse: transformUserResponse(dropDowns),
        validation: {
          scoringType: evaluationType.EXACT_MATCH,
          validResponse: { score: 1, ...validResponse.dropdown },
          altResponses: alt_dropdowns,
          mixAndMatch: true
        }
      }).evaluation) ||
    {};

  // math evaluations
  const mathEvaluation =
    (!isEmpty(validResponse.value) &&
      (await mixAndMatchMathEvaluator({
        userResponse: _maths,
        validation: {
          validResponse,
          altResponses
        }
      }))) ||
    {};

  // mathUnits evaluations
  const mathUnitsEvaluation =
    (!isEmpty(validResponse.mathUnits) &&
      (await mixAndMatchMathEvaluator({
        userResponse: _mathUnits,
        validation: {
          validResponse: validResponse.mathUnits,
          altResponses: altMathUnits
        }
      }))) ||
    {};

  const evaluation = {
    ...dropDownEvaluation,
    ...clozeTextEvaluation,
    ...mathEvaluation,
    ...mathUnitsEvaluation
  };

  const correctAnswerCount = Object.values(evaluation).filter(identity).length;
  const wrongAnswerCount = Object.values(evaluation).filter(i => !i).length;

  if (validation.scoringType === evaluationType.PARTIAL_MATCH) {
    score = (correctAnswerCount / optionCount) * questionScore;
    if (validation.penalty) {
      const negativeScore = penalty * wrongAnswerCount;
      score -= negativeScore;
    }
  } else if (correctAnswerCount === optionCount) {
    score = questionScore;
  }

  score = Math.max(score, 0, minScoreIfAttempted);

  return {
    score,
    evaluation,
    maxScore: questionScore
  };
};

export default ({ userResponse = {}, validation }) =>
  validation.mixAndMatch
    ? mixAndMatchEvaluator({ userResponse, validation })
    : normalEvaluator({ userResponse, validation });
