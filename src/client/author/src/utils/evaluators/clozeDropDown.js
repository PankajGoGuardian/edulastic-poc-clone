const clozeDropDownEvaluation = ({ userResponse, validation }) => {
  const { validResponse, altResponses } = validation
  const result = {}
  const alternateResponses = altResponses.map((res) => res.value)
  alternateResponses.push(validResponse.value)
  userResponse.forEach((resp, index) => {
    result[index] =
      alternateResponses.filter((item) => item[index] === resp).length > 0
  })
  return result
}

export default clozeDropDownEvaluation
