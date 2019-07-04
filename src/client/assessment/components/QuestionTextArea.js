import React, { memo } from "react";
import PropTypes from "prop-types";
import { FroalaEditor } from "@edulastic/common";

// TODO: decide what to do with first focus
const QuestionTextArea = ({
  onChange,
  value,
  toolbarId,
  placeholder,
  toolbarSize,
  additionalToolbarOptions,
  border,
  readOnly
}) => (
  <FroalaEditor
    placeholder={placeholder}
    onChange={onChange}
    value={value}
    toolbarId={toolbarId}
    toolbarSize={toolbarSize}
    additionalToolbarOptions={additionalToolbarOptions}
    data-cy="compose-question-quill-component"
    border={border}
    readOnly={readOnly}
  />
);

QuestionTextArea.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  toolbarId: PropTypes.string,
  toolbarSize: PropTypes.string,
  additionalToolbarOptions: PropTypes.array,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  border: PropTypes.string
};

QuestionTextArea.defaultProps = {
  toolbarSize: "STD",
  toolbarId: "question-text-area",
  additionalToolbarOptions: [],
  placeholder: "Enter a question",
  readOnly: false,
  border: "none"
};

export default memo(QuestionTextArea);
