import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { last } from 'lodash';
import { Row, Col, Icon, Button } from 'antd';
import Attempt from './attempt';
import { initiateTestActivityAction } from '../../../actions/test';

const AssignmentCard = ({
  initiateTestActivity,
  data: { _id, endDate, testId, test },
  reports,
  history,
  theme
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
    if (attemptsData.length < test.maxAttempts) {
      initiateTestActivity(testId, _id);
      history.push(`/student/test/${testId}`);
    } else {
      console.log('ran out of max attempts');
    }
  };

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

  const attemptsData = getAttemptsData(reports, _id) || [];
  const attemptCount = attemptsData.length;
  const lastAttempt = last(attemptsData) || {};
  const previousAttempts = attemptsData.slice(1, attemptCount);
  const current = parseAttemptData(lastAttempt);

  // / move it to the upper components, wtf!
  const showAssignment = test.maxAttempts > attemptsData.length;

  let startButtonText = '';
  if (showAssignment) {
    startButtonText = attemptCount ? 'RETAKE' : 'START ASSIGNMENT';
  }

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
            <Icon type={theme.assignment.cardTimeIconType} />
            <span>
              <StrongText>Due on </StrongText>
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
                  {attemptCount}/{test.maxAttempts || attemptCount}
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
                  {current.correct || 0}/{current.totalQuestions}
                </span>
                <Title>Correct Answer</Title>
              </AnswerAndScore>
            )}
            {attemptsData.length > 0 && (
              <AnswerAndScore>
                <span>{current.scorePercentage}%</span>
                <Title>Score</Title>
              </AnswerAndScore>
            )}
          </AttemptDetails>
          {showAssignment && (
            <StartAssignButton onClick={startTest}>
              <span> {startButtonText}</span>
            </StartAssignButton>
          )}
        </DetailContainer>
        {isAttemptShow &&
          previousAttempts.map((attempt, index) => (
            <Attempt key={index} data={attempt} />
          ))}
      </ButtonAndDetail>
    </CardWrapper>
  );
};

const enhance = compose(
  withTheme,
  withRouter,
  connect(
    null,
    {
      initiateTestActivity: initiateTestActivityAction
    }
  )
);

export default enhance(AssignmentCard);

AssignmentCard.propTypes = {
  data: PropTypes.object.isRequired,
  reports: PropTypes.array,
  initiateTestActivity: PropTypes.func.isRequired,
  history: PropTypes.func.isRequired,
  theme: PropTypes.func.isRequired
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
  width: 62%;
  @media screen and (min-width: 1025px) {
    margin-left: auto;
  }
  @media screen and (max-width: 767px) {
    flex-direction: column;
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
  font-family: ${props => props.theme.assignment.cardTitleFontFamily};
  font-size: ${props => props.theme.assignment.cardTitleFontSize};
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.38;
  letter-spacing: normal;
  text-align: left;
  color: ${props => props.theme.assignment.cardTitleColor};
  padding-bottom: 6px;
`;

const CardDate = styled.div`
  display: flex;
  font-family: ${props => props.theme.assignment.cardTitleFontFamily};
  font-size: ${props => props.theme.assignment.cardTimeTextFontSize};
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.38;
  letter-spacing: normal;
  text-align: left;
  color: ${props => props.theme.assignment.cardTimeTextColor};
  padding-bottom: 8px;
  i {
    color: ${props => props.theme.assignment.cardTimeIconColor};
  }

  .anticon-clock-circle {
    svg {
      width: 17px;
      height: 17px;
    }
  }
`;

const StrongText = styled.span`
  font-weight: 600;
  padding-left: 5px;
`;

const StatusButton = styled.div`
  width: 135px;
  height: 23.5px;
  border-radius: 5px;
  background-color: ${props =>
    (props.isSubmitted
      ? props.theme.assignment.cardSubmitLabelBgColor
      : props.theme.assignment.cardNotStartedLabelBgColor)};
  font-size: ${props => props.theme.assignment.cardSubmitLabelFontSize};
  font-weight: bold;
  line-height: 1.38;
  letter-spacing: 0.2px;
  text-align: center;
  padding: 6px 24px;
  span {
    position: relative;
    top: -1px;
    color: ${props =>
    (props.isSubmitted
      ? props.theme.assignment.cardSubmitLabelTextColor
      : props.theme.assignment.cardNotStartedLabelTextColor)};
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
  background: ${props => props.theme.assignment.cardRetakeBtnBgColor};
  border: solid 1px ${props => props.theme.assignment.cardRetakeBtnBgHoverColor};
  width: 100%;
  padding: 5px 20px;
  cursor: pointer;
  float: right;
  margin: 10px 15px 0 10px;
  span {
    color: ${props => props.theme.assignment.cardRetakeBtnTextColor};
    font-size: ${props => props.theme.assignment.cardRetakeBtnFontSize};
    font-weight: 600;
    letter-spacing: 0.2px;
  }
  &:hover {
    background-color: ${props =>
    props.theme.assignment.cardRetakeBtnBgHoverColor};
    span {
      color: ${props => props.theme.assignment.cardRetakeBtnTextHoverColor};
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
  span {
    font-size: ${props => props.theme.assignment.cardAnswerAndScoreTextSize};
    font-weight: bold;
    color: ${props => props.theme.assignment.cardAnswerAndScoreTextColor};
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
  @media screen and(max-width: 1024px) {
    flex-direction: column;
  }
`;

const AttemptsTitle = styled.div`
  font-size: ${props => props.theme.assignment.cardAttemptLinkFontSize};
  font-weight: 600;
  color: ${props => props.theme.assignment.cardAttemptLinkTextColor};
  cursor: pointer;
`;

const Title = styled.div`
  font-size: ${props => props.theme.assignment.cardResponseBoxLabelsFontSize};
  font-weight: 600;
  color: ${props => props.theme.assignment.cardResponseBoxLabelsColor};
`;
