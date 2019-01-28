import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withNamespaces } from '@edulastic/localization';
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
    render: percentage => <S.StyledProgress percent={percentage} />,
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
      const { reportData } = skillReport.reports;
      const summaryStandards = summary.standards.filter(
        std => reportData[std.id]
      );
      score = summaryStandards.reduce(
        (acc, std) => acc + reportData[std.id].score,
        0
      );
      maxScore = summaryStandards.reduce(
        (acc, std) => acc + reportData[std.id].maxScore,
        0
      );
      // or
      // score = summary.standards.reduce((accumulator,current)=>{
      //   if(reportData[current.id]){
      //     return accumulator+reportData[current.id].score;
      //   } else {
      //     return accumulator;
      //   }
      // },0)

      sumData = summary.standards.map(standard => ({
        domain: standard.description,
        grade: standard.identifier,
        total: 0,
        percentage: reportData[standard.id]
          ? (reportData[standard.id].score / reportData[standard.id].maxScore) *
            100
          : 0
      }));
    }

    return (
      <S.AssignmentContentWrap>
        <S.Title onClick={this.handlerTable} data-cy="ratio">
          <S.RelationTitle>{summary.domain}</S.RelationTitle>
          <S.StyledScoreProgress
            percent={Math.round((score / maxScore) * 100)}
          />
          {isShow ? <S.IconClose /> : <S.IconOpen color={greenDark} />}
        </S.Title>
        {isShow && <StyledTable columns={columns} dataSource={sumData} />}
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
