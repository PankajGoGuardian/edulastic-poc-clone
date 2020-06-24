import produce from "immer";
import { evaluatorTypes } from "@edulastic/constants";
import mainEvaluator from "./mainEvaluator";

const evaluator = mainEvaluator(evaluatorTypes.IS_EQUAL);
const clozeImageDragDropEvaluator = ({ userResponse = [], validation }) => {
  // eslint-disable-next-line no-unused-vars
  const newUserResponse = produce(userResponse, draft => {
    draft = draft.map(res => {
      if (res) {
        delete res.rect;
        if (res.responseBoxID) {
          return res;
        }
      }
      return res;
    });
  })

  const modifiedValidation = produce(validation, draft => {
    const { altResponses = [], validResponse: { value = [] } = {} } = draft;
    value.forEach(val => {
      if (val && val.rect) {
        delete val.rect;
      }
    });
    altResponses.forEach(altResponse => {
      const { value: answer = [] } = altResponse;
      answer.forEach(obj => {
        if (obj && obj.rect) {
          delete obj.rect;
        }
      });
    });
  });

  const evaluation = evaluator({ userResponse: newUserResponse, validation: modifiedValidation });
  return evaluation;
};

export default clozeImageDragDropEvaluator;
