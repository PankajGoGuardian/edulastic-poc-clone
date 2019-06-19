import { flatten, groupBy, identity, get, maxBy } from "lodash";
import { evaluate, getChecks } from "./math";
import clozeTextEvaluator from "./clozeText";

const mathEval = async ({ userResponse, validation }) => {
  const validResponses = groupBy(flatten(validation.valid_response.value), "id");
  const evaluation = {};
  for (const id of Object.keys(userResponse)) {
    const checks = getChecks({ valid_response: { value: validResponses[id] } });
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

const evaluator = async ({ userResponse = {}, validation }) => {
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
    const questionScore = textAnswers[i].score || 1;
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
export default evaluator;
