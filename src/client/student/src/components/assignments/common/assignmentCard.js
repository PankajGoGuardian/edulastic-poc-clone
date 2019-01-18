import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Row, Col, Icon, Button } from 'antd';

import { initiateTestActivityAction } from '../../../actions/test';

const AssignmentCard = ({
  initiateTestActivity,
  data: { _id, endDate, testId, test },
  reports,
  history
}) => {
  const [isAttemptShow, setIsAttemptShow] = useState(false);

  const attemptHandler = () => {
    setIsAttemptShow(!isAttemptShow);
  };

  const getAttemptsData = (attempts, id) => {
    const data = [];
    attempts.forEach((o) => {
      if (o.assignmentId === id) {
        data.push(o);
      }
    });
    return data;
  };

  const startTest = () => {
    const attemptsData = getAttemptsData(reports, _id);
    if (attemptsData.length === 0) {
      initiateTestActivity(testId, _id);
    }
    history.push(`/student/test/${testId}`);
  };

  const timeConverter = (data) => {
    const a = new Date(data);
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
        : `${month} ${date}, ${year} ${hour}:${min} AM`;
    return time;
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

  const attemptsData = getAttemptsData(reports, _id);
  return (
    <CardWrapper>
      <AssessmentDetails>
        <Col>
          <ImageWrapper>
            <img src={test && test.thumbnail} alt="" />
          </ImageWrapper>
        </Col>
        <CardDetails>
          <CardTitle>{test && test.title}</CardTitle>
          <CardDate>
            <ClockIcon
              type="clock-circle"
              theme="outlined"
            />
            <span>
              <StrongText>Due on&nbsp;</StrongText>
              {timeConverter(endDate)}
            </span>
          </CardDate>
          <div>
            <StatusButton isSubmitted={attemptsData.length > 0}>
              <span>
                {attemptsData.length > 0 ? 'SUBMITTED' : 'NOT STARTED'}
              </span>
            </StatusButton>
          </div>
        </CardDetails>
      </AssessmentDetails>
      <ButtonAndDetail>
        <DetailContainer>
          <AttemptDetails>
            {attemptsData.length > 1 && (
              <Attempts onClick={attemptHandler}>
                <span>
                  {attemptsData.length - 1}/{attemptsData.length}
                </span>
                {isAttemptShow && (
                  <AttemptsTitle>&#x2193; &nbsp;&nbsp;Attempts</AttemptsTitle>
                )}
                {!isAttemptShow && (
                  <AttemptsTitle>&#x2191; &nbsp;&nbsp;Attempts</AttemptsTitle>
                )}
              </Attempts>
            )}
            {attemptsData.length > 0 && (
              <AnswerAndScore>
                <span>
                  {attemptsData[0].correctAnswers
                    ? attemptsData[0].correctAnswers
                    : 0}
                  /
                  {attemptsData[0].totalQuestion
                    ? attemptsData[0].totalQuestion
                    : 0}
                </span>
                <Title>Correct Answer</Title>
              </AnswerAndScore>
            )}
            {attemptsData.length > 0 && (
              <AnswerAndScore>
                <span>
                  {attemptsData[0].score ? attemptsData[0].score : 0}%
                </span>
                <Title>Score</Title>
              </AnswerAndScore>
            )}
          </AttemptDetails>
          <StartAssignButton onClick={startTest}>
            {attemptsData.length === 0 && <span>START ASSIGNMENT</span>}
            {attemptsData.length > 0 && <span>RETAKE</span>}
          </StartAssignButton>
        </DetailContainer>
        {isAttemptShow &&
          attemptsData.map(
            (data, index) =>
              index !== 0 && (
                <AttemptsData key={index}>
                  <RowData>
                    <Attempts>
                      <span>{UnixConverter(data.createdAt / 1000)}</span>
                    </Attempts>
                    <AnswerAndScore>
                      <span>
                        {data.correctAnswers ? data.correctAnswers : 0}/
                        {data.totalQuestion ? data.totalQuestion : 0}
                      </span>
                    </AnswerAndScore>
                    <AnswerAndScore>
                      <span>{data.score ? data.score : 0}%</span>
                    </AnswerAndScore>
                    <div style={{ width: 15 }} />
                    <AnswerAndScore className="AnswerAndScoreReview">
                      <span style={{ color: '#00b0ff', cursor: 'pointer' }}>
                        REVIEW
                      </span>
                    </AnswerAndScore>
                  </RowData>
                </AttemptsData>
              )
          )}
      </ButtonAndDetail>
    </CardWrapper>
  );
};

export default withRouter(
  connect(
    null,
    {
      initiateTestActivity: initiateTestActivityAction
    }
  )(AssignmentCard)
);

AssignmentCard.propTypes = {
  data: PropTypes.object.isRequired,
  reports: PropTypes.array,
  initiateTestActivity: PropTypes.func.isRequired,
  history: PropTypes.func.isRequired
};

AssignmentCard.defaultProps = {
  reports: []
};

const CardWrapper = styled(Row)`
  display: flex;
  padding: 27.8px 0;
  border-bottom: 1px solid #f2f2f2;
  &:last-child {
    border-bottom: 0px;
  }
  .ButtonAndDetail {
    display: flex;
    flex-direction: column;
    justify-content: center;
    @media screen and (min-width: 1025px) {
      width: 72%;
      margin-left: auto;
    }
    @media screen and (max-width: 767px) {
      width: 100%;
    }
  }
  img {
    max-width: 168.5px;
    border-radius: 10px;
    width: 100%;
    height: 80px;
  }
  @media screen and (max-width: 767px) {
    flex-direction: column;
  }
`;
const ButtonAndDetail = styled(Col)`
  display: flex;
  flex-direction: column;
  width:62%;
  @media screen and (min-width: 1025px) {
    margin-left:auto;
  }   
  @media screen and (max-width: 767px) {
    width: 100%;
  }
`;

const AssessmentDetails = styled(Col)`
  display: flex;
  flex-direction: row;
  @media screen and (max-width: 767px) {
    flex-direction: column;
  }
`;

const ImageWrapper = styled.div`
  max-width: 168.5px;
  max-height: 90.5px;
  overflow: hidden;
  border-radius: 10px;
  margin-right: 20px;
  @media screen and (max-width: 767px) {
    max-width: 100%;
    margin: 0;
    img {
      max-width: 100%;
    }
  }
`;

const CardDetails = styled(Col)`
  @media screen and (max-width: 767px) {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
`;

const CardTitle = styled.div`
  font-family: Open Sans;
  font-size: 16px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.38;
  letter-spacing: normal;
  text-align: left;
  color: #12a6e8;
  padding-bottom: 6px;
`;

const CardDate = styled.div`
  display: flex;
  font-family: Open Sans;
  font-size: 13px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.38;
  letter-spacing: normal;
  text-align: left;
  color: #444444;
  padding-bottom: 8px;
  .anticon-clock-circle {
    svg {
      width: 17px;
      height: 17px;
    }
  }
`;

const ClockIcon = styled(Icon)`
  color: #ee1658;
`;
const StrongText = styled.span`
  font-weight: 600;
  padding-left: 10px;
`;

const StatusButton = styled.div`
  width: 135px;
  height: 23.5px;
  border-radius: 5px;
  background-color: ${props =>
    (props.isSubmitted ? 'rgba(154, 0, 255, 0.2)' : 'rgba(0, 176, 255, 0.2)')};
  font-size: 10px;
  font-weight: bold;
  line-height: 1.38;
  letter-spacing: 0.2px;
  text-align: center;
  padding: 6px 24px;
  span {
    position: relative;
    top: -1px;
    color: ${props => (props.isSubmitted ? '#7d43a4' : '#0083be')};
  }
  @media screen and (max-width: 767px) {
    width: 100%;
  }
`;

const AttemptDetails = styled(Col)`
  display: flex;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

const StartAssignButton = styled(Button)`
  max-width: 200px;
  height: 40px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  border: solid 1px #12a6e8;
  width: 100%;
  padding: 5px 20px;
  cursor: pointer;
  float: right;
  margin: 10px 15px 0 10px;
  span {
    color: #00b0ff;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2px;
  }
  &:hover {
    background-color: #12a6e8;
    span {
      color: #ffffff;
    }
  }
  @media screen and (min-width: 1025px) {
    margin-right: 0px;
  }
  @media screen and (max-width: 768px) {
    max-width: 80%;
    margin: 10px 0 0;
  }
  @media screen and (max-width: 767px) {
    max-width: 100%;
  }
`;

const AnswerAndScore = styled.div`
  width: 135px;
  display: flex;
  align-items: center;
  flex-direction: column;
  &.AnswerAndScoreReview {
    @media screen and (min-width: 769px) {
      width: 200px;
    }
  }
  span {
    font-size: 31px;
    font-weight: bold;
    color: #434b5d;
  }
  @media screen and (max-width: 767px) {
    width: 33%;
  }
`;

const Attempts = AnswerAndScore;

const DetailContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  @media screen and (max-width: 1024px) {
    flex-direction: column;
  }
`;

const AttemptsTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #12a6e8;
  cursor: pointer;
`;

const Title = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #434b5d;
`;

const AttemptsData = styled.div`
  margin-top: 7px;
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
