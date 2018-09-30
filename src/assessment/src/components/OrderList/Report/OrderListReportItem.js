import React from 'react';
import PropTypes from 'prop-types';

import { translate } from '../utils/localization';
import { Container, Text, Icon, CorrectAnswerItem, Index, QuestionText } from './styled_components';
import { FlexContainer } from '../common';
import { IconCheck, IconClose } from '../../common/icons';
import { green, red, textColor } from '../../../utils/css';

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
            <IconCheck color={green} width={22} height={16} />
          </Icon>
        )}
        {!correct && (
          <Icon color={red}>
            <IconClose color={red} width={16} height={16} />
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
