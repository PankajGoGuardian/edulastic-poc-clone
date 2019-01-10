import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Attempt = ({ data }) => {
  const parseAttemptData = (attempt) => {
    const correct = attempt.correct || 0;
    const wrong = attempt.wrong || 0;
    const totalQuestions = correct + wrong || 0;
    const score = attempt.score || 0;
    const maxScore = attempt.maxScore || 0;
    let scorePercentage = (score / maxScore) * 100;
    scorePercentage = Number.isNaN(scorePercentage)
      ? 0
      : scorePercentage.toFixed(2);
    return {
      correct,
      wrong,
      totalQuestions,
      score,
      maxScore,
      scorePercentage
    };
  };

  const UnixConverter = (UNIX_timestamp) => {
    const a = new Date(UNIX_timestamp * 1000);
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const hour = a.getHours();
    const min = a.getMinutes();
    const time =
      hour > 11
        ? `${month} ${date}, ${year} ${hour - 12}:${min} PM`
        : `${month} ${date}, ${year} ${hour - 12}:${min} AM`;
    return time;
  };

  const attempt = parseAttemptData(data);

  return (
    <AttemptsData>
      <RowData>
        <AnswerAndScore>
          <span>{UnixConverter(data.createdAt / 1000)}</span>
        </AnswerAndScore>
        <AnswerAndScore>
          <span>
            {attempt.correct}/{attempt.totalQuestions}
          </span>
        </AnswerAndScore>
        <AnswerAndScore>
          <span>{attempt.scorePercentage}%</span>
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
