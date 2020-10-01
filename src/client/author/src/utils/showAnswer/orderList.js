const createEvaluation = ({ validation }, answer = []) => {
  const correct = validation.validResponse.value
  const result = {}
  answer.forEach((resp, index) => {
    result[resp] = correct[index] === resp
  })
  return result
}

export default createEvaluation
