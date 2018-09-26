import React from 'react';
import PropTypes from 'prop-types';
import { FaCheck, FaTimes } from 'react-icons/fa';

import {
  green, red, textColor,
} from '../utils/css';
import { translate } from '../utils/localization';
import { Container, Text, Icon, CorrectAnswerItem, Index, QuestionText } from './styled_components';
import { FlexContainer } from '../common';


const OrderListReportItem = ({ children, correctText, correct, showAnswers, index }) => (
  <React.Fragment>
    <Container correct={correct}>
      <Text>
        <FlexContainer>
          <Index>{index}</Index>
          <QuestionText>{children}</QuestionText>
        </FlexContainer>
        {correct && (
          <Icon color={green}>
            <FaCheck />
          </Icon>
        )}
        {!correct && (
          <Icon color={red}>
            <FaTimes />
          </Icon>
        )}
      </Text>
    </Container>
    {showAnswers && (
      <CorrectAnswerItem>
        <Text showDragHandle={false}>
          <FlexContainer>
            <Index color={textColor}>{index}</Index>
            <QuestionText style={{ color: textColor }}>
              <span>{translate('component.orderlist.orderlistreportitem.correctanswer')}</span>{' '}
              {correctText}
            </QuestionText>
          </FlexContainer>
        </Text>
      </CorrectAnswerItem>
    )}
  </React.Fragment>
);

OrderListReportItem.propTypes = {
  children: PropTypes.string.isRequired,
  correct: PropTypes.bool.isRequired,
  showAnswers: PropTypes.bool,
  correctText: PropTypes.string,
  index: PropTypes.number.isRequired,
};
OrderListReportItem.defaultProps = {
  showAnswers: false,
  correctText: '',
};

export default OrderListReportItem;
