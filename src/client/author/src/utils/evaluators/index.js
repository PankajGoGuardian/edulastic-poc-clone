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
  choiceMatrix,
  essayRichText,
  shading,
  graph
} from "@edulastic/evaluators";

// clozeDropDown and ClozeText shares same logic
const evaluators = {
  multipleChoice,
  orderList,
  clozeText,
  clozeDropDown: clozeText,
  clozeImageDragDrop,
  clozeImageDropDown,
  clozeImageText,
  math,
  clozeDragDrop,
  shortText,
  essayRichText,
  classification,
  choiceMatrix,
  matchList: sortList,
  sortList,
  hotspot,
  tokenhighlight,
  shading,
  graph
};

export default evaluators;
