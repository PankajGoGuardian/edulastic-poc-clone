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

  handlerTable = () => {
    this.setState(prevState => ({ isShow: !prevState.isShow }));
  }

  render() {
    const { summary } = this.props;
    const { summaryColumns, summaryData, isShow } = this.state;
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
            dataSource={summaryData}
          />)
        }
      </AssignmentContentWrapper>
    );
  }
}

DomainDetail.propTypes = {
  summary: PropTypes.object.isRequired
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
