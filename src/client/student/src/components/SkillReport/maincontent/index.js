import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

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
        render: percentage => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {(Math.round(percentage * 10) / 10).toFixed(1)}%
            <Circle percentage={percentage} />
          </div>
        ),
        width: '20%'
      }, {
        title: 'Hints',
        dataIndex: 'hints',
        sorter: true,
        render: hints => `${hints}`,
        width: '20%'
      }]
    };
  }

  render() {
    const { skillReport } = this.props;
    const { summaryColumns } = this.state;
    const sumData = [];
    if (skillReport) {
      skillReport.reports.curriculum.domains.map((domain) => {
        const { reportData } = skillReport.reports;
        sumData.push({
          domain: domain.description,
          standards: domain.standards,
          total: reportData[domain.id].totalQuestions,
          hints: reportData[domain.id].hints,
          percentage: reportData[domain.id].score / reportData[domain.id].maxScore * 100
        });
        return true;
      });
    }
    return (
      <SkillReportContainer>
        <AssignmentContentWrapper style={{ paddingTop: 32, paddingBottom: 32 }}>
          <SummaryTitle>
            Skill Summary
          </SummaryTitle>
          <StyledTable
            columns={summaryColumns}
            dataSource={sumData}
          />
        </AssignmentContentWrapper>
        {
          sumData.map((summary, index) => (
            <DomainDetail summary={summary} skillReport={skillReport} key={index} />
          ))
        }
      </SkillReportContainer>
    );
  }
}

SkillReportMainContent.propTypes = {
  skillReport: PropTypes.object.isRequired
};

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

const Circle = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background: ${props => (props.percentage > 30 ? '#fdcc3b' : '#ee1658')};
  margin-left: 18px;
`;
