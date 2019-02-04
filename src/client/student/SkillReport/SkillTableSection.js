import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withNamespaces } from '@edulastic/localization';
import { Progress } from 'antd';
import styled from 'styled-components';
import { greenDark } from '@edulastic/colors';
import StyledTable from '../styled/Table';
import * as S from './styled';

const computeColumns = t => [
  {
    title: t('common.tableHeaderTitleGrade'),
    dataIndex: 'grade',
    sorter: (a, b) => a.grade - b.grade,
    render: grade => <S.GradeTag>{grade}</S.GradeTag>,
    width: '15%'
  },
  {
    title: t('common.tableHeaderTitleTopicName'),
    dataIndex: 'domain',
    sorter: (a, b) => a.domain.length - b.domain.length,
    render: domain => `${domain}`,
    width: '45%'
  },
  {
    title: t('common.tableHeaderTitlePercentScore'),
    dataIndex: 'percentage',
    sorter: (a, b) => a.percentage - b.percentage,
    render: percentage =>
      percentage === null ? (
        '-'
      ) : (
        <StyledProgress
          percent={(Math.round(percentage * 10) / 10).toFixed(1)}
        />
      ),
    width: '20%'
  }
];

class DomainDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false
    };
  }

  handlerTable = () => {
    this.setState(prevState => ({ isShow: !prevState.isShow }));
  };

  render() {
    const { summary, skillReport, t } = this.props;
    const { isShow } = this.state;
    const columns = computeColumns(t);
    let sumData = [];
    let score = 0;
    let maxScore = 0;
    if (summary) {
      const getStandardsScoreDetails = id =>
        skillReport.reports.reportData.standardLevel.filter(
          item => item.standard_id === id
        );
      sumData = summary.standards.map(standard => {
        const standardsData = getStandardsScoreDetails(standard._id)[0] || null;
        score += standardsData ? standardsData.score : 0;
        maxScore += standardsData ? standardsData.max_points : 0;
        return {
          domain: standard.description || '-',
          grade: standard.identifier || '-',
          total: standardsData ? standardsData.score : '-',
          percentage: standardsData
            ? (standardsData.score / standardsData.max_points) * 100
            : null
        };
      });
    }

    return (
      <S.AssignmentContentWrap>
        <S.Title onClick={this.handlerTable}>
          <S.RelationTitle>{summary.domain}</S.RelationTitle>
          <StyledScoreProgress percent={Math.round((score / maxScore) * 100)} />
          {isShow ? <S.IconClose /> : <S.IconOpen color={greenDark} />}
        </S.Title>
        {isShow && (
          <StyledTable
            columns={columns}
            dataSource={sumData}
            pagination={false}
          />
        )}
      </S.AssignmentContentWrap>
    );
  }
}

DomainDetail.propTypes = {
  summary: PropTypes.object.isRequired,
  skillReport: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

const enhance = compose(withNamespaces('reports'));

export default enhance(DomainDetail);

export const StyledScoreProgress = styled(Progress)`
  width: 220px;
  margin-right: 40px;
  height: 16px;
  .ant-progress-inner {
    height: 16px;
  }
  .ant-progress-bg {
    height: 16px !important;
    background: ${props =>
      props.percent >= 50
        ? props.theme.skillReport.greenColor
        : props.percent >= 30
        ? props.theme.skillReport.yellowColor
        : props.theme.skillReport.redColor};
  }
`;

export const StyledProgress = styled(Progress)`
  height: 16px;
  .ant-progress-inner {
    height: 16px;
  }
  .ant-progress-bg {
    height: 16px !important;
    background: ${props =>
      props.percent >= 50
        ? props.theme.skillReport.greenColor
        : props.percent >= 30
        ? props.theme.skillReport.yellowColor
        : props.theme.skillReport.redColor};
  }
`;
