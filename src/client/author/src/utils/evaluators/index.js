import {
  multipleChoice,
  orderList,
  sortList,
  hotspot,
  classification,
  clozeText,
  clozeImageDragDrop,
  clozeImageDropDown,
  shortText,
  math,
  tokenhighlight,
  choiceMatrix,
  shading
} from '@edulastic/evaluators';

// clozeDropDown and ClozeText shares same logic
const evaluators = {
  multipleChoice,
  orderList,
  clozeText,
  clozeDropDown: clozeText,
  clozeImageDragDrop,
  clozeImageDropDown,
  math,
  clozeDragDrop: sortList,
  shortText,
  classification,
  choiceMatrix,
  matchList: sortList,
  sortList,
  hotspot,
  tokenhighlight,
  shading
};

export default evaluators;
