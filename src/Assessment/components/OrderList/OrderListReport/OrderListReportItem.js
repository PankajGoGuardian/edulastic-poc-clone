import React from 'react';
import PropTypes from 'prop-types';
import { FaCheck, FaTimes } from 'react-icons/fa';

import {
  green, red,
} from '../../../utilities/css';
import { translate } from '../../../utilities/localization';
import {
  Container, Text, Icon, CorrectAnswerItem,
} from './styled_components';

const OrderListReportItem = ({
  children, correctText, correct, showAnswers,
}) => (
  <React.Fragment>
    <Container correct={correct}>
      <Text>
        <span>{children}</span>
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
          <span>
            <span>{translate('component.orderlist.orderlistreportitem.correctanswer')}</span>
            {' '}
            {correctText}
          </span>
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
};
OrderListReportItem.defaultProps = {
  showAnswers: false,
  correctText: '',
};

export default OrderListReportItem;
