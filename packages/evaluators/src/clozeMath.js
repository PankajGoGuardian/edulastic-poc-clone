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
    valid_dropdown,
    valid_inputs,
    alt_responses = [],
    alt_dropdowns = [],
    alt_inputs = [],
    scoring_type,
    min_score_if_attempted,
    penalty
  } = validation;

  const { inputs = {}, dropDowns = {}, maths = {} } = userResponse;

  const mathAnswers = [valid_response, ...alt_responses];
  const dropDownAnswers = [valid_dropdown, ...alt_dropdowns];
  const textAnswers = [valid_inputs, ...alt_inputs];
  let score = 0;
  let maxScore = 0;
  const allEvaluations = [];

  const alterAnswersCount = Math.max(mathAnswers.length, dropDownAnswers.length, textAnswers.length);
  for (let i = 0; i < alterAnswersCount; i++) {
    const dropDownValidation = dropDownAnswers[i];
    const clozeTextValidation = textAnswers[i];
    const mathValidation = mathAnswers[i];
    const questionScore =
      (textAnswers[i] && textAnswers[i].score) ||
      (mathAnswers[i] && mathAnswers[i].score) ||
      (dropDownAnswers[i] && dropDownAnswers[i].score) ||
      1;
    let currentScore = 0;
    let evaluations = {};

    maxScore = Math.max(questionScore, maxScore);

    if (dropDownValidation) {
      const dropDownEvaluation = clozeTextEvaluator({
        userResponse: transformUserResponse(dropDowns),
        validation: { scoring_type: "exactMatch", valid_response: dropDownValidation }
      }).evaluation;

      evaluations = { ...evaluations, ...dropDownEvaluation };
    }

    if (clozeTextValidation) {
      const clozeTextEvaluation = clozeTextEvaluator({
        userResponse: transformUserResponse(inputs),
        validation: { scoring_type: "exactMatch", valid_response: clozeTextValidation }
      }).evaluation;
      evaluations = { ...evaluations, ...clozeTextEvaluation };
    }

    if (mathValidation) {
      const mathEvaluation = await mathEval({
        userResponse: maths,
        validation: {
          scoring_type: "exactMatch",
          valid_response: mathValidation
        }
      });
      evaluations = { ...evaluations, ...mathEvaluation };
    }

    const correctCount = Object.values(evaluations).filter(identity).length;
    const wrongCount = Object.values(evaluations).filter(x => !x).length;

    const answersCount =
      get(dropDownValidation, ["value", "length"], 0) +
      get(mathValidation, ["value", "length"], 0) +
      get(clozeTextValidation, ["value", "length"], 0);

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
    valid_dropdown,
    valid_inputs,
    alt_responses = [],
    alt_dropdowns = [],
    alt_inputs = [],
    scoring_type,
    min_score_if_attempted = 0,
    penalty
  } = validation;

  const { inputs = {}, dropDowns = {}, maths = {} } = userResponse;

  const questionScore =
    (valid_inputs && valid_inputs.score) ||
    (valid_response && valid_response.score) ||
    (valid_dropdown && valid_dropdown.score) ||
    1;

  let score = 0;
  const optionCount =
    get(valid_response, ["value", "length"], 0) +
    get(valid_inputs, ["value", "length"], 0) +
    get(valid_dropdown, ["value", "length"], 0);

  // cloze-text evaluation!
  const clozeTextEvaluation =
    (valid_inputs &&
      clozeTextEvaluator({
        userResponse: transformUserResponse(inputs),
        validation: {
          scoring_type: "exactMatch",
          valid_response: valid_inputs,
          alt_responses: alt_inputs,
          mixAndMatch: true
        }
      }).evaluation) ||
    {};

  // dropdown evaluation
  const dropDownEvaluation =
    (valid_dropdown &&
      clozeTextEvaluator({
        userResponse: transformUserResponse(dropDowns),
        validation: {
          scoring_type: "exactMatch",
          valid_response: valid_dropdown,
          alt_responses: alt_dropdowns,
          mixAndMatch: true
        }
      }).evaluation) ||
    {};

  // math evaluations
  const mathEvaluation = await mixAndMatchMathEvaluator({
    userResponse: maths,
    validation: {
      valid_response,
      alt_responses
    }
  });

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
