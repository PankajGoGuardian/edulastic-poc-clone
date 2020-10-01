const mcqEvaluation = ({ userResponse, validation }) => {
  const { validResponse, altResponses } = validation
  const result = {}
  userResponse.forEach((resp) => {
    const alternateResponses = altResponses.map((res) => res.value)
    result[resp] = !![...validResponse.value, ...alternateResponses].includes(
      resp
    )
  })

  return result
}

export default mcqEvaluation
