import React, { memo } from 'react';
import styled from 'styled-components';
import { Affix, Select, Layout, Row, Col } from 'antd';
import AssignmentSelectClass from '../../commonStyle/assignmentSelectClass';
import AssignmentTitle from '../../assignments/common/assignmentTitle';


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

const SkillReportHeader = () => (
  <Affix>
    <AssignmentsHeader>
      <Row style={{ width: '100%' }}>
        <Col span={24}>
          <Wrapper>
            <AssignmentTitle>Skill Report</AssignmentTitle>
            <AssignmentSelect />
          </Wrapper>
        </Col>
      </Row>
    </AssignmentsHeader>
  </Affix>
);

export default memo(SkillReportHeader);

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
