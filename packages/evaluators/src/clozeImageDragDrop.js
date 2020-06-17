import { cloneDeep } from "lodash";
import produce from "immer";
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

  const modifiedValidation = produce(validation, draft => {
    const { altResponses = [], validResponse: { value = [] } = {} } = draft;
    value.forEach(val => {
      if (val.rect) {
        delete val.rect;
      }
    });
    altResponses.forEach(altResponse => {
      const { value: answer = [] } = altResponse;
      answer.forEach(obj => {
        if (obj.rect) {
          delete obj.rect;
        }
      });
    });
  });

  const evaluation = evaluator({ userResponse: newUserResponse, validation: modifiedValidation });
  return evaluation;
};

export default clozeImageDragDropEvaluator;
