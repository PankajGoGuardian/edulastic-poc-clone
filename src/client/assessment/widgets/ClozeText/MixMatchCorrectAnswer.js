import React, { useState } from "react";
import { Tag, Input } from "antd";

const MixMatchCorrectAnswer = () => {
  const [state, setState] = useState({ tags: ["fromCorrectAnswer", "Tag 2", "Tag 3"], value: "" });

  const handleClose = removedIndex => {
    state.tags.splice(removedIndex, 1);
    setState({ ...state, tags: state.tags });
  };

  const handleInputChange = e => {
    setState({ ...state, value: e.target.value });
  };

  const handleInputConfirm = () => {
    let newTags = state.tags;
    if (state.value && state.tags.indexOf(state.value) === -1) {
      newTags = [...state.tags, state.value];
    }
    setState({ tags: newTags, value: "" });
  };

  return (
    <div>
      {state.tags.map((tag, index) => (
        <Tag key={index} closable onClose={() => handleClose(index)}>
          {tag}
        </Tag>
      ))}
      <Input
        type="text"
        size="small"
        style={{ width: 78 }}
        value={state.value}
        onChange={handleInputChange}
        onBlur={handleInputConfirm}
        onPressEnter={handleInputConfirm}
      />
    </div>
  );
};

export default MixMatchCorrectAnswer;
