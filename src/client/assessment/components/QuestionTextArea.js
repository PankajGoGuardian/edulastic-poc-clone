import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { CustomQuillComponent } from '@edulastic/common';

const QuestionTextArea = ({ onChange, value, style, placeholder }) => (
  <div style={style}>
    <CustomQuillComponent
      toolbarId="stimulus"
      placeholder={placeholder}
      onChange={onChange}
      showResponseBtn={false}
      value={value}
    />
  </div>
);

QuestionTextArea.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  style: PropTypes.object,
  placeholder: PropTypes.string
};

QuestionTextArea.defaultProps = {
  style: {},
  placeholder: 'Enter a question'
};

export default memo(QuestionTextArea);
