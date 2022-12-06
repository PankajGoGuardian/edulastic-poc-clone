import { questionType, question, customTags, math } from '@edulastic/constants'
import { get, isString, isEmpty, keys, keyBy, isNil, isNaN } from 'lodash'
import striptags from 'striptags'
import { templateHasImage, notification } from '@edulastic/common'
import { displayStyles } from '../assessment/widgets/ClozeEditingTask/constants'
import { hasEmptyAnswers } from './utils/answerValidator'

const {
  EXPRESSION_MULTIPART,
  CLOZE_DRAG_DROP,
  CLOZE_DROP_DOWN,
  CLOZE_TEXT,
  CLOZE_IMAGE_DRAG_DROP,
  CLOZE_IMAGE_DROP_DOWN,
  CLOZE_IMAGE_TEXT,
  MULTIPLE_CHOICE,
  VIDEO,
  TEXT,
  PASSAGE,
  EDITING_TASK,
  MATH,
  LIKERT_SCALE,
} = questionType

const { methods } = math

export const isRichTextFieldEmpty = (text) => {
  if (!text) {
    return true
  }
  if (templateHasImage(text)) {
    return false
  }

  if (customTags.some((tag) => text.includes(tag))) {
    return false
  }

  if (text.includes(`<span class="input__math"`)) {
    return false
  }

  /**
   * if the option only has video, do not strip the video or iframe tags
   * otherwise, after stripping it considers it as empty
   * @see https://snapwiz.atlassian.net/browse/EV-16093
   */
  let _text = striptags(text, ['iframe', 'video'])
  _text = _text.replace(/&nbsp;/g, ' ')
  if (!_text || (_text && !_text.trim())) {
    return true
  }
  return false
}

export const isMathTextFieldEmpty = (text) => {
  if (!text) {
    return true
  }

  const _text = text.replace(/\\/g, '')
  if (!_text || (_text && !_text.trim())) {
    return true
  }
  return false
}

/**
 * check for options in "expressionMultipart" type.
 * @param {Object} item
 */
const expressionMultipartOptionsCheck = (item) => {
  // check options for dropdowns.
  const optionsCount = get(item, ['responseIds', 'dropDowns', 'length'], 0)

  // make sure that each dropDown has its own options.
  if (optionsCount !== Object.keys(item.options).length) return true

  // make sure that each option in every option set is not empty
  const options = Object.values(item.options)
  for (const opt of options) {
    if (!opt.length) {
      return true
    }
    const hasEmptyOptions = opt.some((_opt) => !_opt || (_opt && !_opt.trim()))
    if (hasEmptyOptions) return true
  }

  const validResponse = item?.validation?.validResponse
  if (validResponse) {
    // dropdown = dropDowns, mathUnits = mathUnits, textinput = inputs, value = maths
    const { dropdown, mathUnits, textinput, value } = validResponse

    if (dropdown && dropdown.value) {
      for (const opt of dropdown.value) {
        if (!opt.value || (opt.value && !opt.value.trim())) {
          return true
        }
      }
    }
    if (mathUnits && mathUnits.value) {
      for (const opt of mathUnits.value) {
        if (isMathTextFieldEmpty(opt.value) || !opt.options.unit) {
          return true
        }
      }
    }
    if (textinput && textinput.value) {
      for (const opt of textinput.value) {
        if (!opt.value || (opt.value && !opt.value.trim())) {
          return true
        }
      }
    }
    if (value && value.length) {
      for (const opt of value) {
        for (const _opt of opt) {
          if (isMathTextFieldEmpty(_opt.value)) {
            return true
          }
        }
      }
    }
  }

  return false
}

/**
 * options check for "clozeDropDown" type
 * @param {Object} item
 */
const clozeDropDownOptionsCheck = (item) => {
  const responses = get(item, 'responseIds', [])
  for (const res of responses) {
    const opts = item.options[res.id] || []
    if (!opts.length) {
      return true
    }
    const hasEmptyOptions = opts.some((opt) => !opt)
    if (hasEmptyOptions) return true
  }

  return false
}

/**
 * deafult optsions check
 * @param {Object} item
 */
const multipleChoiceOptionsCheck = ({ options = [] }) => {
  // there should be atleast 1 option.
  if (options.length === 0) return true

  // item should have a label, and label should not be empty
  return options.some(
    (opt) =>
      (opt.label !== undefined && isRichTextFieldEmpty(opt.label)) ||
      (isString(opt) && isRichTextFieldEmpty(opt))
  )
}

const videoCheck = (item) => {
  if (!item.sourceURL || (item.sourceURL && !item.sourceURL.trim())) {
    return 'Source URL should not be empty'
  }
  if (!item.heading || (item.heading && !item.heading.trim())) {
    return 'Heading should not be empty'
  }
  if (!item.summary || (item.summary && !item.summary.trim())) {
    return 'Summary should not be empty'
  }
  return false
}

const textCheck = (item) => {
  if (isRichTextFieldEmpty(item.content)) {
    return 'Content should not be empty'
  }
  return false
}

const passageCheck = (i) => {
  if (isRichTextFieldEmpty(i.heading)) {
    return 'Heading cannot be empty.'
  }
  if (isRichTextFieldEmpty(i.contentsTitle)) {
    return 'Title cannot be empty.'
  }
  if (isRichTextFieldEmpty(i.content) && !i.paginated_content) {
    return 'Passage cannot be empty.'
  }
  if (i.paginated_content) {
    for (const o of i.pages) {
      if (isRichTextFieldEmpty(o)) {
        return 'Passage cannot be empty.'
      }
    }
  }
}

const editingTaskOptionsCheck = ({
  displayStyle: { type = '', value = '' } = {},
  options = {},
}) => {
  // Don't need to check options for input type display
  if (type === displayStyles.TEXT_INPUT || value === displayStyles.TEXT_INPUT)
    return false

  const valueSet = Object.values(options)

  if (!valueSet.length) return true

  // for other display type we need to check option's values
  return valueSet.some((_value) =>
    typeof _value === 'string' ? !_value.trim() : isEmpty(_value)
  )
}

const hasEmptyOptions = (item) => {
  // options check for expression multipart type question.
  switch (item.type) {
    case EXPRESSION_MULTIPART:
      return expressionMultipartOptionsCheck(item)
    case CLOZE_DROP_DOWN:
      return clozeDropDownOptionsCheck(item)
    case MULTIPLE_CHOICE:
    case LIKERT_SCALE:
      return multipleChoiceOptionsCheck(item)
    case EDITING_TASK:
      return editingTaskOptionsCheck(item)
    default:
      return false
  }
}

const hasEmptyFields = (item) => {
  switch (item.type) {
    case VIDEO:
      return videoCheck(item)
    case TEXT:
      return textCheck(item)
    case PASSAGE:
      return passageCheck(item)
    default:
      return false
  }
}

const emptyFieldsValidator = {
  [questionType.CLOZE_IMAGE_DROP_DOWN](item) {
    const { options = [] } = item
    if (!options.length) {
      return [true, 'Options cannot be empty']
    }
    const hasEmpty = options.some(
      (option) =>
        !option.length || option.some((val) => isRichTextFieldEmpty(val))
    )
    if (hasEmpty) {
      return [true, 'Options have empty values']
    }
    return [false, '']
  },
  [questionType.CLOZE_IMAGE_DRAG_DROP](item) {
    const { options = [] } = item

    if (!options.length) {
      return [true, `options cannot be empty`]
    }
    const hasEmptyOption = options.some((k) => isRichTextFieldEmpty(k.value))
    if (hasEmptyOption) {
      return [true, `options cannot have empty values`]
    }
    return [false, '']
  },
  [questionType.SORT_LIST](item) {
    const { source = [] } = item
    if (!source.length) {
      return [true, 'List cannot be empty']
    }
    const _hasEmptyFields = source.some((option) =>
      isRichTextFieldEmpty(option)
    )
    if (_hasEmptyFields) {
      return [true, 'List has empty values']
    }
    return [false, '']
  },
  [questionType.MATCH_LIST](item) {
    const {
      list = [],
      possibleResponses = [],
      groupPossibleResponses = false,
      possibleResponseGroups = [],
    } = item

    if (!list.length) {
      return [true, 'List cannot be empty']
    }
    if (!groupPossibleResponses && !possibleResponses.length) {
      return [true, 'Possible responses cannot be empty']
    }
    if (groupPossibleResponses && !possibleResponseGroups.length) {
      return [true, 'Response Groups cannot be empty']
    }
    const hasEmptyListField = list.some((option) =>
      isRichTextFieldEmpty(option.label)
    )
    if (hasEmptyListField) {
      return [true, 'List has empty values']
    }
    if (!groupPossibleResponses) {
      const hasEmptyResponses = possibleResponses.some((resp) =>
        isRichTextFieldEmpty(resp.label)
      )
      if (hasEmptyResponses) {
        return [true, 'Response fields cannot be empty']
      }
    }
    if (groupPossibleResponses) {
      const hasEmptyResponses = possibleResponseGroups.some((group) => {
        const { responses = [] } = group
        if (!responses.length) {
          return true
        }
        return responses.some((resp) => isRichTextFieldEmpty(resp.label))
      })
      if (hasEmptyResponses) {
        return [true, 'Responses cannot be empty']
      }
    }
    return [false, '']
  },
  [questionType.CLASSIFICATION](item) {
    const { possibleResponses = [] } = item
    const hasEmpty = possibleResponses.some((resp) => {
      const { value = '' } = resp
      return isRichTextFieldEmpty(value)
    })
    if (hasEmpty) {
      return [true, 'responses cannot be empty']
    }
    return [false, '']
  },
  [questionType.ORDER_LIST](item) {
    const { list } = item
    const hasEmpty = keys(list).some((id) => isRichTextFieldEmpty(list[id]))
    if (hasEmpty) {
      return [true, 'List items cannot have empty values']
    }
    return [false, '']
  },
}

const itemHasIncompleteFields = (item) => {
  if (emptyFieldsValidator[item.type]) {
    return emptyFieldsValidator[item.type](item)
  }
  return [false]
}

/**
 *
 * @param {*} numberOfEmptyAnswers
 * @param {*} currentIndex position of empty answer
 */
const clozeDropDownEmptyAnsMessage = (
  numberOfEmptyAnswers = 0,
  currentIndex = undefined
) => {
  if (numberOfEmptyAnswers > 1) {
    return 'Correct/Alternate Answer(s) for the question cannot be empty'
  }
  return `Correct/Alternate Answer for Text Dropdown ${
    currentIndex !== undefined ? currentIndex + 1 : ''
  } cannot be empty`
}

const emptyCorrectAnswerErrMsg = {
  [questionType.CLOZE_DROP_DOWN](answers) {
    const emptyResponses = []
    answers?.forEach(({ value = [] }) => {
      value.forEach((ans, index) => {
        if (isEmpty(ans.value)) {
          emptyResponses.push(index)
        }
      })
    })

    return clozeDropDownEmptyAnsMessage(
      emptyResponses.length,
      emptyResponses[emptyResponses.length - 1]
    )
  },
}

const showEmptyAnswerNotification = (item = {}) => {
  const { validResponse = {}, altResponses = [] } = item?.validation || {}
  const answers = [validResponse, ...altResponses]

  const hasEmpty = answers.some((answer = {}) => {
    const textInputs = answer.textinput?.value || []
    const dropdowns = answer.dropdown?.value || []
    const mathInputs = (answer.value || []).flatMap((input) => input)
    const mathUnitInputs = (answer.mathUnits?.value || []).filter(
      (_answer) => !isEmpty(_answer)
    )
    const textInputsAndDropdowns = [...textInputs, ...dropdowns]

    if (!isEmpty(answer.value)) {
      const hasEmptyMathAnswers = mathInputs.some((mathInput = {}) =>
        mathInput.method !== methods.EQUIV_SYNTAX
          ? isEmpty(mathInput?.value)
          : false
      )
      if (hasEmptyMathAnswers) {
        return true
      }
    }

    if (!isEmpty(answer.mathUnits?.value || [])) {
      const hasEmptyMathUnitInputs = mathUnitInputs.some((input = {}) =>
        input.method !== methods.EQUIV_SYNTAX ? isEmpty(input?.value) : false
      )
      if (hasEmptyMathUnitInputs) {
        return true
      }
    }

    if (!isEmpty(textInputs) || !isEmpty(dropdowns)) {
      const hasEmptyTextOrDropDown = textInputsAndDropdowns.some((ans) =>
        isEmpty(ans.value)
      )
      if (hasEmptyTextOrDropDown) {
        return true
      }
    }

    return false
  })

  return hasEmpty
}

export const validateScore = (
  item,
  itemLevelScoring = false,
  multipartItem = false,
  itemId = '',
  qIndex = undefined
) => {
  const { score } = item?.validation?.validResponse || {}
  const { unscored = false } = item?.validation || {}
  /**
   * In case of multipart item and itemLevelScoring true, all questions except the first have score 0
   * Thus zero score check should not be done for questions with index > 0
   * itemLevelScoring for all items is by default true, thus multipart check is mandatory
   * If itemId is new there are no questions in the item yet and all the score checks should be done for such item
   */
  if (
    multipartItem === true &&
    itemLevelScoring === true &&
    itemId !== 'new' &&
    !isNil(qIndex) &&
    qIndex > 0
  ) {
    if (isNil(score) || isNaN(score)) {
      return [true, 'Score needs to be set']
    }
  } else {
    if (isNil(score) || isNaN(score)) {
      return [true, 'Score needs to be set']
    }
    if (!unscored && parseFloat(score, 10) === 0) {
      return [true, 'Score cannot be zero']
    }
  }
  return [false, '']
}

/**
 * does question have enough data !?
 *  This is only the begnning. This func is going to grow to handle
 *  the idiosyncraices of  multiple questions types.
 *  @param {Object} item - the question item.
 *  @returns {Array} - returns a tuple containing a boolean, which flags
 *  a question as complete or incomplete, and if incomplete, teh reason is the second element
 */
export const isIncompleteQuestion = (
  item,
  itemLevelScoring = false,
  multipartItem = false,
  itemId = '',
  qIndex = undefined
) => {
  // if its a resource type question just return.
  if (isEmpty(item)) {
    return [true, 'Question content should not be empty']
  }
  if (question.resourceTypeQuestions.includes(item.type)) {
    const _hasEmptyFields = hasEmptyFields(item)
    if (_hasEmptyFields) return [true, _hasEmptyFields]
    return [false]
  }

  const [hasIncompleteFields, errorMessage] = itemHasIncompleteFields(item)
  if (hasIncompleteFields) {
    return [true, errorMessage]
  }

  // item doesnt have a stimulus?
  if (isRichTextFieldEmpty(item.stimulus)) {
    return [true, 'Question text should not be empty']
  }

  // if  empty options are present
  if (item.options && hasEmptyOptions(item)) {
    return [true, 'Answer choices should not be empty']
  }

  if (!questionType.questionTypeWithoutCorrectAnswer.includes(item.type)) {
    const isScoreValid = validateScore(
      item,
      multipartItem,
      itemLevelScoring,
      itemId,
      qIndex
    )
    if (isScoreValid[0]) {
      return isScoreValid
    }
  }

  if (!questionType.manuallyGradableQn.includes(item.type)) {
    const questionHasEmptyAnswers = hasEmptyAnswers(item)
    if (questionHasEmptyAnswers) {
      let defaultErrorMessage = 'Correct/Alternate answers should be set'
      const getEmptyCorrectAnswerErrMsg = emptyCorrectAnswerErrMsg[item.type]
      if (typeof getEmptyCorrectAnswerErrMsg === 'function') {
        const correctAnswers = [
          item?.validation?.validResponse,
          ...(item?.validation?.altResponses || []),
        ]
        defaultErrorMessage = getEmptyCorrectAnswerErrMsg(correctAnswers)
      }
      if (item?.type === questionType.GRAPH) {
        const { points, latex } = item?.validation?.validResponse?.options || {}
        if ((points || latex) && (!points || !latex)) {
          defaultErrorMessage =
            'Set both inputs for points on equation under evaluation settings'
        }
      }
      return [true, defaultErrorMessage] // [true, msg]
    }
  }

  if (item.variable?.enabled && item.rdv) {
    return [true, 'Generate dynamic variables to apply evaluation settings']
  }

  if (
    item?.type === EXPRESSION_MULTIPART &&
    showEmptyAnswerNotification(item)
  ) {
    notification({
      type: 'warn',
      msg: 'Saving with an empty correct/alternate answer.',
    })
  }

  // if not yet returned with an error, then it should be a fine question!

  return [false]
}

/**
 * Checks if the question has improper dynamic parameter config
 * - if there are no dynamic variables in the stimulus, but option is selected
 * - if there are dynamic variables in the stimulus, but option is checked
 *
 * in that case show appropriate warning messages
 *
 * @param {Object} item the question item
 * @returns {Array}
 * basically a tuple, with first argument as bool indicating if question has improper config
 * and second as string for warning message in case the question has improper config
 */
export const hasImproperDynamicParamsConfig = (item) => {
  if (item.variable) {
    const hasDyanmicVariables =
      Object.keys(item.variable?.variables || {}).length > 0
    const optionEnabled = item.variable?.enabled || false
    if (optionEnabled && !hasDyanmicVariables)
      return [true, 'No dynamic variable used in authoring', true]
    if (hasDyanmicVariables && !optionEnabled)
      return [true, 'Dynamic variables option not selected', false]
  }
  return [false]
}

const compareResponseIds = (oldQuestionResponses, newQuestionResponses) => {
  const oldQuestionResponseIds = oldQuestionResponses.map(
    (responseBox) => responseBox?.id
  )
  const newQuestionResponseIds = newQuestionResponses.map(
    (responseBox) => responseBox?.id
  )
  if (
    !oldQuestionResponseIds.every((id) => newQuestionResponseIds.includes(id))
  ) {
    return true
  }
  return false
}

const compareOptionsByIds = (oldQuestionOptions, newQuestionOptions) => {
  const oldQuestionOptionIds = keys(oldQuestionOptions) || []
  for (const id of oldQuestionOptionIds) {
    if (oldQuestionOptions[id]?.length > newQuestionOptions?.[id]?.length) {
      return true
    }
  }
  return false
}

export const isOptionsRemoved = (originalQuestions, newQuestions) => {
  const oldQuestionsById = keyBy(originalQuestions, 'id')
  for (const _question of newQuestions) {
    const { id, options, type } = _question
    if (oldQuestionsById[id]) {
      switch (type) {
        case MULTIPLE_CHOICE: {
          const oldOptionValues =
            oldQuestionsById[id]?.options?.map((opt) => opt.value) || []
          const newOptionsByValue = keyBy(options, 'value')
          if (!oldOptionValues.every((value) => newOptionsByValue[value])) {
            return true
          }
          break
        }
        case EXPRESSION_MULTIPART: {
          const { responseIds = {} } = _question || {}
          const oldOptions = oldQuestionsById[id]?.options || {}
          const oldOptionsIds = keys(oldOptions) || []
          for (const _id of oldOptionsIds) {
            if (
              !oldOptions[_id].every((value) =>
                (options?.[_id] || []).includes(value)
              )
            ) {
              return true
            }
          }

          const oldQuestionResponseIds = oldQuestionsById[id]?.responseIds || {}
          const oldQuestionResponseBoxes = keys(oldQuestionResponseIds) || []
          for (const responseBox of oldQuestionResponseBoxes) {
            const oldQuestionResponseBoxIds = (
              oldQuestionResponseIds[responseBox] || []
            ).map(({ id: _id }) => _id)
            const newQuestionResponseBoxIds = (
              responseIds?.[responseBox] || []
            ).map(({ id: _id }) => _id)
            if (
              !oldQuestionResponseBoxIds.every((_id) =>
                newQuestionResponseBoxIds.includes(_id)
              )
            ) {
              return true
            }
          }
          break
        }
        case CLOZE_DRAG_DROP: {
          const { responseIds = [] } = _question || {}
          const { hasGroupResponses = false, groupResponses = [] } =
            _question || {}
          let oldOptions = []
          let newOptions = []

          if (oldQuestionsById[id]?.hasGroupResponses) {
            ;(oldQuestionsById[id]?.groupResponses || []).forEach(
              (response) => {
                oldOptions = oldOptions.concat(response?.options || [])
              }
            )
          } else {
            oldOptions = oldOptions.concat(oldQuestionsById[id]?.options || [])
          }
          const oldQuestionOptionIds = oldOptions.map((option) => option?.value)

          if (hasGroupResponses) {
            groupResponses.forEach((response) => {
              newOptions = newOptions.concat(response?.options || [])
            })
          } else {
            newOptions = newOptions.concat(options || [])
          }
          const newQuestionOptionIds = newOptions.map((option) => option?.value)

          if (
            !oldQuestionOptionIds.every((_id) =>
              newQuestionOptionIds.includes(_id)
            )
          ) {
            return true
          }

          if (
            compareResponseIds(
              oldQuestionsById[id]?.responseIds || [],
              responseIds
            )
          ) {
            return true
          }

          break
        }
        case EDITING_TASK:
        case CLOZE_DROP_DOWN: {
          const { responseIds = [] } = _question || {}
          if (
            compareResponseIds(
              oldQuestionsById[id]?.responseIds || [],
              responseIds
            )
          ) {
            return true
          }

          if (
            compareOptionsByIds(
              oldQuestionsById[id]?.options || {},
              options || {}
            )
          ) {
            return true
          }

          break
        }
        case CLOZE_TEXT: {
          const { responseIds = [] } = _question || {}
          if (
            compareResponseIds(
              oldQuestionsById[id]?.responseIds || [],
              responseIds
            )
          ) {
            return true
          }

          break
        }
        case CLOZE_IMAGE_DRAG_DROP: {
          const { responses = [] } = _question || {}
          if (
            compareResponseIds(oldQuestionsById[id]?.responses || [], responses)
          ) {
            return true
          }

          const oldQuestionOptionIds = (
            oldQuestionsById[id]?.options || []
          ).map((option) => option?.id)
          const newQuestionOptionIds = (options || []).map(
            (option) => option?.id
          )
          if (
            !oldQuestionOptionIds.every((_id) =>
              newQuestionOptionIds.includes(_id)
            )
          ) {
            return true
          }

          break
        }
        case CLOZE_IMAGE_DROP_DOWN: {
          const { responses = [] } = _question || {}
          if (
            compareResponseIds(oldQuestionsById[id]?.responses || [], responses)
          ) {
            return true
          }

          const oldQuestionOptions = oldQuestionsById[id]?.options || []
          for (const [index, oldOptions] of oldQuestionOptions.entries()) {
            if (
              !oldOptions.every((opt) => (options[index] || []).includes(opt))
            ) {
              return true
            }
          }

          break
        }
        case CLOZE_IMAGE_TEXT: {
          const { responses = [] } = _question || {}
          if (
            compareResponseIds(oldQuestionsById[id]?.responses || [], responses)
          ) {
            return true
          }

          break
        }
        default:
          break
      }
    }
  }
  return false
}

const validateUserResponse = (answer) => {
  if (!isEmpty(answer)) {
    let isValid = false
    const dropDowns = answer.dropDowns
    const inputs = answer.inputs
    const mathUnits = answer.mathUnits
    const mathInputs = answer.maths

    if (dropDowns || inputs || mathInputs) {
      isValid = true
    } else if (mathUnits) {
      isValid = Object.keys(mathUnits).some(
        (responseId) =>
          mathUnits[responseId]?.value && mathUnits[responseId]?.unit
      )
    }
    return isValid
  }
  return false
}

export const hasValidResponse = (userResponse, questions) => {
  if (!isEmpty(userResponse) && !isEmpty(questions)) {
    const qids = Object.keys(userResponse) || []
    return qids.some((qid) => {
      const qType = questions[qid]?.type
      const answer = userResponse[qid]
      const { isMath = false, isUnits = false, showDropdown = false } =
        questions[qid] || {}
      if (qType === EXPRESSION_MULTIPART) {
        return validateUserResponse(answer)
        // eslint-disable-next-line no-else-return
      } else if (qType === MATH && isMath && isUnits && showDropdown) {
        return answer?.expression && answer?.unit
      }
      return !isEmpty(answer)
    })
  }
  return false
}

export const getQuestionIndexFromItemData = (qId, item) => {
  if (!isNil(qId) && !isEmpty(item)) {
    const { data: { questions = [] } = {} } = item || {}
    for (const [qIndex, questionData] of questions.entries()) {
      if (qId === questionData?.id) {
        return qIndex
      }
    }
  }
  return undefined
}
