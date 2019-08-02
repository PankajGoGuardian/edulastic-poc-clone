import { cloneDeep } from "lodash";
import { evaluatorTypes } from "@edulastic/constants";
import mainEvaluator from "./mainEvaluator";

const evaluator = mainEvaluator(evaluatorTypes.IS_EQUAL);
const clozeImageDragDropEvaluator = ({ userResponse = [], validation }) => {
  let newUserResponse = cloneDeep(userResponse);
  newUserResponse = newUserResponse.map(res => {
    if (res) {
      delete res.rect;
      if (res.responseBoxID) {
        return res;
      }
    }
    return null;
  });
  const evaluation = evaluator({ userResponse: newUserResponse, validation });
  return evaluation;
};

export default clozeImageDragDropEvaluator;
