import React, { memo } from "react";
import PropTypes from "prop-types";
import { FroalaEditor } from "@edulastic/common";

import { FroalaContainer } from "../styled/FroalaContainer";
import { ToolbarContainer } from "../styled/ToolbarContainer";

// TODO: decide what to do with first focus
const QuestionTextArea = ({ onChange, value, toolbarId, style, placeholder, showResponseBtn }) => {
  const additionalToolbarOptions = [];

  if (showResponseBtn) additionalToolbarOptions.push("response");

  return (
    <FroalaContainer style={style} data-cy="compose-question-quill-component">
      <ToolbarContainer toolbarId={toolbarId} />
      <FroalaEditor
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        toolbarContainer={`div.froala-toolbar-container[toolbarId="${toolbarId}"]`}
        additionalToolbarOptions={additionalToolbarOptions}
      />
    </FroalaContainer>
  );
};

QuestionTextArea.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  toolbarId: PropTypes.string,
  style: PropTypes.object,
  showResponseBtn: PropTypes.bool,
  placeholder: PropTypes.string
};

QuestionTextArea.defaultProps = {
  style: {},
  toolbarId: "question-text-area",
  showResponseBtn: false,
  placeholder: "Enter a question"
};

export default memo(QuestionTextArea);
