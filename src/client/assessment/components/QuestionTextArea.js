import React, { memo } from "react";
import PropTypes from "prop-types";
import { FroalaEditor } from "@edulastic/common";

// TODO: decide what to do with first focus
const QuestionTextArea = ({ onChange, value, toolbarId, placeholder, additionalToolbarOptions, readOnly = false }) => (
  <FroalaEditor
    placeholder={placeholder}
    onChange={onChange}
    value={value}
    toolbarId={toolbarId}
    additionalToolbarOptions={additionalToolbarOptions}
    data-cy="compose-question-quill-component"
    readOnly={readOnly}
  />
);

QuestionTextArea.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  toolbarId: PropTypes.string,
  additionalToolbarOptions: PropTypes.array,
  placeholder: PropTypes.string
};

QuestionTextArea.defaultProps = {
  toolbarId: "question-text-area",
  additionalToolbarOptions: [],
  placeholder: "Enter a question"
};

export default memo(QuestionTextArea);
