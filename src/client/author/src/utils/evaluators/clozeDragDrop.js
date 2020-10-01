const clozeDragDropEvaluation = ({
  userResponse,
  validation,
  hasGroupResponses,
}) => {
  const { validResponse, altResponses } = validation
  const result = {}
  userResponse.forEach((resp, index) => {
    const alternateResponses = altResponses.map((res) => res.value)
    if (hasGroupResponses) {
      result[index] =
        (validResponse.value[index].group === resp.group &&
          validResponse.value[index].data === resp.data) ||
        (alternateResponses[index] &&
          alternateResponses[index].group === resp.group &&
          alternateResponses[index].data === resp.data)
    } else {
      result[index] =
        validResponse.value[index] === resp ||
        alternateResponses[index] === resp
    }
  })
  return result
}

export default clozeDragDropEvaluation
