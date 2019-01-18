import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled, { withTheme } from 'styled-components';
import { withNamespaces } from '@edulastic/localization';
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
  assignments,
  theme,
  t
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
              type={theme.assignment.cardTimeIconType}
            />
            <span>
              <StrongText>{t('common.finishedIn')} </StrongText>
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
                    {getAttemptsData(reports, assignmentId).length - 1}
                    /{getAttemptsData(reports, assignmentId).length}
                  </span>
                  {
                    isAttemptShow && (
                      <AttemptsTitle onClick={attemptHandler}>
                        &#x2193;&nbsp;&nbsp;{t('common.attemps')}
                      </AttemptsTitle>
                    )
                  }
                  {
                    !isAttemptShow && (
                      <AttemptsTitle onClick={attemptHandler}>
                        &#x2191;&nbsp;&nbsp;{t('common.attemps')}
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
              <Title>{t('common.correctAnswer')}</Title>
            </AnswerAndScore>
            <AnswerAndScore>
              <span>{score}</span>
              <Title>{t('common.score')}</Title>
            </AnswerAndScore>
          </AttemptDetails>
          <StartAssignButton to={{ pathname: '/home/report/list', testActivityId: _id, title }}>
            <span>{t('common.review')}</span>
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
                      <span>{report.correctAnswers ? report.correctAnswers : 0}
                        /{report.totalQuestion ? report.totalQuestion : 0}
                      </span>
                    </AnswerAndScore>
                    <AnswerAndScore>
                      <span>{report.score ? report.score : 0}</span>
                    </AnswerAndScore>
                    <AnswerAndScoreReviewBtn>
                      <Link to={{ pathname: '/home/report/list', testActivityId: report._id, title }}>
                        <div>{t('common.review')}</div>
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
  assignmentId: PropTypes.number,
  theme: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
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

const ReportContent = ({ flag, fetchReports, reports, loadAssignments, assignments, theme, t }) => {
  useEffect(() => {
    loadAssignments();
    fetchReports();
  }, []);
  return (
    <AssignmentsContent flag={flag}>
      <AssignmentContentWrapper>
        {uniqBy(reports, 'assignmentId').map((report, index) => (
          <Report
            theme={theme}
            t={t}
            key={index}
            {...report}
            reports={reports}
            assignments={assignments}
          />
        ))}
      </AssignmentContentWrapper>
    </AssignmentsContent>
  );
};

const enhance = compose(
  withTheme,
  React.memo,
  withNamespaces('assignmentCard'),
  connect(
    ({ ui, reports, assignments }) => ({ flag: ui.flag, reports: reports.reports, assignments }),
    {
      fetchReports: fetchReportAction,
      loadAssignments: loadAssignmentsAction
    }
  )
);

export default enhance(ReportContent);

ReportContent.propTypes = {
  flag: PropTypes.bool.isRequired,
  fetchReports: PropTypes.func.isRequired,
  reports: PropTypes.array.isRequired,
  loadAssignments: PropTypes.func.isRequired,
  assignments: PropTypes.array.isRequired,
  theme: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
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
    background-color: ${props => props.theme.assignment.cardRetakeBtnBgHoverColor};
    span {
      color: ${props => props.theme.assignment.cardRetakeBtnTextHoverColor};
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
    font-size: ${props => props.theme.assignment.cardAnswerAndScoreTextSize};
    font-weight: bold;
    color: ${props => props.theme.assignment.cardAnswerAndScoreTextColor};
  }
  @media screen and (max-width: 767px) {
    width:33%;
  }
`;

const AnswerAndScoreReviewBtn = styled(AnswerAndScore)`
  div {
    display: inline-block;
    font-size: ${props => props.theme.assignment.attemptsRowReviewLinkSize};
    color: ${props => props.theme.assignment.attemptsRowReviewLinkColor};
    cursor: pointer;
  }
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
    background-color: ${props => props.theme.assignment.attemptsReviewRowBgColor};
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    @media screen and (max-width: 767px){
      justify-content: flex-start;
    }
  }
  span {
    font-size: ${props => props.theme.assignment.attemptsReviewRowFontSize};
    font-weight: 600;
    color: ${props => props.theme.assignment.attemptsReviewRowTextColor};
  }
`;
