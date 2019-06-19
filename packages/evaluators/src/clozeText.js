import { identity, maxBy, max, get } from "lodash";
import { get as levenshteinDistance } from "fast-levenshtein";

// create an `{id: value}` list from object
const createAnswerObject = answers => {
  const responses = {};
  for (const ans of answers) {
    responses[ans.id] = ans.value;
  }
  return responses;
};

/**
 *
 * @param {string} answer  // correct answer
 * @param {string} response  // user response
 * @param {boolean} allowSingleLetterMistake  // is single letter mistake accepted
 * @param {boolean} ignoreCase  // ignore case of answer
 */
const compareChoice = (answer, response, allowSingleLetterMistake = false, ignoreCase = false) => {
  // trimmmm...
  answer = ignoreCase ? answer.trim().toLowerCase() : answer.trim();
  response = ignoreCase ? response.trim().toLowerCase() : response.trim();

  // is single letter mistake allowed?
  // if yes, then check if "levenshtein-distance" is less than 1
  // else it should be a an exact match
  return allowSingleLetterMistake ? levenshteinDistance(answer, response) <= 1 : answer === response;
};

const groupChoiceById = answers => {
  const answersById = {};
  for (const answer of answers) {
    for (const choice of answer.value) {
      answersById[choice.id] = !answersById[choice.id]
        ? [choice.value.trim()]
        : [...answersById[choice.id], choice.value.trim()];
    }
  }

  return answersById;
};

// mix and match evaluator
const mixAndMatchEvaluator = ({ userResponse, validation }) => {
  const responses = createAnswerObject(userResponse);

  const answers = [validation.valid_response, ...(validation.alt_responses || [])];
  const maxScore = max(answers.map(i => i.score));
  const evaluation = {};
  const answersById = groupChoiceById(answers);
  const optionCount = get(validation, "valid_response.value.length", 0);
  let score = 0;
  const questionScore = get(validation, "valid_response.score", 1);
  for (const id of Object.keys(responses)) {
    const answerSet = answersById[id];
    const userResp = responses[id];
    evaluation[id] = answerSet.some(item =>
      compareChoice(item, userResp, validation.allowSingleLetterMistake, validation.ignoreCase)
    );
  }

  // correct and wrong answer count
  const correctAnswerCount = Object.values(evaluation).filter(identity).length;
  const wrongAnswerCount = Object.values(evaluation).filter(i => !i).length;

  if (validation.scoring_type === "partialMatch") {
    score = (correctAnswerCount / optionCount) * questionScore;
    if (validation.penalty) {
      const penalty = validation.penalty * wrongAnswerCount;
      score -= penalty;
    }
  } else if (correctAnswerCount === optionCount) {
    score = questionScore;
  }

  score = Math.max(score, 0);
  return {
    score,
    evaluation,
    maxScore
  };
};

// normal evaluator
const normalEvaluator = ({ userResponse, validation }) => {
  const responses = createAnswerObject(userResponse);

  const answers = [validation.valid_response, ...(validation.alt_responses || [])];
  const evaluations = [];
  const maxScore = max(answers.map(i => i.score));

  for (const answer of answers) {
    const currentEvaluation = {};
    let currentScore = 0;

    const answerObj = createAnswerObject(answer.value);
    for (const id of Object.keys(responses)) {
      currentEvaluation[id] = compareChoice(
        answerObj[id],
        responses[id],
        validation.allowSingleLetterMistake,
        validation.ignoreCase
      );
    }

    const correctAnswerCount = Object.values(currentEvaluation).filter(identity).length;

    // if scoring type is "partialMatch", calculate the partial score
    if (validation.scoring_type === "partialMatch") {
      const questionScore = answer.score;
      currentScore = questionScore * (correctAnswerCount / answer.value.length);
      // if penalty is present
      if (validation.penalty) {
        const wrongAnswerCount = Object.values(currentEvaluation).filter(i => !i).length;
        const penalty = validation.penalty * wrongAnswerCount;
        currentScore -= penalty;
      }
      // if less than 0, round it to 0
      currentScore = currentScore > 0 ? currentScore : 0;
    } else if (correctAnswerCount === answer.value.length) {
      // in case of exact match
      currentScore = answer.score;
    }

    evaluations.push({ score: currentScore, evaluation: currentEvaluation });
  }

  // one which gave max score from the set of answers
  const correct = maxBy(evaluations, "score");
  // if user doesnt get correct answers at all, send back the evaluation to first one.
  const evaluation = correct.score === 0 ? evaluations[0] : correct;

  // if score for attempting is present
  if (validation.min_score_if_attempted && evaluation.score < validation.min_score_if_attempted) {
    evaluation.score = validation.min_score_if_attempted;
  }

  return {
    ...evaluation,
    maxScore
  };
};

// cloze text evaluator
const evaluator = ({
  userResponse = [], // user submitted response
  validation = {} // validation object from the question data
}) =>
  validation.mixAndMatch
    ? mixAndMatchEvaluator({ userResponse, validation })
    : normalEvaluator({ userResponse, validation });

export default evaluator;
