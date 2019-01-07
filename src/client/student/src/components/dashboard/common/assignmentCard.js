import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
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
  history
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
      <Col span={4}>
        <ImageWrapper>
          <img src={test && test.thumbnail} alt="" />
        </ImageWrapper>
      </Col>
      <Col span={5} style={{ marginLeft: 15 }}>
        <CardTitle>{test && test.title}</CardTitle>
        <CardDate>
          <Icon
            type="clock-circle"
            theme="outlined"
            style={{ color: '#ee1658' }}
          />
          <span>
            <span className="bold">Due on&nbsp;</span>
            {timeConverter(endDate)}
          </span>
        </CardDate>
        <div>
          <StatusButton isSubmitted={attemptsData.length > 0}>
            <span>{attemptsData.length > 0 ? 'SUBMITTED' : 'NOT STARTED'}</span>
          </StatusButton>
        </div>
      </Col>
      <FlexCol span={15}>
        <DetailContainer>
          <StartAssignButton onClick={startTest}>
            { attemptsData.length === 0 && <span>START ASSIGNMENT</span> }
            { attemptsData.length > 0 && <span>RETAKE</span> }
          </StartAssignButton>
        </DetailContainer>
      </FlexCol>
    </CardWrapper>
  );
};

export default withRouter(connect(
  null,
  {
    initiateTestActivity: initiateTestActivityAction
  }
)(AssignmentCard));

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
    height: 90px;
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

  @media screen and (max-width: 767px) {
    text-align: center;
    margin-top: 6px;
  }
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

  .bold {
    font-weight: 600;
    padding-left: 10px;
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
  background-color: ${props => (props.isSubmitted ? 'rgba(154, 0, 255, 0.2)' : 'rgba(0, 176, 255, 0.2)')};
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
  border: solid 1px #12a6e8;
  width: 100%;
  padding: 5px 20px;
  cursor: pointer;
  float: right;

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
