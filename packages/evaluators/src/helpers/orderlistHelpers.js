import { keys, isEqual } from "lodash";

export const getOrderlistMatchs = (response, answer) =>
  keys(response)
    .map(key => isEqual(response[key], answer[key]))
    .filter(t => t).length;

export const getOrderlitEvaluation = (response, answers, rightIndex = 0) => {
  const answer = answers[rightIndex];
  if (!answer) {
    return {};
  }
  const { value } = answer;
  const evaluation = {};
  keys(response).forEach(id => {
    evaluation[id] = isEqual(response[id], value[id]);
  });
  return evaluation;
};
