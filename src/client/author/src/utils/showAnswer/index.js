import evaluators from '../evaluators'
import { replaceVariables } from '../../../../assessment/utils/variables'

const createShowAnswerResult = async (questions, answers, itemId = '') => {
  const questionIds = Object.keys(questions)
  const results = {}
  // for each question create evaluation obj
  for (const id of questionIds) {
    const evaluationId = `${itemId}_${id}`
    const question = questions[id]
    const evaluator = evaluators[question.type]
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

      const { evaluation } = await evaluator(
        { userResponse: answer, validation, questionId: id, template },
        question.type
      )
      results[evaluationId] = evaluation
    }
  }

  return results
}
export default createShowAnswerResult
