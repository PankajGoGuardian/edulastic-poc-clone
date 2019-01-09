import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { Row, Col, Icon, Button } from 'antd';

import { initiateTestActivityAction } from '../../../actions/test';


const AssignmentCard = ({
  initiateTestActivity,
  data: {
    _id,
    endDate,
    testId,
    test
  },
  reports,
  history,
  theme
}) => {
  const startTest = () => {
    initiateTestActivity(testId, _id);
    history.push(`/student/test/${testId}`);
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

  const timeConverter = (data) => {
    const a = new Date(data);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const hour = a.getHours();
    const min = a.getMinutes();
    const time = hour > 11 ? `${month} ${date}, ${year} ${hour - 12}:${min} PM` : `${month} ${date}, ${year} ${hour}:${min} AM`;
    return time;
  };

  const attemptsData = getAttemptsData(reports, _id);
  return (
    <CardWrapper>
      <Col span={3}>
        <ImageWrapper>
          <img src={test && test.thumbnail} alt="" />
        </ImageWrapper>
      </Col>
      <Col span={16}>
        <CardTitle>{test && test.title}</CardTitle>
        <CardDate>
          <Icon
            type={theme.assignment.cardTimeIconType}
          // theme="outlined"
          />
          <span>
            <b> &nbsp; Due on </b> {timeConverter(endDate)}
          </span>
        </CardDate>
        <div>
          <StatusButton isSubmitted={attemptsData.length > 0}>
            <span>{attemptsData.length > 0 ? 'SUBMITTED' : 'NOT STARTED'}</span>
          </StatusButton>
        </div>
      </Col>
      <FlexCol span={5}>
        <DetailContainer>
          <StartAssignButton onClick={startTest}>
            {attemptsData.length === 0 && <span>START ASSIGNMENT</span>}
            {attemptsData.length > 0 && <span>RETAKE</span>}
          </StartAssignButton>
        </DetailContainer>
      </FlexCol>
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
  padding-bottom: 27.8px;
  padding-top: 27.8px;
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
    display: block;
    text-align: center;

    & > div {
      width: 100%;
    }
    img {
      max-width: 100%;
      width: 100%;
    }
    .ant-col-14 {
      width: 100%;
      margin: 25px 0px;
    }
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
    margin-right: 0px;
    max-height: 180px;
  }
  @media screen and (max-width: 500px) {
    max-height: 90.5px;
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

  @media screen and (max-width: 767px) {
    text-align: center;
    margin-top: 6px;
  }
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

  @media screen and (max-width: 767px) {
    font-size: 14px;
    line-height: 1.4;
    text-align: center;
    margin-top: 6px;
  }
`;

const StatusButton = styled.div`
  width: 135px;
  height: 23.5px;
  border-radius: 5px;
  background-color: ${props => (
    props.isSubmitted ?
      props.theme.assignment.cardSubmitLabelBgColor :
      props.theme.assignment.cardNotStartedLabelBgColor
  )};
  font-size: ${props => props.theme.assignment.cardSubmitLabelFontSize};
  font-weight: bold;
  line-height: 1.38;
  letter-spacing: 0.2px;
  text-align: center;
  padding: 6px 24px;

  span {
    position: relative;
    top: -1px;
    color: ${props => (
    props.isSubmitted ?
      props.theme.assignment.cardSubmitLabelTextColor :
      props.theme.assignment.cardNotStartedLabelTextColor
  )};
  }

  @media screen and (max-width: 767px) {
    width: auto;
    display: inline-block;
    margin-top: 10px;
    font-size: 10px;
  }
`;

const StartAssignButton = styled(Button)`
  max-width: 200px;
  height: 40px;
  margin-left: 15px;
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

  @media screen and (max-width: 767px) {
    font-size: 14px;
    line-height: 1.4;
    margin: 0 auto;
    float: unset;
    margin-top: 15px;
  }
`;

const DetailContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 13px;
`;

const FlexCol = styled(Col)`
  display: flex;
  flex-direction: column;
`;
