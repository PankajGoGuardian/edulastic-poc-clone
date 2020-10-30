import { questionType, question, customTags } from '@edulastic/constants'
import { get, isString, isEmpty, keys } from 'lodash'
import striptags from 'striptags'
import { templateHasImage } from '@edulastic/common'
import { displayStyles } from '../assessment/widgets/ClozeEditingTask/constants'
import { hasEmptyAnswers } from './utils/answerValidator'

const {
  EXPRESSION_MULTIPART,
  CLOZE_DROP_DOWN,
  MULTIPLE_CHOICE,
  VIDEO,
  TEXT,
  PASSAGE,
  EDITING_TASK,
} = questionType

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
/**
 * does question have enough data !?
 *  This is only the begnning. This func is going to grow to handle
 *  the idiosyncraices of  multiple questions types.
 *  @param {Object} item - the question item.
 *  @returns {Array} - returns a tuple containing a boolean, which flags
 *  a question as complete or incomplete, and if incomplete, teh reason is the second element
 */
export const isIncompleteQuestion = (item, itemLevelScoring = false) => {
  // if its a resource type question just return.
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
    return [true, 'Correct answer for answer choice cannot be empty']
  }
  // if not yet returned with an error, then it should be a fine question!

  if (!questionType.manuallyGradableQn.includes(item.type)) {
    const { score } = item?.validation?.validResponse || {}

    // when item level scoring is on score is removed from the validation object
    // so we should not validate question level score
    const validateQuestionScore = itemLevelScoring === false
    if (validateQuestionScore) {
      if (score === undefined) {
        return [true, 'Score needs to be set']
      }
      if (parseFloat(score, 10) === 0) {
        return [true, 'Score cannot be zero']
      }
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
      return [true, defaultErrorMessage] // [true, msg]
    }
  }

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
