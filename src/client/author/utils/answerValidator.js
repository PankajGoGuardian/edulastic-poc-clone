import { questionType, math } from '@edulastic/constants'
import { isEmpty, keys, values as _values } from 'lodash'

const { methods } = math

const answerValidator = {
  generalValidator(answers) {
    const hasEmpty = answers.some(
      (answer) =>
        isEmpty(answer.value) ||
        isEmpty(answer.value.filter((x) => !isEmpty(x)))
    )
    return hasEmpty
  },
  [questionType.CHOICE_MATRIX](answers) {
    /**
     * all rows should not be empty
     * but, some rows can be empty
     * @see  https://snapwiz.atlassian.net/browse/EV-13694
     */
    const hasEmpty = answers.some((answer) => isEmpty(answer.value))
    // const hasEmpty = answers.some(answer => {
    //   const { value = [] } = answer;
    //   return isEmpty(value) || value.every(row => isEmpty(row));
    // });
    // return hasEmpty;
    return isEmpty(answers) || hasEmpty
  },
  [questionType.MULTIPLE_CHOICE](answers) {
    // able to save giving empty value as options from UI (fixed)
    const hasEmpty = this.generalValidator(answers)
    return hasEmpty
  },
  [questionType.CLOZE_TEXT](answers) {
    const hasEmpty = answers.some(
      (answer) =>
        isEmpty(answer.value) ||
        isEmpty(answer.value.filter((ans) => !isEmpty(ans.value)))
    )
    return hasEmpty
  },
  [questionType.CLOZE_IMAGE_TEXT](answers) {
    const hasEmpty = answers.some(
      (answer) =>
        isEmpty(answer.value) ||
        isEmpty(keys(answer.value).filter((id) => !isEmpty(answer.value[id])))
    )
    return hasEmpty
  },
  [questionType.CLOZE_DROP_DOWN](answers) {
    const hasEmpty = answers.some(
      (answer) =>
        isEmpty(answer.value) ||
        isEmpty(answer.value.filter((ans) => !isEmpty(ans.value)))
    )
    return hasEmpty
  },
  [questionType.CLOZE_IMAGE_DROP_DOWN](answers) {
    const hasEmpty = answers.some(
      (answer) =>
        isEmpty(answer.value) ||
        isEmpty(keys(answer.value).filter((id) => !isEmpty(answer.value[id])))
    )
    return hasEmpty
  },
  [questionType.CLOZE_DRAG_DROP](answers) {
    return this.generalValidator(answers)
  },
  [questionType.CLOZE_IMAGE_DRAG_DROP](answers) {
    const hasEmpty = answers.some(
      (answer) =>
        isEmpty(answer.value) ||
        isEmpty(
          answer.value.filter((ans) => !isEmpty(ans) && !isEmpty(ans.optionIds))
        )
    )
    return hasEmpty
  },
  [questionType.SORT_LIST](answers) {
    const hasEmpty = answers.some((answer) => isEmpty(answer.value))
    // needs update
    // able to delete all options and able to save
    return hasEmpty
  },
  [questionType.MATCH_LIST](answers) {
    const hasEmpty = answers.some(
      (ans) =>
        isEmpty(ans) || isEmpty(_values(ans.value).filter((a) => !isEmpty(a)))
    )
    return hasEmpty
  },
  [questionType.ORDER_LIST](answers) {
    const hasEmpty = this[questionType.SORT_LIST](answers)
    return hasEmpty
  },
  [questionType.CLASSIFICATION](answers) {
    const values = answers.map((ans) => ans.value)
    // all drop column area can not be empty at the same time.
    return (
      isEmpty(values) ||
      values.some((val) => isEmpty(_values(val).filter((x) => !isEmpty(x))))
    )
  },
  [questionType.SHADING](answers) {
    const hasEmpty = answers.some(
      (answer) =>
        isEmpty(answer.value) || answer.value.some((ans) => ans.length === 0)
    )
    return hasEmpty
  },
  [questionType.TOKEN_HIGHLIGHT](answers) {
    const hasEmpty = this[questionType.SORT_LIST](answers)
    return hasEmpty
  },
  [questionType.MATH](answers) {
    if (!answers.length) return true

    // check for empty answers
    // if validation method is equivSyntax answer will be empty
    const hasEmpty = answers.some((answer) => {
      if (Array.isArray(answer.value)) {
        return answer.value.some((ans) =>
          ans.method !== methods.EQUIV_SYNTAX
            ? isEmpty(ans) || isEmpty(ans.value)
            : false
        )
      }
      // check for empty string value
      return answer.method !== methods.EQUIV_SYNTAX ? !answer.value : false
    })
    return hasEmpty
  },
  [questionType.GRAPH](answers) {
    const hasEmpty = this[questionType.SORT_LIST](answers)
    return hasEmpty
  },
  [questionType.FRACTION_EDITOR](answers) {
    const hasEmpty = answers.some((answer) => answer.value === undefined)
    return hasEmpty
  },
  [questionType.EXPRESSION_MULTIPART](answers = []) {
    // on removing the responses it does not remove from the validation
    // math with unit we are able to save without providing unit
    // TODO: fix it in UI maybe
    const hasEmpty = answers.some((answer = {}) => {
      const textInputs = answer.textinput?.value || [] // get all the text inputs
      const dropdowns = answer.dropdown?.value || [] // get all the dropdown inputs
      const mathInputs = (answer.value || []).flatMap((input) => input) // get all the math inputs
      const mathUnitInputs = (answer.mathUnits?.value || []).filter(
        (_answer) => !isEmpty(_answer)
      )
      // get all the mathUnit inputs
      // combine text and dropdown as they can be validated together
      const textInputsAndDropdowns = [...textInputs, ...dropdowns]

      // check for empty answers
      // if validation method is equivSyntax answer will be empty
      const hasEmptyMathAnswers = isEmpty(
        mathInputs.filter((mathInput = {}) =>
          mathInput.method !== methods.EQUIV_SYNTAX
            ? !isEmpty(mathInput?.value)
            : true
        )
      )

      const hasEmptyMathUnitInputs = isEmpty(
        mathUnitInputs.filter((input = {}) =>
          input.method !== methods.EQUIV_SYNTAX ? !isEmpty(input?.value) : true
        )
      )

      const hasEmptyTextOrDropDown = isEmpty(
        textInputsAndDropdowns.filter((ans) => !isEmpty(ans.value))
      )
      return (
        hasEmptyTextOrDropDown && hasEmptyMathAnswers && hasEmptyMathUnitInputs
      )
    })
    return hasEmpty
  },
  [questionType.SHORT_TEXT](answers) {
    return this[questionType.SORT_LIST](answers)
  },
  [questionType.HOTSPOT](answers) {
    return this[questionType.SORT_LIST](answers)
  },
  [questionType.EDITING_TASK](answers) {
    // when there is no response box
    return answers.some(
      ({ value }) =>
        isEmpty(value) || isEmpty(_values(value).filter((v) => !isEmpty(v)))
    )
  },
}

// TODO create a list of all question types where validation is stored
// check the structure of validation for all such question types
// make the helper generic to support all such question types
export const hasEmptyAnswers = (item) => {
  if (questionType.manuallyGradableQn.includes(item.type)) return false
  const correctAnswers = [
    item?.validation?.validResponse,
    ...(item?.validation?.altResponses || []),
  ]

  const hasEmpty = answerValidator[item.type]?.(correctAnswers)
  return hasEmpty
}
