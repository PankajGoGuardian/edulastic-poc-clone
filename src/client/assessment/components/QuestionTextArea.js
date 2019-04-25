import React, { memo } from "react";
import PropTypes from "prop-types";
import { CustomQuillComponent } from "@edulastic/common";

const QuestionTextArea = ({ inputId, onChange, value, style, firstFocus, placeholder, showResponseBtn }) => (
  <div style={style}>
    <CustomQuillComponent
      inputId={inputId}
      toolbarId="stimulus"
      firstFocus={firstFocus}
      placeholder={placeholder}
      onChange={onChange}
      showResponseBtn={showResponseBtn}
      value={value}
    />
  </div>
);

QuestionTextArea.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  inputId: PropTypes.string,
  style: PropTypes.object,
  firstFocus: PropTypes.bool,
  showResponseBtn: PropTypes.bool,
  placeholder: PropTypes.string
};

QuestionTextArea.defaultProps = {
  inputId: "",
  style: {},
  firstFocus: false,
  showResponseBtn: false,
  placeholder: "Enter a question"
};

export default memo(QuestionTextArea);
