import React from 'react';
import PropTypes from 'prop-types';
import { SortableElement } from 'react-sortable-hoc';

import { IconCheck, IconClose } from '@edulastic/icons';
import { green, red, textColor } from '@edulastic/colors';
import { FlexContainer } from '@edulastic/common';
import { withNamespaces } from '@edulastic/localization';

import { Container } from '../styled/Container';
import { Text } from '../styled/Text';
import { Index } from '../styled/Index';
import { CorrectAnswerItem } from '../styled/CorrectAnswerItem';
import { QuestionText } from '../styled/QuestionText';
import { IconWrapper } from '../styled/IconWrapper';

const OrderListReportItem = SortableElement(
  ({ children, correctText, correct, showAnswers, ind, t }) => (
    <div>
      <Container correct={correct}>
        <Text>
          <FlexContainer>
            <Index>{ind}</Index>
            <div dangerouslySetInnerHTML={{ __html: children }} />
          </FlexContainer>
          {correct && (
            <IconWrapper color={green}>
              <IconCheck color={green} width={22} height={16} />
            </IconWrapper>
          )}
          {!correct && (
            <IconWrapper color={red}>
              <IconClose color={red} width={16} height={16} />
            </IconWrapper>
          )}
        </Text>
      </Container>
      {showAnswers && !correct && (
        <CorrectAnswerItem>
          <Text>
            <FlexContainer>
              <Index color={textColor}>{ind}</Index>
              <QuestionText style={{ color: textColor }}>
                <span>{t('component.orderlist.correctanswer')}</span>{' '}
                <div dangerouslySetInnerHTML={{ __html: correctText }} />
              </QuestionText>
            </FlexContainer>
          </Text>
        </CorrectAnswerItem>
      )}
    </div>
  )
);

OrderListReportItem.propTypes = {
  children: PropTypes.string.isRequired,
  correct: PropTypes.bool.isRequired,
  showAnswers: PropTypes.bool,
  correctText: PropTypes.string,
  ind: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired
};
OrderListReportItem.defaultProps = {
  showAnswers: false,
  correctText: ''
};

export default withNamespaces('assessment')(OrderListReportItem);
