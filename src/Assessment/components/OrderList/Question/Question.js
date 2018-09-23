import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';
import { grey } from '../../../utilities/css';
import { Heading } from '../../common';
import { translate } from '../../../utilities/localization';

const Question = ({ onQuestionChange, value }) => (
  <div>
    <Heading>{translate('component.orderlist.question.composequestion')}</Heading>
    <StyledTextarea
      onChange={e => onQuestionChange(e.target.value)}
      placeholder={translate('component.orderlist.question.enteryourquestion')}
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
