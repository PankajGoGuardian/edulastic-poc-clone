const evaluator = ({ validation = {}, userResponse = [] }) => {
  const evaluation = {};
  const maxScore = (validation.validResponse && validation.validResponse.score) || 1;
  const correctLength = (validation.validResponse && validation.validResponse.value) || -1;
  const userAttempted = userResponse.length;
  const score = userAttempted === correctLength ? maxScore : 0;
  userResponse.forEach(key => {
    evaluation[key] = score ? true : false;
  });
  return { evaluation, score, maxScore };
};

export default evaluator;
