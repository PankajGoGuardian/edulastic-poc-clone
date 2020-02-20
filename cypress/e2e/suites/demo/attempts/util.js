import { attemptTypes } from "../../../framework/constants/questionTypes";

export function getResponseByAttempt(attempt, options, validResponse) {
  let ur;
  switch (attempt) {
    case attemptTypes.RIGHT:
      ur = validResponse;
      break;

    case attemptTypes.PARTIAL_CORRECT:
      ur =
        validResponse.length > 1 ? validResponse.slice(0, validResponse.length - 1) : validResponse;
      break;

    case attemptTypes.WRONG:
      ur = [options.filter(ch => !validResponse.includes(ch))[0]];
      break;

    default:
      break;
  }
  return ur;
}

export function generateAttemptData(testItems, atttemptType) {
  const attempt = {};
  testItems.forEach(({ itemId }) => {
    if (atttemptType === "ALL_CORRECT") {
      attempt[itemId] = attemptTypes.RIGHT;
    } else if (atttemptType === "ALL_INCORRECT") {
      attempt[itemId] = attemptTypes.WRONG;
    } else {
      attempt[itemId] = [
        attemptTypes.WRONG,
        attemptTypes.RIGHT,
        attemptTypes.SKIP,
        attemptTypes.RIGHT,
        attemptTypes.PARTIAL_CORRECT
      ][Math.floor(Math.random() * 5)];
    }
  });
  return attempt;
}
