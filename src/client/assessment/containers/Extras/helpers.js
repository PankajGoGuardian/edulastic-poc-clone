import { cloneDeep, set } from "lodash";
import { arrayMove } from "react-sortable-hoc";

export const change = ({ item, setQuestionData }) => (path, value) => {
  const newData = cloneDeep(item);
  set(newData, path, value);
  setQuestionData(newData);
};

export const removeDistractor = ({ item, setQuestionData }) => index => {
  if (item.metadata && Array.isArray(item.metadata.distractor_rationale_response_level)) {
    const newData = cloneDeep(item);
    newData.metadata.distractor_rationale_response_level.splice(index, 1);
    setQuestionData(newData);
  }
};

export const sortDistractors = ({ item, setQuestionData }) => ({ oldIndex, newIndex }) => {
  const newData = cloneDeep(item);

  if (!newData.metadata || !Array.isArray(newData.metadata.distractor_rationale_response_level)) {
    return;
  }

  newData.metadata.distractor_rationale_response_level = arrayMove(
    newData.metadata.distractor_rationale_response_level,
    oldIndex,
    newIndex
  );
  setQuestionData(newData);
};

export const addDistractor = ({ item, setQuestionData }) => () => {
  const newData = cloneDeep(item);

  if (!newData.metadata) {
    newData.metadata = {};
  }

  if (!Array.isArray(newData.metadata.distractor_rationale_response_level)) {
    newData.metadata.distractor_rationale_response_level = [];
  }

  newData.metadata.distractor_rationale_response_level.push("");
  setQuestionData(newData);
};
