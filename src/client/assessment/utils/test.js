import { keyBy as _keyBy, shuffle as _shuffle } from 'lodash'

const shuffleOptions = (questions = [], qActivitiesById = {}) => {
  const optionsOrder = {}

  const modifiedQuestions = questions.map((question) => {
    if (question.type === 'multipleChoice') {
      let { shuffledOptions } = qActivitiesById[question.id] || {}

      if (!shuffledOptions) {
        shuffledOptions = _shuffle(question.options.map((item) => item.value))
      }
      optionsOrder[question.id] = shuffledOptions
      const optionByValue = _keyBy(question.options, 'value')
      question.options = shuffledOptions.map((id) => optionByValue[id])
    }

    return question
  })

  return [modifiedQuestions, optionsOrder]
}

export const ShuffleChoices = (testItems, questionActivities) => {
  const qActivitiesById = _keyBy(questionActivities, 'qid')
  let shuffles = {}
  testItems.forEach((item) => {
    let optionsOrder
    ;[item.data.questions, optionsOrder] = shuffleOptions(
      item.data.questions,
      qActivitiesById
    )
    shuffles = {
      ...shuffles,
      ...optionsOrder,
    }
  })

  return [testItems, shuffles]
}

/**
 * input
 * questions: [
 * {
 *  ...restProps,
 *  hints: [{label: "", value: ""}]
 * },
 * {
 *  ...restProps,
 *  hints: [{label: "", value: ""}]
 * }
 * ]
 *
 * output: a number >= 0
 *
 * logic:
 * for all questions, check if there are hints
 * for all hints check if the label is not empty
 * empty label is possible when a user entered something in the hint and then cleared it (obj is not removed)
 *
 * a number > 0 would indicate the current item has hints which have non empty label
 */

//  TODO :  need to remove the object if the hint is cleared

export const showHintButton = (questions) =>
  questions.reduce((acc, question) => {
    if (question.hints) {
      // handling cases when hints are undefined
      acc += question.hints.filter((hint) => hint.label.length > 0).length
    }
    return acc
  }, 0)
