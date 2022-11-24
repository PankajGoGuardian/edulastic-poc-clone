import * as questionTypes from '@edulastic/constants/const/questionType'
import evaluator from '../evaluators'
import { replaceVariables } from '../../../../assessment/utils/variables'
import { getClozeMathUnits, getMathUnits } from '../evalution'

const createShowAnswerResult = async (questions, answers, itemId = '') => {
  const questionIds = Object.keys(questions)
  const results = {}
  // for each question create evaluation obj
  for (const id of questionIds) {
    const evaluationId = `${itemId}_${id}`
    const question = questions[id]
    let answer = answers[evaluationId]
    if (evaluator && question && answer) {
      const { isUnits, isMath, showDropdown } = question
      if (isUnits && isMath && showDropdown) {
        const expression = answer.expression || ''
        const unit = answer.unit ? answer.unit : ''
        if (expression.search('=') === -1) {
          answer = expression + unit
        } else {
          answer = expression.replace(/=/gm, `${unit}=`)
        }
      }
      const { validation, template } = replaceVariables(question, [], false)
      const payload = {
        userResponse: answer,
        validation,
        questionId: id,
        template,
      }

      if (question.isUnits && question.isMath) {
        payload.isUnitAllowedUnits = getMathUnits(question)
      } else if (question.type === questionTypes.EXPRESSION_MULTIPART) {
        payload.isUnitAllowedUnits = getClozeMathUnits(question)
      }

      const { evaluation } = await evaluator(payload, question.type)
      results[evaluationId] = evaluation
    }
  }

  return results
}
export default createShowAnswerResult
