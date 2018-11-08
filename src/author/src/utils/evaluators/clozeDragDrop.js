const clozeDragDropEvaluation = ({ userResponse, validation }) => {
  const { valid_response, alt_responses } = validation;
  const result = {};
  userResponse.forEach((resp, index) => {
    const altResponses = alt_responses.map(res => res.value);
    result[index] = valid_response.value[index] === resp || altResponses[index] === resp;
  });
  console.log('clozedragdrop check answer result:', result);
  return result;
};

export default clozeDragDropEvaluation;
