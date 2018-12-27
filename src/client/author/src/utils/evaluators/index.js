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
  shortText,
  classification,
  matchList: sortList,
  sortList,
  hotspot,
  tokenhighlight,
  shading
};

export default evaluators;
