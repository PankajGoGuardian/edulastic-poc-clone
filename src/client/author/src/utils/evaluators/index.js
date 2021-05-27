import { questionType } from '@edulastic/constants'
import { evaluateApi } from '@edulastic/api'

const evaluator = async (data, type) => {
  // getting evaluation from backend (EV-7432)
  if (type === questionType.GRAPH) {
    const validationObj = data?.validation || {}
    const correctAnswers = validationObj?.validResponse?.value || []
    const alternateAnswers = (validationObj?.altResponses || []).map(
      (altResponse) => altResponse.value
    )
    const allAnswers = [correctAnswers, ...alternateAnswers].filter(
      (i) => i.length
    )
    const { points, latex } = validationObj

    if (allAnswers.length === 0 && !points && !latex) {
      const error = new Error()
      error.message = 'Questions should have answers set'
      throw error
    }
  }
  const result = await evaluateApi.evaluate(data, type)

  return result
}

export default evaluator
