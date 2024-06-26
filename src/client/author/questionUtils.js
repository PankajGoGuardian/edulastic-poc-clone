import { questionType, question, customTags, math } from "@edulastic/constants";
import { get, isString, isEmpty, keys } from "lodash";
import striptags from "striptags";
import { templateHasImage } from "@edulastic/common";
import { displayStyles } from "../assessment/widgets/ClozeEditingTask/constants";

const { EXPRESSION_MULTIPART, CLOZE_DROP_DOWN, MULTIPLE_CHOICE, VIDEO, TEXT, PASSAGE, EDITING_TASK } = questionType;
const { methods } = math;

export const isRichTextFieldEmpty = text => {
  if (!text) {
    return true;
  }
  if (templateHasImage(text)) {
    return false;
  }

  if (customTags.some(tag => text.includes(tag))) {
    return false;
  }

  if (text.includes(`<span class="input__math"`)) {
    return false;
  }

  /**
   * if the option only has video, do not strip the video or iframe tags
   * otherwise, after stripping it considers it as empty
   * @see https://snapwiz.atlassian.net/browse/EV-16093
   */
  let _text = striptags(text, ["iframe", "video"]);
  _text = _text.replace(/&nbsp;/g, " ");
  if (!_text || (_text && !_text.trim())) {
    return true;
  }
  return false;
};

export const isMathTextFieldEmpty = text => {
  if (!text) {
    return true;
  }

  const _text = text.replace(/\\/g, "");
  if (!_text || (_text && !_text.trim())) {
    return true;
  }
  return false;
};

/**
 * check for options in "expressionMultipart" type.
 * @param {Object} item
 */
const expressionMultipartOptionsCheck = item => {
  // check options for dropdowns.
  const optionsCount = get(item, ["responseIds", "dropDowns", "length"], 0);

  // make sure that each dropDown has its own options.
  if (optionsCount !== Object.keys(item.options).length) return true;

  // make sure that each option in every option set is not empty
  const options = Object.values(item.options);
  for (const opt of options) {
    if (!opt.length) {
      return true;
    }
    const hasEmptyOptions = opt.some(_opt => !_opt || (_opt && !_opt.trim()));
    if (hasEmptyOptions) return true;
  }

  const validResponse = item?.validation?.validResponse;
  if (validResponse) {
    // dropdown = dropDowns, mathUnits = mathUnits, textinput = inputs, value = maths
    const { dropdown, mathUnits, textinput, value } = validResponse;

    if (dropdown && dropdown.value) {
      for (const opt of dropdown.value) {
        if (!opt.value || (opt.value && !opt.value.trim())) {
          return true;
        }
      }
    }
    if (mathUnits && mathUnits.value) {
      for (const opt of mathUnits.value) {
        if (isMathTextFieldEmpty(opt.value) || !opt.options.unit) {
          return true;
        }
      }
    }
    if (textinput && textinput.value) {
      for (const opt of textinput.value) {
        if (!opt.value || (opt.value && !opt.value.trim())) {
          return true;
        }
      }
    }
    if (value && value.length) {
      for (const opt of value) {
        for (const _opt of opt) {
          if (isMathTextFieldEmpty(_opt.value)) {
            return true;
          }
        }
      }
    }
  }

  return false;
};

/**
 * options check for "clozeDropDown" type
 * @param {Object} item
 */
const clozeDropDownOptionsCheck = item => {
  const responses = get(item, "responseIds", []);
  for (const res of responses) {
    const opts = item.options[res.id] || [];
    if (!opts.length) {
      return true;
    }
    const hasEmptyOptions = opts.some(opt => !opt);
    if (hasEmptyOptions) return true;
  }

  return false;
};

/**
 * deafult optsions check
 * @param {Object} item
 */
const multipleChoiceOptionsCheck = ({ options = [] }) => {
  // there should be atleast 1 option.
  if (options.length === 0) return true;

  // item should have a label, and label should not be empty
  return options.some(
    opt => (opt.label !== undefined && isRichTextFieldEmpty(opt.label)) || (isString(opt) && isRichTextFieldEmpty(opt))
  );
};

const videoCheck = item => {
  if (!item.sourceURL || (item.sourceURL && !item.sourceURL.trim())) {
    return "Source URL should not be empty";
  }
  if (!item.heading || (item.heading && !item.heading.trim())) {
    return "Heading should not be empty";
  }
  if (!item.summary || (item.summary && !item.summary.trim())) {
    return "Summary should not be empty";
  }
  return false;
};

const textCheck = item => {
  if (isRichTextFieldEmpty(item.content)) {
    return "Content should not be empty";
  }
  return false;
};

const passageCheck = i => {
  if (isRichTextFieldEmpty(i.heading)) {
    return "Heading cannot be empty.";
  }
  if (isRichTextFieldEmpty(i.contentsTitle)) {
    return "Title cannot be empty.";
  }
  if (isRichTextFieldEmpty(i.content) && !i.paginated_content) {
    return "Passage cannot be empty.";
  }
  if (i.paginated_content) {
    for (const o of i.pages) {
      if (isRichTextFieldEmpty(o)) {
        return "Passage cannot be empty.";
      }
    }
  }
};

const editingTaskOptionsCheck = ({ displayStyle: { type = "", value = "" } = {}, options = {} }) => {
  // Don't need to check options for input type display
  if (type === displayStyles.TEXT_INPUT || value === displayStyles.TEXT_INPUT) return false;

  const valueSet = Object.values(options);

  if (!valueSet.length) return true;

  // for other display type we need to check option's values
  return valueSet.some(_value => (typeof _value === "string" ? !_value.trim() : isEmpty(_value)));
};

const hasEmptyOptions = item => {
  // options check for expression multipart type question.
  switch (item.type) {
    case EXPRESSION_MULTIPART:
      return expressionMultipartOptionsCheck(item);
    case CLOZE_DROP_DOWN:
      return clozeDropDownOptionsCheck(item);
    case MULTIPLE_CHOICE:
      return multipleChoiceOptionsCheck(item);
    case EDITING_TASK:
      return editingTaskOptionsCheck(item);
    default:
      return false;
  }
};

const hasEmptyFields = item => {
  switch (item.type) {
    case VIDEO:
      return videoCheck(item);
    case TEXT:
      return textCheck(item);
    case PASSAGE:
      return passageCheck(item);
    default:
      return false;
  }
};

const emptyFieldsValidator = {
  [questionType.CLOZE_IMAGE_DROP_DOWN](item) {
    const { options = [] } = item;
    if (!options.length) {
      return [true, "Options cannot be empty"];
    }
    const hasEmpty = options.some(option => !option.length || option.some(val => isRichTextFieldEmpty(val)));
    if (hasEmpty) {
      return [true, "Options have empty values"];
    }
    return [false, ""];
  },
  [questionType.CLOZE_IMAGE_DRAG_DROP](item) {
    const { options = [] } = item;

    if (!options.length) {
      return [true, `options cannot be empty`];
    }
    const hasEmptyOption = options.some(k => isRichTextFieldEmpty(k.value));
    if (hasEmptyOption) {
      return [true, `options cannot have empty values`];
    }
    return [false, ""];
  },
  [questionType.SORT_LIST](item) {
    const { source = [] } = item;
    if (!source.length) {
      return [true, "List cannot be empty"];
    }
    const _hasEmptyFields = source.some(option => isRichTextFieldEmpty(option));
    if (_hasEmptyFields) {
      return [true, "List has empty values"];
    }
    return [false, ""];
  },
  [questionType.MATCH_LIST](item) {
    const { list = [], possibleResponses = [], groupPossibleResponses = false, possibleResponseGroups = [] } = item;

    if (!list.length) {
      return [true, "List cannot be empty"];
    }
    if (!groupPossibleResponses && !possibleResponses.length) {
      return [true, "Possible responses cannot be empty"];
    }
    if (groupPossibleResponses && !possibleResponseGroups.length) {
      return [true, "Response Groups cannot be empty"];
    }
    const hasEmptyListField = list.some(option => isRichTextFieldEmpty(option.label));
    if (hasEmptyListField) {
      return [true, "List has empty values"];
    }
    if (!groupPossibleResponses) {
      const hasEmptyResponses = possibleResponses.some(resp => isRichTextFieldEmpty(resp.label));
      if (hasEmptyResponses) {
        return [true, "Response fields cannot be empty"];
      }
    }
    if (groupPossibleResponses) {
      const hasEmptyResponses = possibleResponseGroups.some(group => {
        const { responses = [] } = group;
        if (!responses.length) {
          return true;
        }
        return responses.some(resp => isRichTextFieldEmpty(resp.label));
      });
      if (hasEmptyResponses) {
        return [true, "Responses cannot be empty"];
      }
    }
    return [false, ""];
  },
  [questionType.CLASSIFICATION](item) {
    const { possibleResponses = [] } = item;
    const hasEmpty = possibleResponses.some(resp => {
      const { value = "" } = resp;
      return isRichTextFieldEmpty(value);
    });
    if (hasEmpty) {
      return [true, "responses cannot be empty"];
    }
    return [false, ""];
  },
  [questionType.ORDER_LIST](item) {
    const { list } = item;
    const hasEmpty = keys(list).some(id => isRichTextFieldEmpty(list[id]));
    if (hasEmpty) {
      return [true, "List items cannot have empty values"];
    }
    return [false, ""];
  }
};

const itemHasIncompleteFields = item => {
  if (emptyFieldsValidator[item.type]) {
    return emptyFieldsValidator[item.type](item);
  }
  return [false];
};

const answerValidator = {
  generalValidator(answers) {
    const hasEmpty = answers.some(answer => isEmpty(answer.value) || answer.value.some(ans => isEmpty(ans)));
    return hasEmpty;
  },
  [questionType.CHOICE_MATRIX](answers) {
    /**
     * all rows should not be empty
     * but, some rows can be empty
     * @see  https://snapwiz.atlassian.net/browse/EV-13694
     */
    const hasEmpty = answers.some(answer => isEmpty(answer.value));
    // const hasEmpty = answers.some(answer => {
    //   const { value = [] } = answer;
    //   return isEmpty(value) || value.every(row => isEmpty(row));
    // });
    // return hasEmpty;
    return isEmpty(answers) || hasEmpty;
  },
  [questionType.MULTIPLE_CHOICE](answers) {
    // able to save giving empty value as options from UI (fixed)
    const hasEmpty = this.generalValidator(answers);
    return hasEmpty;
  },
  [questionType.CLOZE_TEXT](answers) {
    const hasEmpty = answers.some(answer => isEmpty(answer.value) || answer.value.some(ans => isEmpty(ans.value)));
    return hasEmpty;
  },
  [questionType.CLOZE_IMAGE_TEXT](answers) {
    const hasEmpty = answers.some(
      answer => isEmpty(answer.value) || keys(answer.value).some(id => isEmpty(answer.value[id]))
    );
    return hasEmpty;
  },
  [questionType.CLOZE_DROP_DOWN](answers) {
    const hasEmpty = answers.some(answer => isEmpty(answer.value) || answer.value.some(ans => isEmpty(ans.value)));
    return hasEmpty;
  },
  [questionType.CLOZE_IMAGE_DROP_DOWN](answers) {
    const hasEmpty = answers.some(
      answer => isEmpty(answer.value) || keys(answer.value).some(id => isEmpty(answer.value[id]))
    );
    return hasEmpty;
  },
  [questionType.CLOZE_DRAG_DROP](answers) {
    const hasEmpty = this.generalValidator(answers);
    return hasEmpty;
  },
  [questionType.CLOZE_IMAGE_DRAG_DROP](answers) {
    const hasEmpty = answers.some(
      answer => isEmpty(answer.value) || answer.value.some(ans => isEmpty(ans) || isEmpty(ans.optionIds))
    );
    return hasEmpty;
  },
  [questionType.SORT_LIST](answers) {
    const hasEmpty = answers.some(answer => isEmpty(answer.value));
    // needs update
    // able to delete all options and able to save
    return hasEmpty;
  },
  [questionType.MATCH_LIST](answers) {
    const hasEmpty = answers.some(ans => isEmpty(ans) || Object.values(ans.value).some(a => isEmpty(a)));
    return hasEmpty;
  },
  [questionType.ORDER_LIST](answers) {
    const hasEmpty = this[questionType.SORT_LIST](answers);
    return hasEmpty;
  },
  [questionType.CLASSIFICATION](answers) {
    const isEmptyArray = arr => arr.length === 0;
    const values = answers.map(ans => ans.value);
    // At least one column should have correct answer
    const hasEmpty =
      !values.length ||
      values.some(val => {
        const responseIdArrays = Object.values(val);
        return responseIdArrays.length ? responseIdArrays.every(isEmptyArray) : true;
      });
    return hasEmpty;
  },
  [questionType.SHADING](answers) {
    const hasEmpty = answers.some(answer => isEmpty(answer.value) || answer.value.some(ans => ans.length === 0));
    return hasEmpty;
  },
  [questionType.TOKEN_HIGHLIGHT](answers) {
    const hasEmpty = this[questionType.SORT_LIST](answers);
    return hasEmpty;
  },
  [questionType.MATH](answers) {
    if (!answers.length) return true;

    // check for empty answers
    // if validation method is equivSyntax answer will be empty
    const hasEmpty = answers.some(answer => {
      if (Array.isArray(answer.value)) {
        return answer.value.some(ans =>
          ans.method !== methods.EQUIV_SYNTAX ? isEmpty(ans) || isEmpty(ans.value) : false
        );
      }
      return answer.method !== methods.EQUIV_SYNTAX ? !answer.value : false; // check for empty string value
    });
    return hasEmpty;
  },
  [questionType.GRAPH](answers) {
    const hasEmpty = this[questionType.SORT_LIST](answers);
    return hasEmpty;
  },
  [questionType.FRACTION_EDITOR](answers) {
    const hasEmpty = answers.some(answer => answer.value === undefined);
    return hasEmpty;
  },
  [questionType.EXPRESSION_MULTIPART](answers = []) {
    // on removing the responses it does not remove from the validation
    // math with unit we are able to save without providing unit
    // TODO: fix it in UI maybe
    const hasEmpty = answers.some((answer = {}) => {
      const textInputs = answer.textinput?.value || []; // get all the text inputs
      const dropdowns = answer.dropdown?.value || []; // get all the dropdown inputs
      const mathInputs = (answer.value || []).flatMap(input => input); // get all the math inputs
      const mathUnitInputs = (answer.mathUnits?.value || []).filter(_answer => !isEmpty(_answer)); // get all the mathUnit inputs
      const textInputsAndDropdowns = [...textInputs, ...dropdowns]; // combine text and dropdown as they can be validated together

      // check for empty answers
      // if validation method is equivSyntax answer will be empty
      const hasEmptyMathAnswers = mathInputs.some((mathInput = {}) =>
        mathInput.method !== methods.EQUIV_SYNTAX ? isEmpty(mathInput) || isEmpty(mathInput.value) : false
      );
      const hasEmptyMathUnitInputs = mathUnitInputs.some((input = {}) =>
        input.method !== methods.EQUIV_SYNTAX ? isEmpty(input.value) || isEmpty(input) : false
      );

      /**
       * dropdown and texts have similar structure for answers as in sort list
       * get it validated from the sort list answer validator
       */
      const hasEmptyTextOrDropDown = this[questionType.SORT_LIST](textInputsAndDropdowns);

      return hasEmptyTextOrDropDown || hasEmptyMathAnswers || hasEmptyMathUnitInputs;
    });
    return hasEmpty;
  },
  [questionType.SHORT_TEXT](answers) {
    return this[questionType.SORT_LIST](answers);
  },
  [questionType.HOTSPOT](answers) {
    return this[questionType.SORT_LIST](answers);
  },
  [questionType.EDITING_TASK](answers) {
    // when there is no response box
    return answers.some(
      ({ value }) => isEmpty(value) || Object.values(value).some(v => (typeof v === "string" ? !v.trim() : isEmpty(v)))
    );
  }
};

// TODO create a list of all question types where validation is stored
// check the structure of validation for all such question types
// make the helper generic to support all such question types
export const hasEmptyAnswers = item => {
  if (questionType.manuallyGradableQn.includes(item.type)) return false;
  const correctAnswers = [item?.validation?.validResponse, ...(item?.validation?.altResponses || [])];
  const hasEmpty = answerValidator[item.type]?.(correctAnswers);

  return hasEmpty;
};

/**
 *
 * @param {*} numberOfEmptyAnswers
 * @param {*} currentIndex position of empty answer
 */
const clozeDropDownEmptyAnsMessage = (numberOfEmptyAnswers = 0, currentIndex = undefined) => {
  if (numberOfEmptyAnswers > 1) {
    return "Correct/Alternate Answer(s) for the question cannot be empty";
  }
  return `Correct/Alternate Answer for Text Dropdown ${
    currentIndex !== undefined ? currentIndex + 1 : ""
  } cannot be empty`;
};

const emptyCorrectAnswerErrMsg = {
  [questionType.CLOZE_DROP_DOWN](answers) {
    const emptyResponses = [];
    answers?.forEach(({ value = [] }) => {
      value.forEach((ans, index) => {
        if (isEmpty(ans.value)) {
          emptyResponses.push(index);
        }
      });
    });

    return clozeDropDownEmptyAnsMessage(emptyResponses.length, emptyResponses[emptyResponses.length - 1]);
  }
};
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
    const _hasEmptyFields = hasEmptyFields(item);
    if (_hasEmptyFields) return [true, _hasEmptyFields];
    return [false];
  }

  const [hasIncompleteFields, errorMessage] = itemHasIncompleteFields(item);
  if (hasIncompleteFields) {
    return [true, errorMessage];
  }

  // item doesnt have a stimulus?
  if (isRichTextFieldEmpty(item.stimulus)) {
    return [true, "Question text should not be empty"];
  }

  // if  empty options are present
  if (item.options && hasEmptyOptions(item)) {
    return [true, "Answer choices should not be empty"];
  }
  // if not yet returned with an error, then it should be a fine question!

  if (!questionType.manuallyGradableQn.includes(item.type)) {
    const { score } = item?.validation?.validResponse || {};

    // when item level scoring is on score is removed from the validation object
    // so we should not validate question level score
    const validateQuestionScore = itemLevelScoring === false;
    if (validateQuestionScore) {
      if (score === undefined) {
        return [true, "Score needs to be set"];
      }
      if (parseFloat(score, 10) === 0) {
        return [true, "Score cannot be zero"];
      }
    }
  }

  if (!questionType.manuallyGradableQn.includes(item.type)) {
    const questionHasEmptyAnswers = hasEmptyAnswers(item);
    if (questionHasEmptyAnswers) {
      let defaultErrorMessage = "Correct/Alternate answers should be set";
      const getEmptyCorrectAnswerErrMsg = emptyCorrectAnswerErrMsg[item.type];
      if (typeof getEmptyCorrectAnswerErrMsg === "function") {
        const correctAnswers = [item?.validation?.validResponse, ...(item?.validation?.altResponses || [])];
        defaultErrorMessage = getEmptyCorrectAnswerErrMsg(correctAnswers);
      }
      return [true, defaultErrorMessage]; // [true, msg]
    }
  }

  return [false];
};

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
export const hasImproperDynamicParamsConfig = item => {
  if (item.variable) {
    const hasDyanmicVariables = Object.keys(item.variable?.variables || {}).length > 0;
    const optionEnabled = item.variable?.enabled || false;
    if (optionEnabled && !hasDyanmicVariables) return [true, "No dynamic variable used in authoring", true];
    if (hasDyanmicVariables && !optionEnabled) return [true, "Dynamic variables option not selected", false];
  }
  return [false];
};
