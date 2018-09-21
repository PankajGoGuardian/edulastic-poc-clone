import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FaCheck, FaTimes } from 'react-icons/fa';

import {
  grey, lightGreen, lightRed, green, red, textColor,
} from '../../../utilities/css';

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
            <span> Correct Answer:</span>
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

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: stretch;
  margin-bottom: 10px;
  background: ${({ correct }) => (correct ? lightGreen : lightRed)};
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-left: 2px solid ${({ correct }) => (correct ? green : red)};
`;

const CorrectAnswerItem = styled.div`
  width: calc(100% - 40px);
  display: flex;
  align-items: stretch;
  margin-bottom: 10px;
  cursor: pointer;
  background: ${grey};
  margin-left: 40px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-left: 2px solid ${textColor};
`;

const Text = styled.div`
  resize: none;
  width: 100%;
  border: none;
  height: 100%;
  border: 1px solid ${grey};
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  min-height: 50px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Icon = styled.div`
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 24px;
  color: ${({ color }) => color};
`;
