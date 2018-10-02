import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from '@edulastic/localization';

import { Heading } from '../common';
import { StyledTextarea } from './styled_components';

const Question = ({ onQuestionChange, value, t, style }) => (
  <div style={style}>
    <Heading>{t('component.orderlist.question.composequestion')}</Heading>
    <StyledTextarea
      onChange={e => onQuestionChange(e.target.value)}
      placeholder={t('component.orderlist.question.enteryourquestion')}
      value={value}
    />
  </div>
);

Question.propTypes = {
  onQuestionChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  style: PropTypes.object,
};

Question.defaultProps = {
  style: {},
};

export default withNamespaces('assessment')(Question);
