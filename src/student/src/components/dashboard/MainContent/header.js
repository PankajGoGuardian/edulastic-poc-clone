import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Layout, Row, Col, Select, Icon } from 'antd';
import AssignmentTitle from '../common/assignmentTitle';
import AssignmentFilter from '../common/assignmentFilter';
import AssignmentSelectClass from '../common/assignmentSelectClass';
import FilterBtn from '../common/filterBtn';

const options = ['FFC1', 'FFC2', 'FFC3', 'FFC4', 'FFC5', 'FFC6'];
const { Option } = Select;

const AssignmentSelect = () => (
  <AssignmentSelectClass>
    <ClassLabel>class</ClassLabel>
    <Select style={{ width: 120 }} suffixIcon={<Icon type="caret-down" className="topbarDropDown" theme="outlined" />}>
      {options.map(option => (
        <Option value={option}>{option}</Option>
      ))}
    </Select>
  </AssignmentSelectClass>
);

const Header = ({ flag }) => (
  <AssignmentsHeader flag={flag}>
    <Row>
      <Col span={24}>
        <Wrapper>
          <AssignmentTitle>Assignments</AssignmentTitle>
          <AssignmentSelect />
        </Wrapper>
        <AssignmentFilter>
          <FilterBtn>
            <span>6</span> All
          </FilterBtn>
          <FilterBtn>
            <span>6</span> In progress
          </FilterBtn>
          <FilterBtn>
            <span>6</span> Not Started
          </FilterBtn>
          <FilterBtn>
            <span>6</span> Submitted
          </FilterBtn>
          <FilterBtn>
            <span>6</span> Graded
          </FilterBtn>
        </AssignmentFilter>
      </Col>
    </Row>
  </AssignmentsHeader>
);
export default React.memo(connect(({ ui }) => ({ flag: ui.flag }))(Header));

Header.propTypes = {
  flag: PropTypes.bool.isRequired,
};

const AssignmentsHeader = styled(Layout.Header)`
  background-color: #0288d1;
  height: 89.1px;
  color: #ffffff;
  
  .ant-col-24{
    align-items: center;
    line-height: 1.2;
    height: 90px;
    display: flex;
  }

  @media (max-width: 1300px) {
    height: 135px;
    padding: 15px 30px;
    
    .ant-col-24{
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      height: 100px;
    }
  }
`;

const Wrapper = styled.div`
  display: flex;
  width: 45%;
  justify-content: space-between;
  align-items: center;
  font-size: 17px;

  @media screen and (max-width: 1420px){
    width: 40%;
  }
  @media screen and (max-width: 767px){
    width: 100%;
    justify-content: flex-start;
    
    .anticon-bars{
      font-size: 17px;
      padding-right: 25px;
    }
  }
`;

const ClassLabel = styled.span`
  width: 78px;
  background-color: #e5e5e5;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Open Sans;
  font-size: 14px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.36;
  letter-spacing: 0.3px;
  color: #434b5d;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  
  @media (max-width: 768px) {
    width: 65px;
  }
`;
