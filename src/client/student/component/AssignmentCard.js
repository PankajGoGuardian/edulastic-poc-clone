import React, { useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withNamespaces } from '@edulastic/localization';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { last } from 'lodash';
import { Row, Col, Button } from 'antd';

//  components
import AssessmentDetails from './AssessmentDetail';
import Attempt from './Attempt';

// actions
import { startAssignmentAction } from '../Assignments/ducks';

const AssignmentCard = ({ startAssignment, data, theme, t, type }) => {
  const [showAttempts, setShowAttempts] = useState(false);

  const toggleAttemptsView = () => setShowAttempts(prev => !prev);

  const { test = {}, reports = [], endDate, testId } = data;
  const attempted = !!(reports && reports.length);
  const attemptCount = reports && reports.length;
  const lastAttempt = last(reports) || {};
  const { correct = 0, wrong = 0 } = lastAttempt;
  const totalQuestions = correct + wrong || 0;
  const scorePercentage = (correct / totalQuestions) * 100 || 0;
  const startButtonText = attempted
    ? t('common.retake')
    : t('common.startAssignment');

  const arrow = showAttempts ? '\u2193' : '\u2191';

  const startTest = () => {
    if (attemptCount < test.maxAttempts) {
      startAssignment({ testId, assignmentId: data._id });
    }
  };

  return (
    <CardWrapper>
      <AssessmentDetails
        test={test}
        theme={theme}
        t={t}
        type={type}
        started={attempted}
        dueDate={endDate}
      />
      <ButtonAndDetail>
        <DetailContainer>
          <AttemptDetails>
            <Attempts onClick={toggleAttemptsView}>
              <span>
                {attemptCount}/{test.maxAttempts || attemptCount}
              </span>
              <AttemptsTitle>
                {arrow} &nbsp;&nbsp;{t('common.attemps')}
              </AttemptsTitle>
            </Attempts>

            {attempted && (
              <React.Fragment>
                <AnswerAndScore>
                  <span>
                    {correct}/{totalQuestions}
                  </span>
                  <Title>{t('common.correctAnswer')}</Title>
                </AnswerAndScore>

                <AnswerAndScore>
                  <span>{scorePercentage}%</span>
                  <Title>{t('common.score')}</Title>
                </AnswerAndScore>
              </React.Fragment>
            )}
          </AttemptDetails>
          {type === 'assignment' ? (
            <StartAssignButton onClick={startTest}>
              <span>{startButtonText}</span>
            </StartAssignButton>
          ) : (
            <Link
              to={{
                pathname: `/home/testActivityReport/${lastAttempt._id}`,
                testActivityId: lastAttempt && lastAttempt._id,
                title: test.title
              }}
            >
              <StartAssignButton>
                <span>{t('common.review')}</span>
              </StartAssignButton>
            </Link>
          )}
        </DetailContainer>
        {showAttempts &&
          reports.map(attempt => <Attempt key={attempt._id} data={attempt} />)}
      </ButtonAndDetail>
    </CardWrapper>
  );
};

const enhance = compose(
  withTheme,
  withRouter,
  withNamespaces('assignmentCard'),
  connect(
    null,
    {
      startAssignment: startAssignmentAction
    },
    (a, b, c) => ({ ...a, ...b, ...c }), // mergeProps
    { pure: false }
  )
);

export default enhance(AssignmentCard);

AssignmentCard.propTypes = {
  data: PropTypes.object.isRequired,
  initiateTestActivity: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  startAssignment: PropTypes.func.isRequired
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
