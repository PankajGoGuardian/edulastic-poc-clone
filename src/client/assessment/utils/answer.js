import { questionType } from "@edulastic/constants";
import { isEmpty, isObject, values, keys } from "lodash";

/**
 * check the user attempted question or not.
 * considered attempted if there is one response in a question.
 * @param {string} type type of question
 * @param {any} answer user response of question
 * @returns {boolean}
 */
export const hasValidAnswers = (type, answer) => {
  switch (type) {
    case questionType.MATCH_LIST:
      return !isEmpty(Object.values(answer || {}).filter(ans => ans?.toString()));
    case questionType.SORT_LIST:
    case questionType.CLOZE_DRAG_DROP:
    case questionType.HOTSPOT:
      return !isEmpty(answer?.filter(ans => ans?.toString()));
    case questionType.EDITING_TASK:
      return !isEmpty(Object.values(answer || {}).filter(ans => !isEmpty(ans)));
    case questionType.CLOZE_TEXT:
      return !isEmpty(answer?.filter(ans => ans?.value));
    case questionType.CLOZE_IMAGE_DRAG_DROP:
      return !isEmpty(answer?.filter(ans => !isEmpty(ans)));
    case questionType.CLASSIFICATION:
      if (!isObject(answer)) {
        return false;
      }
      return keys(answer).length > 0 && keys(answer).every(key => !isEmpty(answer[key]));
    case questionType.TOKEN_HIGHLIGHT:
      return !isEmpty(answer?.filter(ans => ans?.selected));
    case questionType.FORMULA_ESSAY:
      return !isEmpty(answer?.filter(ans => ans?.text));
    case questionType.EXPRESSION_MULTIPART: {
      const filtered = values(answer)
        .reduce((sum, current) => sum?.concat(values(current)), [])
        .filter(ans => ans?.value || ans?.unit);
      return !isEmpty(filtered);
    }
    case questionType.CLOZE_IMAGE_TEXT:
    case questionType.CLOZE_IMAGE_DROP_DOWN:
    case questionType.ORDER_LIST: {
      if (!isObject(answer) || isEmpty(answer)) {
        return false;
      }
      const answerKeys = keys(answer);
      return answerKeys.every(key => {
        const value = answer[key];
        /**
         * value can be 0, indicating index 0
         * !!0 is false, so it would return wrong result in every, considering question to be skipped
         * @see https://snapwiz.atlassian.net/browse/EV-16256
         */
        return value === 0 ? true : !!value;
      });
    }
    default:
      return !isEmpty(answer);
  }
};
