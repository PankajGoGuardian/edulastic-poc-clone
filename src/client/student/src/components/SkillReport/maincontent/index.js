import React, { Component } from 'react';
import styled from 'styled-components';

import AssignmentContentWrapper from '../../commonStyle/assignmentContentWrapper';
import StyledTable from '../common/StyledTable';
import DomainDetail from '../common/DomainDetail';

class SkillReportMainContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      summaryColumns: [{
        title: 'Domains',
        dataIndex: 'domain',
        sorter: true,
        render: domain => `${domain}`,
        width: '40%'
      }, {
        title: 'Total Questions',
        dataIndex: 'total',
        sorter: true,
        render: total => `${total}`,
        width: '20%'
      }, {
        title: 'Percentage',
        dataIndex: 'percentage',
        sorter: true,
        render: percentage => `${percentage}`,
        width: '20%'
      }, {
        title: 'Hints',
        dataIndex: 'hints',
        sorter: true,
        render: hints => `${hints}`,
        width: '20%'
      }],
      summaryData: [{
        domain: 'Ratios & Proportional Relationships',
        total: 30,
        percentage: 38.7,
        hints: 26
      }, {
        domain: 'Ratios & Proportional Relationships',
        total: 30,
        percentage: 38.7,
        hints: 26
      }, {
        domain: 'Ratios & Proportional Relationships',
        total: 30,
        percentage: 38.7,
        hints: 26
      }, {
        domain: 'Ratios & Proportional Relationships',
        total: 30,
        percentage: 38.7,
        hints: 26
      }]
    };
  }

  render() {
    const { summaryColumns, summaryData } = this.state;
    return (
      <SkillReportContainer>
        <AssignmentContentWrapper style={{ paddingTop: 32, paddingBottom: 32 }}>
          <SummaryTitle>
            Skill Summary
          </SummaryTitle>
          <StyledTable
            columns={summaryColumns}
            dataSource={summaryData}
          />
        </AssignmentContentWrapper>
        {
          summaryData.map((summary, index) => (
            <DomainDetail summary={summary} key={index} />
          ))
        }
      </SkillReportContainer>
    );
  }
}

export default SkillReportMainContent;

const SkillReportContainer = styled.div`
  padding: 30px 50px;
`;

const SummaryTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #4aac8b;
  letter-spacing: 0.3px;
  margin-bottom: 24px;
`;
