import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { formatTime } from '../utils';

const Attempt = ({ data }) => {
  const { correct = 0, wrong = 0 } = data;
  const total = correct + wrong;
  const percentage = (correct / total) * 100 || 0;

  return (
    <AttemptsData>
      <RowData>
        <AnswerAndScore>
          <span>{formatTime(data.createdAt / 1000)}</span>
        </AnswerAndScore>
        <AnswerAndScore>
          <span>
            {correct}/{total}
          </span>
        </AnswerAndScore>
        <AnswerAndScore>
          <span>{percentage}%</span>
        </AnswerAndScore>
        <SpaceBetween />
        <AnswerAndScoreReview>
          <span>REVIEW</span>
        </AnswerAndScoreReview>
      </RowData>
    </AttemptsData>
  );
};

export default Attempt;

Attempt.propTypes = {
  data: PropTypes.object.isRequired
};

const AttemptsData = styled.div`
  margin-top: 7px;
`;

const AnswerAndScore = styled.div`
  width: 135px;
  display: flex;
  align-items: center;
  flex-direction: column;
  span {
    font-size: 31px;
    font-weight: bold;
    color: #434b5d;
  }
  @media screen and (max-width: 767px) {
    width: 33%;
  }
`;

const SpaceBetween = styled.div`
  width: 10px;
`;

const AnswerAndScoreReview = styled(AnswerAndScore)`
  span {
    color: #00b0ff;
    cursor: pointer;
  }
  @media screen and (min-width: 769px) {
    width: 200px;
  }
  @media screen and (max-width: 767px) {
    width: 33%;
  }
`;

const RowData = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-radius: 4px;
  height: 30px;
  div {
    background-color: #f8f8f8;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    @media screen and (max-width: 767px) {
      justify-content: flex-start;
    }
  }
  span {
    font-size: 12px !important;
    font-weight: 600 !important;
    color: #9ca0a9;
  }
`;
