import PropTypes from 'prop-types';
import React from 'react';

import FlexContainer from '../common/FlexContainer';
import ItemContainter from './ItemContainter';
import Circle from '../common/Circle';
import Content from './Content';
import { translate } from '../../utilities/localization';

const QuestionListItem = (props) => {
  const { index, active, beforeSelection } = props;
  return (
    <ItemContainter active={active} >
      <FlexContainer alignItems={'center'} >
        <Circle r={6} active={active} hide={!beforeSelection} />
        <Content active={active} >{translate('common.layout.questionlist.question')} {index + 1}</Content>
      </FlexContainer>
    </ItemContainter>
  );
};

QuestionListItem.propTypes = {
  selectedQuestion: PropTypes.number,
  questions: PropTypes.array,
  index: PropTypes.number,
};

export default QuestionListItem;
