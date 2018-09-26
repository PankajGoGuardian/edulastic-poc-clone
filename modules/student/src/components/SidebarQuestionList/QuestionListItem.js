import PropTypes from 'prop-types';
import React from 'react';

import ItemContainter from './ItemContainter';
import Content from './Content';
import { translate } from '../../utils/localization';
import { Circle, FlexContainer } from '../../../../assessment/src/components/common';

const QuestionListItem = ({ index, active, beforeSelection }) => (
  <ItemContainter active={active}>
    <FlexContainer alignItems="center">
      <Circle r={6} active={active} hide={!beforeSelection} />
      <Content active={active}>
        {translate('common.layout.questionlist.question')} {index + 1}
      </Content>
    </FlexContainer>
  </ItemContainter>
);

QuestionListItem.propTypes = {
  beforeSelection: PropTypes.bool.isRequired,
  active: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
};

export default QuestionListItem;
