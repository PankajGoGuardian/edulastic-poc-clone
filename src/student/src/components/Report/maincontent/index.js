import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { IconClockCircularOutline } from '@edulastic/icons';
import AssignmentsContent from '../../commonStyle/assignmentContent';
import AssignmentContentWrapper from '../../commonStyle/assignmentContentWrapper';

const ReportContent = ({ flag }) => (
  <AssignmentsContent flag={flag}>
    <AssignmentContentWrapper>
      <Wrapper>
        <AssignmentSummary>
          <AssignmentSubject>Math MCAS-CALCULATOR</AssignmentSubject>
          <AssignmentDuedate>
            <Icon color="#ee1658" />
            <DueText>Due on Aug 15, 2018 8:00 AM</DueText>
          </AssignmentDuedate>
        </AssignmentSummary>
        <div>
          <CorrectAns>8/8</CorrectAns>
          <CorrectText>Correct Answer</CorrectText>
        </div>
        <div>
          <CorrectAns>100%</CorrectAns>
          <CorrectText>Score</CorrectText>
        </div>
        <StartAssignmentBtn>
          <p>review</p>
        </StartAssignmentBtn>
      </Wrapper>
      <Wrapper>
        <AssignmentSummary>
          <AssignmentSubject>Math MCAS-CALCULATOR</AssignmentSubject>
          <AssignmentDuedate>
            <Icon color="#ee1658" />
            <DueText>Due on Aug 15, 2018 8:00 AM</DueText>
          </AssignmentDuedate>
        </AssignmentSummary>
        <div>
          <CorrectAns>8/8</CorrectAns>
          <CorrectText>Correct Answer</CorrectText>
        </div>
        <div>
          <CorrectAns>100%</CorrectAns>
          <CorrectText>Score</CorrectText>
        </div>
        <StartAssignmentBtn>
          <p>review</p>
        </StartAssignmentBtn>
      </Wrapper>
    </AssignmentContentWrapper>
  </AssignmentsContent>
);

export default React.memo(
  connect(({ ui }) => ({ flag: ui.flag }))(ReportContent),
);

ReportContent.propTypes = {
  flag: PropTypes.bool.isRequired,
};

const CorrectAns = styled.p`
   {
    margin: 0rem;
    font-weight: 700;
    font-size: 1.5rem;
    text-align: center;
    color: #434b5d;
  }
`;
const CorrectText = styled.p`
   {
    margin: 0rem;
    text-align: center;
    color: #434b5;
  }
`;
const Wrapper = styled.div`
  width: 100%;
  display: flex;
  padding: 1rem 0rem;
  border-bottom: 1px solid #f2f2f2;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 900px) {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  &:nth-last-of-type(1) {
    border-bottom: none;
  }
`;

const AssignmentSummary = styled.div`
  float: left;

  @media (min-width: 1024px) {
    width: 30rem;
  }
  @media (max-width: 900px) {
    text-align: center;
  }
`;

const AssignmentSubject = styled.p`
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #12a6e8;
  font-size: 1.1rem;
  font-weight: 700;
  & span {
  }
`;

const AssignmentDuedate = styled.p`
  margin-top: 0rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  @media (max-width: 900px) {
    margin-bottom: 1.2rem;
  }
`;

const DueText = styled.span`
  vertical-align: middle;
`;

const Icon = styled(IconClockCircularOutline)`
  margin-right: 0.5rem;
  vertical-align: middle;
`;

const StartAssignmentBtn = styled.div`
  width: 12.3rem;
  & p {
    color: #12a6e8;
    border: 0.08rem solid #12a6e8;
    padding: 1.1rem 1.5rem;
    border-radius: 2rem;
    text-align: center;
    text-transform: uppercase;
    font-size: 0.7rem;
    margin: 1.3rem 0rem;
    font-weight: 600;
    cursor: pointer;
    &:hover {
      background: #12a6e8;
      color: #fff;
    }
  }
  @media (max-width: 900px) {
    width: 19rem;
    & p {
      padding: 1.3rem 1.5rem;
      font-size: 1rem;
      margin-bottom: 0rem;
    }
  }
  @media (max-width: 380px) {
    width: 100%;
    & p {
    }
  }
`;
