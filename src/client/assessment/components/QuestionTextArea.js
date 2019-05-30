import React, { memo } from "react";
import PropTypes from "prop-types";
import { FroalaEditor } from "@edulastic/common";

// TODO: decide what to do with first focus
const QuestionTextArea = ({ onChange, value, style, placeholder, showResponseBtn }) => {
  const additionalToolbarOptions = [];

  if (showResponseBtn) additionalToolbarOptions.push("response");

  return (
    <div style={style} data-cy="compose-question-quill-component">
      <FroalaEditor
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        additionalToolbarOptions={additionalToolbarOptions}
      />
    </div>
  );
};

QuestionTextArea.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  style: PropTypes.object,
  showResponseBtn: PropTypes.bool,
  placeholder: PropTypes.string
};

QuestionTextArea.defaultProps = {
  style: {},

  showResponseBtn: false,
  placeholder: "Enter a question"
};

export default memo(QuestionTextArea);
