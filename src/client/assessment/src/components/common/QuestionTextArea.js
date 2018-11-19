import React, { memo } from 'react';
import PropTypes from 'prop-types';
import TextareaAutosize from 'react-autosize-textarea';
import styled from 'styled-components';
import { grey } from '@edulastic/colors';

const QuestionTextArea = ({ onChange, value, style, placeholder }) => (
  <div style={style}>
    <StyledTextarea
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
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

export const StyledTextarea = styled(TextareaAutosize)`
  resize: none;
  width: 100%;
  min-height: 130px;
  border-radius: 5px;
  padding: 20px 50px;
  box-sizing: border-box;
  border: 1px solid ${grey};
`;
