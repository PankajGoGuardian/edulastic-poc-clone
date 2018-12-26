import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Layout, Row, Col, Select, Affix } from 'antd';
import AssignmentTitle from '../common/assignmentTitle';
import AssignmentSelectClass from '../common/assignmentSelectClass';

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
  <Affix>
    <AssignmentsHeader flag={flag}>
      <Row style={{ width: '100%' }}>
        <Col span={24}>
          <Wrapper>
            <AssignmentTitle>Assignments</AssignmentTitle>
            <AssignmentSelect />
          </Wrapper>
        </Col>
      </Row>
    </AssignmentsHeader>
  </Affix>
);
export default React.memo(connect(({ ui }) => ({ flag: ui.flag }))(Header));

Header.propTypes = {
  flag: PropTypes.bool.isRequired
};

const AssignmentsHeader = styled(Layout.Header)`
  display: flex;
  align-items: center;
  background-color: #0288d1;
  height: 62px;
  color: #ffffff;

  .ant-col-24 {
    align-items: center;
    line-height: 1.2;
    display: flex;
  }
`;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  font-size: 17px;
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
  }
`;
