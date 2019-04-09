import { questionType } from "@edulastic/constants";

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
  math,
  tokenhighlight,
  clozeDragDrop,
  essayRichText,
  shading,
  choiceMatrix,
  charts,
  graph,
  clozeMath
} from "@edulastic/evaluators";

// clozeDropDown and ClozeText shares same logic
const evaluators = {
  [questionType.MULTIPLE_CHOICE]: multipleChoice,
  [questionType.ORDER_LIST]: orderList,
  [questionType.CLOZE_TEXT]: clozeText,
  [questionType.CLOZE_DROP_DOWN]: clozeText,
  [questionType.CLOZE_IMAGE_DRAG_DROP]: clozeImageDragDrop,
  [questionType.CLOZE_IMAGE_DROP_DOWN]: clozeImageDropDown,
  [questionType.CLOZE_IMAGE_TEXT]: clozeImageText,
  [questionType.MATH]: math,
  [questionType.CLOZE_MATH]: clozeMath,
  [questionType.CLOZE_DRAG_DROP]: clozeDragDrop,
  [questionType.HIGHLIGHT_IMAGE]: essayRichText,
  [questionType.SHORT_TEXT]: shortText,
  [questionType.ESSAY_RICH_TEXT]: essayRichText,
  [questionType.ESSAY_PLAIN_TEXT]: essayRichText,
  [questionType.CLASSIFICATION]: classification,
  [questionType.CHOICE_MATRIX]: choiceMatrix,
  [questionType.MATCH_LIST]: sortList,
  [questionType.SORT_LIST]: sortList,
  [questionType.LINE_CHART]: charts,
  [questionType.BAR_CHART]: charts,
  [questionType.HOTSPOT]: hotspot,
  [questionType.TOKEN_HIGHLIGHT]: tokenhighlight,
  [questionType.SHADING]: shading,
  [questionType.GRAPH]: graph
};

export default evaluators;
