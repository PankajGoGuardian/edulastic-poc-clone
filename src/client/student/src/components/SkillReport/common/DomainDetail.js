import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Progress } from 'antd';
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
        sorter: (a, b) => a.grade - b.grade,
        render: grade => <GradeTag>{grade}</GradeTag>,
        width: '15%'
      }, {
        title: 'Topic Name',
        dataIndex: 'domain',
        sorter: (a, b) => a.domain.length - b.domain.length,
        render: domain => `${domain}`,
        width: '45%'
      }, {
        title: 'Percent Score',
        dataIndex: 'percentage',
        sorter: (a, b) => a.percentage - b.percentage,
        render: percentage => <StyledProgress percent={percentage} />,
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
    let score = 0;
    let maxScore = 0;
    if (summary) {
      summary.standards.map((standard) => {
        const { reportData } = skillReport.reports;
        sumData.push({
          domain: standard.description,
          grade: standard.identifier,
          total: 0,
          percentage: reportData[standard.id] ? reportData[standard.id].score / reportData[standard.id].maxScore * 100 : 0
        });
        score += reportData[standard.id] && reportData[standard.id].score;
        maxScore += reportData[standard.id] && reportData[standard.id].maxScore;
        return true;
      });
    }

    return (
      <AssignmentContentWrapper
        style={{ paddingTop: 32, paddingBottom: 32 }}
      >
        <Title onClick={this.handlerTable}>
          <RelationTitle>
            {summary.domain}
          </RelationTitle>
          <StyledScoreProgress percent={Math.round(score / maxScore * 100)} />
          {isShow ? <IconClose /> : <IconOpen color={greenDark} />}
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
  @media screen and (max-width: 767px) {
    flex-direction: column;
    position:relative;
  }
`;

const RelationTitle = styled.div`
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: #434b5d;
  margin-bottom: 24px;
  @media screen and (max-width: 767px) {
    width: 90%;
  }
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

export const IconClose = styled.div`
  position: relative;
  cursor: pointer;
  width: 17.7px;
  height: 3.4px;
  background-color: #4aac8b;
  margin-top: 10px;
  @media screen and (max-width: 767px) {
    position:absolute;
    top:0px;
    right:0px;
  }
`;

export const IconOpen = styled(IconPlus)`
  margin-top: 5px;
  @media screen and (max-width: 767px) {
    position:absolute;
    top:0px;
    right:0px;
  }
`;

export const StyledScoreProgress = styled(Progress)`
  width: 220px;
  margin-right: 40px;
  height: 16px;
  .ant-progress-inner {
    height: 16px;
  }
  .ant-progress-bg {
    height: 16px !important;
    background: ${props => (props.percent >= 50 ? '#1fe3a1' : props.percent >= 30 ? '#fdcc3b' : '#ee1658')};
  }
`;

export const StyledProgress = styled(Progress)`
  height: 16px;
  .ant-progress-inner {
    height: 16px;
  }
  .ant-progress-bg {
    height: 16px !important;
    background: ${props => (props.percent >= 50 ? '#1fe3a1' : props.percent >= 30 ? '#fdcc3b' : '#ee1658')};
  }
`;
