import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Icon, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import { uniqBy } from 'lodash';
import AssignmentsContent from '../../commonStyle/assignmentContent';
import { fetchReportAction } from '../../../actions/report';
import { loadAssignmentsAction } from '../../../actions/dashboard';

import AssignmentContentWrapper from '../../commonStyle/assignmentContentWrapper';

const Report = ({ _id,
  score,
  totalQuestion,
  createdAt,
  correctAnswers,
  assignmentId,
  reports,
  assignments
}) => {
  const [isAttemptShow, setIsAttemptShow] = useState(false);
  const timeConverter = (UNIX_timestamp) => {
    const a = new Date(UNIX_timestamp * 1000);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const hour = a.getHours();
    const min = a.getMinutes();
    const time = hour > 11 ? `${month} ${date}, ${year} ${hour - 12}:${min} PM` : `${month} ${date}, ${year} ${hour - 12}:${min} AM`;
    return time;
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

  const attemptHandler = () => {
    setIsAttemptShow(!isAttemptShow);
  };

  let title;
  let thumbnail;
  assignments.forEach((assignment) => {
    if (assignment._id === assignmentId) {
      title = assignment.test && assignment.test.title;
      thumbnail = assignment.test && assignment.test.thumbnail;
    }
  });

  return (
    <CardWrapper>
      <AssessmentDetails>
        <Col>
          <ImageWrapper>
            <img src={thumbnail} alt="" />
          </ImageWrapper>
        </Col>
        <CardDetails>
          <CardTitle>{title}</CardTitle>
          <CardDate>
            <Icon
              type="clock-circle"
              theme="outlined"
              style={{ color: '#ee1658' }}
            />
            <span>
              <StrongText>Finished in&nbsp;</StrongText>
              {timeConverter(createdAt / 1000)}
            </span>
          </CardDate>
        </CardDetails>
      </AssessmentDetails>
      <ButtonAndDetail>
        <DetailContainer>
          <AttemptDetails>
            {
              getAttemptsData(reports, assignmentId).length > 1 && (
                <Attempts>
                  <span>
                    {getAttemptsData(reports, assignmentId).length - 1}/{getAttemptsData(reports, assignmentId).length}
                  </span>
                  {
                    isAttemptShow && (
                      <AttemptsTitle onClick={attemptHandler}>
                        &#x2193;&nbsp;&nbsp;Attempts
                      </AttemptsTitle>
                    )
                  }
                  {
                    !isAttemptShow && (
                      <AttemptsTitle onClick={attemptHandler}>
                        &#x2191;&nbsp;&nbsp;Attempts
                      </AttemptsTitle>
                    )
                  }
                </Attempts>
              )
            }
            <AnswerAndScore>
              <span>
                {correctAnswers}/{totalQuestion}
              </span>
              <Title>Correct Answer</Title>
            </AnswerAndScore>
            <AnswerAndScore>
              <span>{score}</span>
              <Title>Score</Title>
            </AnswerAndScore>
          </AttemptDetails>
          <StartAssignButton to={{ pathname: '/home/report/list', testActivityId: _id }}>
            <span>REVIEW</span>
          </StartAssignButton>

        </DetailContainer>
        {
          isAttemptShow && (
            getAttemptsData(reports, assignmentId).map((report, index) => (
              index !== 0 && (
                <AttemptsData key={index}>
                  <RowData>
                    <Attempts>
                      <span>{timeConverter(report.createdAt / 1000)}</span>
                    </Attempts>
                    <AnswerAndScore>
                      <span>{report.correctAnswers ? report.correctAnswers : 0}/{report.totalQuestion ? report.totalQuestion : 0}</span>
                    </AnswerAndScore>
                    <AnswerAndScore>
                      <span>{report.score ? report.score : 0}</span>
                    </AnswerAndScore>
                    <AnswerAndScoreReviewBtn>
                      <Link to={{ pathname: '/home/report/list', testActivityId: report._id }}>
                        <span style={{ color: '#00b0ff', cursor: 'pointer' }}>REVIEW</span>
                      </Link>
                    </AnswerAndScoreReviewBtn>
                  </RowData>
                </AttemptsData>)
            ))
          )
        }

      </ButtonAndDetail>
    </CardWrapper>
  );
};

Report.propTypes = {
  _id: PropTypes.string,
  score: PropTypes.number,
  totalQuestion: PropTypes.number,
  createdAt: PropTypes.string,
  correctAnswers: PropTypes.number,
  reports: PropTypes.array,
  assignments: PropTypes.array,
  assignmentId: PropTypes.number
};

Report.defaultProps = {
  _id: '',
  score: 0,
  totalQuestion: 0,
  createdAt: Date.now(),
  correctAnswers: 0,
  reports: [],
  assignmentId: 0,
  assignments: []
};

const ReportContent = ({ flag, fetchReports, reports, loadAssignments, assignments }) => {
  useEffect(() => {
    loadAssignments();
    fetchReports();
  }, []);
  return (
    <AssignmentsContent flag={flag}>
      <AssignmentContentWrapper>
        {uniqBy(reports, 'assignmentId').map((report, index) => (
          <Report key={index} {...report} reports={reports} assignments={assignments} />
        ))}
      </AssignmentContentWrapper>
    </AssignmentsContent>
  );
};

export default React.memo(
  connect(
    ({ ui, reports, assignments }) => ({ flag: ui.flag, reports: reports.reports, assignments }),
    {
      fetchReports: fetchReportAction,
      loadAssignments: loadAssignmentsAction
    }
  )(ReportContent)
);

ReportContent.propTypes = {
  flag: PropTypes.bool.isRequired,
  fetchReports: PropTypes.func.isRequired,
  reports: PropTypes.array.isRequired,
  loadAssignments: PropTypes.func.isRequired,
  assignments: PropTypes.array.isRequired
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
    img{
      max-width: 100%;
    }
  }
`;

const CardDetails = styled(Col)`
  @media screen and (max-width: 767px) {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 0px;
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

const StrongText = styled.span`
  font-weight: 600;
  padding-left: 10px;
`;

const AttemptDetails = styled(Col)`
  display: flex;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

const StartAssignButton = styled(Link)`
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
    margin-right:0px;
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
    font-size: 31px;
    font-weight: bold;
    color: #434b5d;
  }
  @media screen and (max-width: 767px) {
    width:33%;
  }
`;

const AnswerAndScoreReviewBtn = styled(AnswerAndScore)`
  @media screen and (min-width: 769px) {
    width:200px;
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
    @media screen and (max-width: 767px){
      justify-content: flex-start;
    }
  }
  span {
    font-size: 12px !important;
    font-weight: 600 !important;
    color: #9ca0a9;
  }
`;
