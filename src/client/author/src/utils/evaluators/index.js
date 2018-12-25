import { multipleChoice, orderList, clozeText, clozeImageDragDrop, clozeImageDropDown, math } from '@edulastic/evaluators';

// clozeDropDown and ClozeText shares same logic
const evaluators = {
  multipleChoice,
  orderList,
  clozeText,
  clozeDropDown: clozeText,
  clozeImageDragDrop,
  clozeImageDropDown,
  math
};

export default evaluators;
