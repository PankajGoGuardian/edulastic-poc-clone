import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { IconPlus } from '@edulastic/icons';
import { greenDark } from '@edulastic/colors';

import AssignmentContentWrapper from '../../commonStyle/assignmentContentWrapper';
import StyledTable from './StyledTable';

class DomainDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      summaryColumns: [{
        title: 'Grade',
        dataIndex: 'grade',
        sorter: true,
        render: grade => <GradeTag>{grade}</GradeTag>,
        width: '15%'
      }, {
        title: 'Topic Name',
        dataIndex: 'domain',
        sorter: true,
        render: domain => `${domain}`,
        width: '45%'
      }, {
        title: 'Percent Score',
        dataIndex: 'percentage',
        sorter: true,
        render: percentage => `${percentage}%`,
        width: '20%'
      }]
    };
  }

  handlerTable = () => {
    this.setState(prevState => ({ isShow: !prevState.isShow }));
  }

  render() {
    const { summary, skillReport } = this.props;
    const { summaryColumns, isShow } = this.state;
    const sumData = [];

    if (summary) {
      summary.standards.map((standard) => {
        const { reportData } = skillReport.reports;
        sumData.push({
          domain: standard.description,
          grade: standard.identifier,
          total: 0,
          percentage: reportData[standard.id] ? reportData[standard.id].score / reportData[standard.id].maxScore * 100 : 0
        });
        return true;
      });
    }

    return (
      <AssignmentContentWrapper
        style={{ paddingTop: 32, paddingBottom: 32 }}
      >
        <Title onClick={() => this.handlerTable()}>
          <RelationTitle>
            {summary.domain}
          </RelationTitle>
          <IconPlus color={greenDark} />
        </Title>
        {
          isShow && (
          <StyledTable
            columns={summaryColumns}
            dataSource={sumData}
          />)
        }
      </AssignmentContentWrapper>
    );
  }
}

DomainDetail.propTypes = {
  summary: PropTypes.object.isRequired,
  skillReport: PropTypes.object.isRequired
};

export default DomainDetail;

const Title = styled.div`
  display: flex;
  cursor: pointer;
`;

const RelationTitle = styled.div`
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: #434b5d;
  margin-bottom: 24px;
`;

const GradeTag = styled.div`
  background: #d7faee;
  height: 23.5px;
  color: #4aac8b;
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 0.2px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
