import { flatten, groupBy, identity, get, maxBy } from "lodash";
import { evaluate, getChecks } from "./math";
import clozeTextEvaluator from "./clozeText";

const mathEval = async ({ userResponse, validation }) => {
  const validResponses = groupBy(flatten(validation.valid_response.value), "id");
  const evaluation = {};
  // parallelize network request!!
  for (const id of Object.keys(userResponse)) {
    const checks = getChecks({ value: validResponses[id] });
    const answers = (validResponses[id] || []).map(item => item.value);
    const requests = answers.map(ans => {
      const data = {
        input: userResponse[id].value.replace(/\\ /g, " "),
        expected: ans ? ans.replace(/\\ /g, " ") : "",
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
    valid_response,
    alt_responses = [],
    scoring_type,
    min_score_if_attempted,
    penalty,
    ignoreCase = false
  } = validation;

  const { inputs = {}, dropDowns = {}, maths = {} } = userResponse;
  let score = 0;
  let maxScore = 0;
  const allEvaluations = [];

  const validAnswers = [valid_response, ...alt_responses];
  for (let i = 0; i < validAnswers.length; i++) {
    let evaluations = {};
    let currentScore = 0;
    const questionScore = (validAnswers[i] && validAnswers[i].score) || 1;
    maxScore = Math.max(questionScore, maxScore);

    if (validAnswers[i].dropdown) {
      const dropDownEvaluation = clozeTextEvaluator({
        userResponse: transformUserResponse(dropDowns),
        validation: { scoring_type: "exactMatch", valid_response: { score: 1, ...validAnswers[i].dropdown } }
      }).evaluation;

      evaluations = { ...evaluations, ...dropDownEvaluation };
    }

    if (validAnswers[i].textinput) {
      const clozeTextEvaluation = clozeTextEvaluator({
        userResponse: transformUserResponse(inputs),
        validation: {
          scoring_type: "exactMatch",
          valid_response: { score: 1, ...validAnswers[i].textinput },
          ignoreCase
        }
      }).evaluation;
      evaluations = { ...evaluations, ...clozeTextEvaluation };
    }

    if (validAnswers[i].value) {
      const mathEvaluation = await mathEval({
        userResponse: maths,
        validation: {
          scoring_type: "exactMatch",
          valid_response: validAnswers[i]
        }
      });
      evaluations = { ...evaluations, ...mathEvaluation };
    }

    const correctCount = Object.values(evaluations).filter(identity).length;
    const wrongCount = Object.values(evaluations).filter(x => !x).length;

    const answersCount =
      get(validAnswers[i].dropdown, ["value", "length"], 0) +
      get(validAnswers[i], ["value", "length"], 0) +
      get(validAnswers[i].textinput, ["value", "length"], 0);

    if (scoring_type === "partialMatch") {
      currentScore = questionScore * (correctCount / answersCount);

      if (penalty) {
        const negativeScore = penalty * wrongCount;
        currentScore -= negativeScore;
      }
    } else if (correctCount === answersCount) {
      currentScore = questionScore;
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

  if (min_score_if_attempted && score < min_score_if_attempted) {
    score = min_score_if_attempted;
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
  const answersArray = [...(validation.valid_response.value || [])];
  for (const altResp of validation.alt_responses) {
    if (altResp.value && Array.isArray(altResp.value)) answersArray.push(...altResp.value);
  }
  const answersById = groupBy(flatten(answersArray), "id");
  const evaluations = {};

  // parallelize this at some point
  for (const id of Object.keys(userResponse)) {
    const validAnswers = answersById[id];
    const calculations = validAnswers.map(validAnswer => {
      const checks = getChecks({ value: [validAnswer] });
      const expected = (validAnswer.value || "").replace(/\\ /g, " ");
      const input = userResponse[id].value.replace(/\\ /g, " ");
      return evaluate({ input, checks, expected });
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
    valid_response,
    alt_responses = [],
    // scoring_type,
    min_score_if_attempted = 0,
    penalty,
    ignoreCase = false
  } = validation;

  const { inputs = {}, dropDowns = {}, maths = {} } = userResponse;
  const alt_inputs = alt_responses.map(alt_res => ({ score: 1, ...alt_res.textinput }));
  const alt_dropdowns = alt_responses.map(alt_res => ({ score: 1, ...alt_res.dropdown }));

  const questionScore = (valid_response && valid_response.score) || 1;

  let score = 0;
  const optionCount =
    get(valid_response.dropdown, ["value", "length"], 0) +
    get(valid_response, ["value", "length"], 0) +
    get(valid_response.textinput, ["value", "length"], 0);

  // cloze-text evaluation!
  const clozeTextEvaluation =
    (valid_response.textinput &&
      clozeTextEvaluator({
        userResponse: transformUserResponse(inputs),
        validation: {
          scoring_type: "exactMatch",
          valid_response: { score: 1, ...valid_response.textinput },
          alt_responses: alt_inputs,
          mixAndMatch: true,
          ignoreCase
        }
      }).evaluation) ||
    {};

  // dropdown evaluation
  const dropDownEvaluation =
    (valid_response.dropdown &&
      clozeTextEvaluator({
        userResponse: transformUserResponse(dropDowns),
        validation: {
          scoring_type: "exactMatch",
          valid_response: { score: 1, ...valid_response.dropdown },
          alt_responses: alt_dropdowns,
          mixAndMatch: true
        }
      }).evaluation) ||
    {};

  // math evaluations
  const mathEvaluation =
    (valid_response &&
      (await mixAndMatchMathEvaluator({
        userResponse: maths,
        validation: {
          valid_response,
          alt_responses
        }
      }))) ||
    {};

  const evaluation = {
    ...dropDownEvaluation,
    ...clozeTextEvaluation,
    ...mathEvaluation
  };

  const correctAnswerCount = Object.values(evaluation).filter(identity).length;
  const wrongAnswerCount = Object.values(evaluation).filter(i => !i).length;

  if (validation.scoring_type === "partialMatch") {
    score = (correctAnswerCount / optionCount) * questionScore;
    if (validation.penalty) {
      const negativeScore = penalty * wrongAnswerCount;
      score -= negativeScore;
    }
  } else if (correctAnswerCount === optionCount) {
    score = questionScore;
  }

  score = Math.max(score, 0, min_score_if_attempted);

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
