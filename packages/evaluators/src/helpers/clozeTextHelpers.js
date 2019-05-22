import { isEqual } from "lodash";

export const isLessThanOneMistake = (userAnswer, validAnswer, ignoreCase) => {
  const userAnswerArray = [...userAnswer];
  const validAnswerArray = [...validAnswer];

  let mistakesCount = 0;
  if (ignoreCase) {
    userAnswerArray.forEach((letter, index) => {
      if (letter.toLowerCase() !== validAnswerArray[index].toLowerCase()) {
        mistakesCount++;
      }
    });
  } else {
    userAnswerArray.forEach((letter, index) => {
      if (letter !== validAnswerArray[index]) {
        mistakesCount++;
      }
    });
  }

  return mistakesCount <= 1;
};

export const getClozeTextMatches = (response, answer, restOptions) =>
  response.filter((resp, index) => {
    if (restOptions.allowSingleLetterMistake) {
      return isLessThanOneMistake(answer[index].trim(), resp.trim(), restOptions.ignoreCase);
    }
    if (restOptions.ignoreCase) {
      return isEqual(answer[index].trim().toLowerCase(), resp.trim().toLowerCase());
    }
    return isEqual(answer[index].trim(), resp.trim());
  }).length;

export const getClozeTextEvaluation = (response, answer, restOptions) =>
  response.map((resp, index) => {
    if (restOptions.allowSingleLetterMistake) {
      return isLessThanOneMistake(answer[index].trim(), resp.trim(), restOptions.ignoreCase);
    }
    if (restOptions.ignoreCase) {
      return isEqual(answer[index].trim().toLowerCase(), resp.trim().toLowerCase());
    }
    return isEqual(answer[index].trim(), resp.trim());
  });
