import get from "lodash/get";

const evaluator = ({ validation = {}, userResponse = [] }) => {
  const evaluation = {};
  const maxScore = get(validation, "validResponse.score", 0);
  const correctLength = get(validation, "validResponse.value", -1);
  const userAttempted = userResponse.length;
  const score = userAttempted === correctLength ? maxScore : 0;
  userResponse.forEach(key => {
    evaluation[key] = score ? true : false;
  });
  return { evaluation, score, maxScore };
};

export default evaluator;
