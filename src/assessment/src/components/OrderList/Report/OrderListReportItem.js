import React from 'react';
import PropTypes from 'prop-types';
import { IconCheck, IconClose } from '@edulastic/icons';
import { green, red, textColor } from '@edulastic/colors';
import { FlexContainer } from '@edulastic/common';
import { withNamespaces } from '@edulastic/localization';

import { Container, Text, Icon, CorrectAnswerItem, Index, QuestionText } from './styled_components';

const OrderListReportItem = ({ children, correctText, correct, showAnswers, index, t }) => (
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
              <span>{t('component.orderlist.orderlistreportitem.correctanswer')}</span>{' '}
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
  t: PropTypes.func.isRequired,
};
OrderListReportItem.defaultProps = {
  showAnswers: false,
  correctText: '',
};

export default withNamespaces('assessment')(OrderListReportItem);
