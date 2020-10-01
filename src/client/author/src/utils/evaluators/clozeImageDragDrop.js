import { isEqual } from 'lodash'

const clozeImageDragDropEvaluation = ({ userResponse, validation }) => {
  const { validResponse, altResponses } = validation
  const alternateResponses = altResponses.map((res) => res.value)
  alternateResponses.push(validResponse.value)
  const evaluation = userResponse.map((userResp, index) => {
    for (let i = 0; i < alternateResponses.length; i++) {
      if (isEqual(userResp, alternateResponses[i][index])) {
        return true
      }
    }
    return false
  })
  return evaluation
}

export default clozeImageDragDropEvaluation
