import * as moment from 'moment';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import { IconClockCircularOutline } from '@edulastic/icons';
import AssignmentsContent from '../../commonStyle/assignmentContent';
import { fetchReportAction } from '../../../actions/report';
import AssignmentContentWrapper from '../../commonStyle/assignmentContentWrapper';

const Report = ({ testName, score, totalQuestion, createdAt }) => (
  <Wrapper>
    <AssignmentSummary>
      <AssignmentSubject>{testName}</AssignmentSubject>
      <AssignmentDuedate>
        <Icon color="#ee1658" />
        <DueText>{moment.unix(createdAt / 1000).toLocaleString()}</DueText>
      </AssignmentDuedate>
    </AssignmentSummary>
    <div>
      <CorrectAns>
        {score}/{totalQuestion}
      </CorrectAns>
      <CorrectText>Correct Answer</CorrectText>
    </div>
    <div>
      <CorrectAns>{score}</CorrectAns>
      <CorrectText>Score</CorrectText>
    </div>
    <StartAssignmentBtn>
      <Button
        style={{
          width: 195,
          height: 53,
          fontWeight: 600,
          border: '1px solid #12a6e8',
          color: '#12a6e8',
          fontSize: '0.7rem',
          borderRadius: 65
        }}
      >
        REVIEW
      </Button>
    </StartAssignmentBtn>
  </Wrapper>
);

Report.propTypes = {
  testName: PropTypes.string,
  score: PropTypes.number,
  totalQuestion: PropTypes.number,
  createdAt: PropTypes.string
};

Report.defaultProps = {
  testName: '',
  score: 0,
  totalQuestion: 0,
  createdAt: Date.now()
};

const ReportContent = ({ flag, fetchReports, reports }) => {
  useEffect(() => {
    fetchReports();
  }, []);
  return (
    <AssignmentsContent flag={flag}>
      <AssignmentContentWrapper>
        {reports.map(report => (
          <Report {...report} />
        ))}
      </AssignmentContentWrapper>
    </AssignmentsContent>
  );
};

export default React.memo(
  connect(
    ({ ui, reports }) => ({ flag: ui.flag, reports: reports.reports }),
    { fetchReports: fetchReportAction }
  )(ReportContent)
);

ReportContent.propTypes = {
  flag: PropTypes.bool.isRequired,
  fetchReports: PropTypes.func.isRequired,
  reports: PropTypes.array.isRequired
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
  text-align: center;
  @media (max-width: 900px) {
    width: 19rem;
    margin-top: 1rem;
  }
  @media (max-width: 380px) {
    width: 100%;
  }
`;
