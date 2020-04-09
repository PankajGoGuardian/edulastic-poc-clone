import { questionType } from "@edulastic/constants";
import { evaluateApi } from "@edulastic/api";

import {
  multipleChoice,
  orderList,
  sortList,
  hotspot,
  classification,
  clozeText,
  clozeImageDragDrop,
  clozeImageDropDown,
  clozeImageText,
  shortText,
  // math,
  tokenhighlight,
  clozeDragDrop,
  essayRichText,
  shading,
  choiceMatrix,
  charts,
  // clozeMath,
  fractionEditor,
  matchList
} from "@edulastic/evaluators";

const mathEvaluate = async (data, type) => {
  // getting evaluation from backend (EV-7432)
  if (type === questionType.GRAPH) {
    const validationObj = data?.validation;
    const correctAnswers = [
      validationObj?.validResponse?.value,
      ...validationObj?.altResponses?.map(i => i.value)
    ].filter(i => i.length);
    if (correctAnswers.length === 0) {
      const error = new Error();
      error.message = "Questions should have answers set";
      throw error;
    }
  }
  return await evaluateApi.evaluate(data, type);
};

// clozeDropDown and ClozeText shares same logic
const evaluators = {
  [questionType.MULTIPLE_CHOICE]: multipleChoice,
  [questionType.ORDER_LIST]: orderList,
  [questionType.CLOZE_TEXT]: clozeText,
  [questionType.EDITING_TASK]: clozeText,
  [questionType.CLOZE_DROP_DOWN]: clozeText,
  [questionType.CLOZE_IMAGE_DRAG_DROP]: clozeImageDragDrop,
  [questionType.CLOZE_IMAGE_DROP_DOWN]: clozeImageDropDown,
  [questionType.CLOZE_IMAGE_TEXT]: clozeImageText,
  [questionType.MATH]: mathEvaluate,
  [questionType.CLOZE_MATH]: mathEvaluate,
  [questionType.EXPRESSION_MULTIPART]: mathEvaluate,
  [questionType.CLOZE_DRAG_DROP]: clozeDragDrop,
  [questionType.HIGHLIGHT_IMAGE]: essayRichText,
  [questionType.SHORT_TEXT]: shortText,
  [questionType.ESSAY_RICH_TEXT]: essayRichText,
  [questionType.ESSAY_PLAIN_TEXT]: essayRichText,
  [questionType.CLASSIFICATION]: classification,
  [questionType.CHOICE_MATRIX]: choiceMatrix,
  [questionType.MATCH_LIST]: matchList,
  [questionType.SORT_LIST]: sortList,
  [questionType.LINE_CHART]: charts,
  [questionType.DOT_PLOT]: charts,
  [questionType.LINE_PLOT]: charts,
  [questionType.HISTOGRAM]: charts,
  [questionType.BAR_CHART]: charts,
  [questionType.HOTSPOT]: hotspot,
  [questionType.TOKEN_HIGHLIGHT]: tokenhighlight,
  [questionType.SHADING]: shading,
  [questionType.FORMULA_ESSAY]: essayRichText,
  [questionType.GRAPH]: mathEvaluate,
  [questionType.FRACTION_EDITOR]: fractionEditor
};

export default evaluators;
