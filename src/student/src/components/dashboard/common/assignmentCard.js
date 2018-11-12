import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Row, Col, Icon } from 'antd';

const AssignmentCard = ({ data }) => (
  <CardWrapper>
    <Col span={4}>
      <ImageWrapper>
        <img src={data.thumbnail} alt="" />
      </ImageWrapper>
    </Col>
    <Col span={15}>
      <CardTitle>{data.title}</CardTitle>
      <CardDate>
        <Icon
          type="clock-circle"
          theme="outlined"
          style={{ color: '#ea326b' }}
        />
        <span>
          <span className="bold"> Due on</span>
          {data.updatedDate}
        </span>
      </CardDate>
      <div>
        <StatusButton>NOT STARTED</StatusButton>
      </div>
    </Col>
    <Col span={5}>
      <Link to={`/student/test/${data.id}`}>
        <StartAssignButton>Start Assignment</StartAssignButton>
      </Link>
    </Col>
  </CardWrapper>
);

export default AssignmentCard;

AssignmentCard.propTypes = {
  data: PropTypes.object.isRequired,
};

const CardWrapper = styled(Row)`
  display: flex;
  align-items: center;
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
  font-family: Open Sans;
  font-size: 13px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.38;
  letter-spacing: normal;
  text-align: left;
  color: #444444;
  padding-bottom: 6px;

  .bold {
    font-weight: 600;
    padding-left: 10px;
  }

  @media screen and (max-width: 767px) {
    font-size: 14px;
    line-height: 1.4;
    text-align: center;
    margin-top: 6px;
  }
`;

const StatusButton = styled.button`
  width: 107.4px;
  height: 23.5px;
  border-radius: 5px;
  border: solid 1px #b1b1b1;
  font-family: Open Sans;
  font-size: 8px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.38;
  letter-spacing: 0.1px;
  text-align: center;
  color: #878282;
  padding: 6px 24px;

  @media screen and (max-width: 767px) {
    width: auto;
    display: inline-block;
    margin-top: 10px;
    font-size: 10px;
  }
`;

const StartAssignButton = styled.button`
  max-width: 199.7px;
  height: 50px;
  border-radius: 65px;
  font-family: Open Sans;
  font-size: 12px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.42;
  letter-spacing: 0.2px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  border: solid 1px #12a6e8;
  color: #00b0ff;
  width: 100%;
  padding: 5px 20px;
  cursor: pointer;
  float: right;
  &.selected {
    background-color: #00b0ff;
    color: #ffffff;
  }
  :hover {
    background: #0288d1;
    color: #ffffff;
  }
  &.selected:hover {
    background: #1fb6e3;
    border-color: #1fb6e3;
  }

  @media screen and (max-width: 767px) {
    font-size: 14px;
    line-height: 1.4;
    margin: 0 auto;
    float: unset;
    margin-top: 15px;
  }
`;
