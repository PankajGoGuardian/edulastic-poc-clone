import { questionType } from "@edulastic/constants";
import { isEmpty, values } from "lodash";

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
    case questionType.CLOZE_IMAGE_TEXT:
    case questionType.CLOZE_DRAG_DROP:
    case questionType.HOTSPOT:
      return !isEmpty(answer?.filter(ans => ans?.toString()));
    case questionType.EDITING_TASK:
      return !isEmpty(Object.values(answer || {}).filter(ans => !isEmpty(ans)));
    case questionType.CLOZE_TEXT:
      return !isEmpty(answer?.filter(ans => ans?.value));
    case questionType.CLOZE_IMAGE_DRAG_DROP:
      return !isEmpty(answer?.filter(ans => !isEmpty(ans?.value)));
    case questionType.CLASSIFICATION:
      return !isEmpty(answer?.filter(ans => !isEmpty(ans)));
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
    default:
      return !isEmpty(answer);
  }
};
