import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Button, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import { uniqBy, map } from 'lodash';
import { IconClockCircularOutline } from '@edulastic/icons';
import AssignmentsContent from '../../commonStyle/assignmentContent';
import { fetchReportAction } from '../../../actions/report';
import { loadAssignmentsAction } from '../../../actions/dashboard';

import AssignmentContentWrapper from '../../commonStyle/assignmentContentWrapper';

const Report = ({ _id, score, totalQuestion, createdAt, correctAnswers, assignmentId, reports, assignments }) => {
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

  const getAttemptsData = (array, id) => {
    const data = [];
    map(array, (o) => {
      if (o.assignmentId === id) {
        data.push(o);
      }
    });
    return data;
  };

  const attemptHandler = () => {
    setIsAttemptShow(!isAttemptShow);
  };

  const getTestDetail = () => {
    let title;
    let thumbnail;
    assignments.map((assignment) => {
      if (assignment._id === assignmentId) {
        title = assignment.test.title;
        thumbnail = assignment.test.thumbnail;
      }
    });
    return { title, thumbnail };
  };

  return (
    <Wrapper>
      <Col span={4}>
        <ImageWrapper>
          <img src={getTestDetail().thumbnail} alt="" />
        </ImageWrapper>
      </Col>
      <Col span={5} style={{ marginLeft: 15 }}>
        <AssignmentSummary>
          <AssignmentSubject>{getTestDetail().title}</AssignmentSubject>
          <AssignmentDuedate>
            <Icon color="#ee1658" />
            <DueText>
              <StrongText>Finished in&nbsp;</StrongText>
              {timeConverter(createdAt / 1000)}
            </DueText>
          </AssignmentDuedate>
        </AssignmentSummary>
      </Col>
      <Col span={15}>
        <DetailContainer>
          <Detail>
            {
              getAttemptsData(reports, assignmentId).length > 1 && (
                <div style={{ width: 150 }}>
                  <CorrectAns>
                    {getAttemptsData(reports, assignmentId).length - 1}/{getAttemptsData(reports, assignmentId).length}
                  </CorrectAns>
                  {
                    isAttemptShow && (
                      <AttemptText onClick={attemptHandler}>
                        &#x2193;&nbsp;&nbsp;Attempts
                      </AttemptText>
                    )
                  }
                  {
                    !isAttemptShow && (
                      <AttemptText onClick={attemptHandler}>
                        &#x2191;&nbsp;&nbsp;Attempts
                      </AttemptText>
                    )
                  }
                </div>
              )
            }
            <div style={{ width: 130 }}>
              <CorrectAns>
                {correctAnswers}/{totalQuestion}
              </CorrectAns>
              <CorrectText>Correct Answer</CorrectText>
            </div>
            <div style={{ width: 130 }}>
              <CorrectAns>{score}</CorrectAns>
              <CorrectText>Score</CorrectText>
            </div>
            <StartAssignmentBtn>
              <Link to={{ pathname: '/home/report/list', testActivityId: _id }}>
                <ReviewButton>
                  <span className="review">REVIEW</span>
                  <span className="retake">RETAKE</span>
                </ReviewButton>
              </Link>
            </StartAssignmentBtn>
          </Detail>
          {
            isAttemptShow && (
              getAttemptsData(reports, assignmentId).map((report, index) => (
                index !== 0 && (
                <AttemptContainer key={index}>
                  <AttemptTag style={{ width: 150, borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}>
                    {timeConverter(report.createdAt / 1000)}
                  </AttemptTag>
                  <AttemptTag style={{ fontSize: 16, fontWeight: 600 }}>
                    {report.correctAnswers ? report.correctAnswers : 0}/{report.totalQuestion ? report.totalQuestion : 0}
                  </AttemptTag>
                  <AttemptTag style={{ fontSize: 16, fontWeight: 600 }}>
                    {report.score ? report.score : 0}
                  </AttemptTag>
                  <Link to={{ pathname: '/home/report/list', testActivityId: report._id }}>
                    <ReviewTag style={{ borderTopRightRadius: 4, borderBottomRightRadius: 4 }}>
                      REVIEW
                    </ReviewTag>
                  </Link>
                </AttemptContainer>)
              ))
            )
          }
        </DetailContainer>
      </Col>
    </Wrapper>
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
    <AssignmentsContent style={{ zIndex: 1 }} flag={flag}>
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

const CorrectAns = styled.p`
   {
    margin: 0rem;
    font-weight: bold;
    font-size: 31px;
    text-align: center;
    color: #434b5d;
  }
`;
const CorrectText = styled.p`
  margin: 0rem;
  text-align: center;
  color: #434b5;
  font-size: 12px;
  font-weight: 600;
`;

const AttemptText = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #12a6e8;
  text-align: center;
  cursor: pointer;
`;

const Wrapper = styled(Row)`
  width: 100%;
  display: flex;
  padding: 30px 0px;
  padding-right: 20px;
  border-bottom: 1px solid #f2f2f2;
  justify-content: space-between;
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
  display: flex;
  align-items: center;
  margin-top: 0rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  @media (max-width: 900px) {
    margin-bottom: 1.2rem;
  }
`;

const DueText = styled.span`
  vertical-align: middle;
  font-size: 13px;
  color: #444444;
`;

const StrongText = styled.span`
  font-weight: 600;
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

const ReviewButton = styled(Button)`
  width: 200px;
  height: 40px;
  border-radius: 4px;
  border: 1px solid #12a6e8;
  span {
    color: #12a6e8;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2px;
  }

  .retake { display: none; }

  &:hover {
    background: #12a6e8;
    span {
      color: #ffffff;
    }
    .review { display: none; }
    .retake { display: inline; }
  }
`;

const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Detail = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  justify-content: flex-end;
`;

const AttemptContainer = styled.div`
  display: flex;
  margin-bottom: 7px;
  justify-content: flex-end;
`;

const AttemptTag = styled.div`
  width: 130px;
  height: 30px;
  font-size: 12px;
  color: #9ca0a9;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ReviewTag = styled.div`
  width: 200px;
  height: 30px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: #00b0ff;
  background: #f8f8f8;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImageWrapper = styled.div`
  max-width: 168.5px;
  max-height: 90.5px;
  overflow: hidden;
  border-radius: 10px;
  margin-right: 20px;

  img {
    max-width: 168.5px;
    border-radius: 10px;
    width: 100%;
    height: 90px;
  }

  @media screen and (max-width: 767px) {
    max-width: 100%;
    margin-right: 0px;
    max-height: 180px;
  }
  @media screen and (max-width: 500px) {
    max-height: 90.5px;
  }
`;
