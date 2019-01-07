import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Select } from 'antd';
import AssignmentTitle from '../common/assignmentTitle';
import AssignmentSelectClass from '../common/assignmentSelectClass';
import HeaderWrapper from '../../../headerWrapper';

const options = ['FFC1', 'FFC2', 'FFC3', 'FFC4', 'FFC5', 'FFC6'];
const { Option } = Select;

const AssignmentSelect = () => (
  <AssignmentSelectClass>
    <ClassLabel>Class</ClassLabel>
    <Select defaultValue="FFC1">
      {options.map((option, i) => (
        <Option key={i} value={option}>
          {option}
        </Option>
      ))}
    </Select>
  </AssignmentSelectClass>
);

const Header = ({ flag }) => (
  <HeaderWrapper flag={flag}>
    <Wrapper>
      <AssignmentTitle>Dashboard</AssignmentTitle>
      <AssignmentSelect />
    </Wrapper>
  </HeaderWrapper>
);
export default connect(({ ui }) => ({ flag: ui.flag }))(Header);

Header.propTypes = {
  flag: PropTypes.bool.isRequired
};

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  font-size: 17px;
  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ClassLabel = styled.span`
  display: flex;
  font-size: 13px;
  font-weight: 600;
  margin-right: 30px;
  align-items: center;
  letter-spacing: 0.2px;

  @media (max-width: 768px) {
    width: 65px;
    width: auto;
    margin-right: 10px;
  }
`;
