import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';
import Heading from '../../UI/Heading';
import { grey } from '../../../utilities/css';

const Question = ({ onQuestionChange, value }) => (
  <div>
    <Heading>Compose question</Heading>
    <StyledTextarea
      onChange={e => onQuestionChange(e.target.value)}
      placeholder="Enter your questiion"
      value={value}
    />
  </div>
);

Question.propTypes = {
  onQuestionChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default Question;

const StyledTextarea = styled(TextareaAutosize)`
  resize: none;
  width: 100%;
  min-height: 130px;
  border-radius: 5px;
  padding: 20px 50px;
  box-sizing: border-box;
  border: 1px solid ${grey};
`;
