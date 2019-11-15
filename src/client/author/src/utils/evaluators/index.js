import { questionType } from "@edulastic/constants";
import { evaluateApi, graphEvaluateApi } from "@edulastic/api";
import { produce } from "immer";

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
  const _data = produce(data, draft => {
    // remove units form payload when method is equiSymbolic
    for (let [index, [key, value]] of Object.entries(Object.entries(draft?.userResponse?.mathUnits))) {
      if (draft?.validation?.validResponse?.mathUnits?.value?.[index]?.method === "equivSymbolic") {
        // get correct answer unit and user answer unit
        const validRespUnit = draft?.validation?.validResponse?.mathUnits?.value?.[index]?.options?.unit;
        const userResponseUnit = value.unit;
        // append the value with respective units
        draft.validation.validResponse.mathUnits.value[index].value += validRespUnit;
        draft.userResponse.mathUnits[key].value += userResponseUnit;
        // remove the units
        delete draft?.validation?.validResponse?.mathUnits?.value?.[index]?.options?.unit;
        delete draft?.userResponse?.mathUnits[key]?.unit;
      }
    }
    return draft;
  });

  return await evaluateApi.evaluate(_data, type);
};

// clozeDropDown and ClozeText shares same logic
const evaluators = {
  [questionType.MULTIPLE_CHOICE]: multipleChoice,
  [questionType.ORDER_LIST]: orderList,
  [questionType.CLOZE_TEXT]: clozeText,
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
