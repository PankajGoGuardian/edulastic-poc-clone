import { questionType, question } from "@edulastic/constants";
import { get, isString } from "lodash";
import striptags from "striptags";

const { EXPRESSION_MULTIPART, CLOZE_DROP_DOWN, MULTIPLE_CHOICE } = questionType;

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
    const hasEmptyOptions = opt.some(opt => !opt || (opt && !opt.trim()));
    if (hasEmptyOptions) return true;
  }

  const validResponse = item?.validation?.validResponse;
  if (validResponse) {
    // dropdown = dropDowns, mathUnits = mathUnits, textinput = inputs, value = maths
    const { dropdown, mathUnits, textinput, value } = validResponse;

    if (dropdown && dropdown.value) {
      for (let opt of dropdown.value) {
        if (!opt.value || (opt.value && !opt.value.trim())) {
          return true;
        }
      }
    }
    if (mathUnits && mathUnits.value) {
      for (let opt of mathUnits.value) {
        if (isMathTextFieldEmpty(opt.value) || !opt.options.unit) {
          return true;
        }
      }
    }
    if (textinput && textinput.value) {
      for (let opt of textinput.value) {
        if (!opt.value || (opt.value && !opt.value.trim())) {
          return true;
        }
      }
    }
    if (value && value.length) {
      for (let opt of value) {
        for (let _opt of opt) {
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
  return options.some(opt => {
    return (
      (opt.hasOwnProperty("label") && isRichTextFieldEmpty(opt.label)) || (isString(opt) && isRichTextFieldEmpty(opt))
    );
  });
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
    default:
      return false;
  }
};

export const isRichTextFieldEmpty = text => {
  if (!text) {
    return true;
  }

  if (text.includes(`<span class="input__math"`)) {
    return false;
  }

  let _text = striptags(text);
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

  let _text = text.replace(/\\/g, "");
  if (!_text || (_text && !_text.trim())) {
    return true;
  }
  return false;
};

/**
 * does question have enough data !?
 *  This is only the begnning. This func is going to grow to handle
 *  the idiosyncraices of  multiple questions types.
 *  @param {Object} item - the question item.
 *  @returns {Array} - returns a tuple containing a boolean, which flags
 *  a question as complete or incomplete, and if incomplete, teh reason is the second element
 */
export const isIncompleteQuestion = item => {
  // if its a resource type question just return.
  if (question.resourceTypeQuestions.includes(item.type)) {
    return [false];
  }

  // item doesnt have a stimulus?
  if (isRichTextFieldEmpty(item.stimulus)) {
    return [true, "Question text should not be empty"];
  }

  // if item doesnt have options just return at this point.
  if (!item.options) return [false];
  // if  empty options are present
  if (hasEmptyOptions(item)) return [true, "Answer choices should not be empty"];
  // if not yet returned with an error, then it should be a fine question!
  return [false];
};
