import { multipleChoice, orderList, clozeText, math } from '@edulastic/evaluators';

// clozeDropDown and ClozeText shares same logic
const evaluators = {
  multipleChoice,
  orderList,
  clozeText,
  clozeDropDown: clozeText,
  math
};

export default evaluators;
