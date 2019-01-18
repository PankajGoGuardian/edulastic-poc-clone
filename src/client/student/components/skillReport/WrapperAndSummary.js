import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withNamespaces } from '@edulastic/localization';
import * as S from './styled';
import StyledTable from '../../styled/Table';
import TableSection from './SkillTableSection';

const computeColumns = t => [
  {
    title: t('common.tableHeaderTitleDomains'),
    dataIndex: 'domain',
    sorter: (a, b) => a.domain.length - b.domain.length,
    render: domain => `${domain}`,
    width: '40%'
  },
  {
    title: t('common.tableHeaderTitleTotalQuestions'),
    dataIndex: 'total',
    sorter: (a, b) => a.total - b.total,
    render: total => `${total}`,
    width: '20%'
  },
  {
    title: t('common.tableHeaderTitlePercentage'),
    dataIndex: 'percentage',
    sorter: (a, b) => a.percentage - b.percentage,
    render: percentage => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {(Math.round(percentage * 10) / 10).toFixed(1)}%
        <S.Circle percentage={percentage} />
      </div>
    ),
    width: '20%'
  },
  {
    title: t('common.tableHeaderTitleHints'),
    dataIndex: 'hints',
    sorter: (a, b) => a.hints - b.hints,
    render: hints => `${hints}`,
    width: '20%'
  }
];

const SkillReportMainContent = ({ skillReport, t }) => {
  const summaryColumns = computeColumns(t);
  let sumData = [];
  
  if (skillReport) {
    const { reportData } = skillReport.reports;
    sumData = skillReport.reports.curriculum.domains.map(domain => ({
      domain: domain.description,
      standards: domain.standards,
      total: reportData[domain.id].totalQuestions,
      hints: reportData[domain.id].hints,
      percentage:
          (reportData[domain.id].score / reportData[domain.id].maxScore) * 100
    }));
  }
  return (
    <S.SkillReportContainer>
      <S.AssignmentContentWrap>
        <S.SummaryTitle>{t('common.skillSummary')}</S.SummaryTitle>
        <StyledTable columns={summaryColumns} dataSource={sumData} />
      </S.AssignmentContentWrap>
      {sumData.map((summary, index) => (
        <TableSection
          summary={summary}
          skillReport={skillReport}
          key={index}
        />
      ))}
    </S.SkillReportContainer>
  );
};

SkillReportMainContent.propTypes = {
  skillReport: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

const enhance = compose(withNamespaces('reports'));

export default enhance(SkillReportMainContent);
