import React from 'react';
import PropTypes from 'prop-types';

import { Heading } from '../common';
import { translate } from '../utils/localization';
import { StyledTextarea } from './styled_components';

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
