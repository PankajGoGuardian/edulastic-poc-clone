import { isEqual } from "lodash";
import { get as levenshteinDistance } from "fast-levenshtein";

export const isLessThanOneMistake = (userAnswer, validAnswer, ignoreCase) => {
  if (ignoreCase) {
    userAnswer = userAnswer.toLowerCase();
    validAnswer = validAnswer.toLowerCase();
  }

  const mistakeCount = levenshteinDistance(userAnswer, validAnswer);
  return mistakeCount < 2;
};

export const getClozeTextMatches = (response, answer, restOptions) =>
  response.filter((resp, index) => {
    resp = (resp || "").trim();
    const ans = (answer[index] || "").trim();
    if (restOptions.allowSingleLetterMistake) {
      return isLessThanOneMistake(ans, resp, restOptions.ignoreCase);
    }
    if (restOptions.ignoreCase) {
      return isEqual(
        answer[index].trim() ? answer[index].trim().toLowerCase() : null,
        resp.trim() ? resp.trim().toLowerCase() : undefined
      );
    }
    return isEqual(answer[index].trim(), resp.trim());
  }).length;

export const getClozeTextEvaluation = (response, answer, restOptions) =>
  response.map((resp, index) => {
    resp = (resp || "").trim();
    const ans = (answer[index] || "").trim();
    if (restOptions.allowSingleLetterMistake) {
      return isLessThanOneMistake(ans, resp, restOptions.ignoreCase);
    }
    if (restOptions.ignoreCase) {
      return isEqual(
        answer[index].trim() ? answer[index].trim().toLowerCase() : null,
        resp.trim() ? resp.trim().toLowerCase() : undefined
      );
    }
    return isEqual(answer[index].trim(), resp.trim());
  });
