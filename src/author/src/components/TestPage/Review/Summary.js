import React from 'react';
import styled from 'styled-components';
import { FlexContainer } from '@edulastic/common';
import { textColor, greenDark, lightGrey } from '@edulastic/colors';
import { Table } from 'antd';
import PropTypes from 'prop-types';

const columns = [
  {
    title: 'Standard',
    dataIndex: 'standard',
    key: 'standard',
    render: data => <div>{data}</div>,
  },
  {
    title: "Q's",
    dataIndex: 'qs',
    key: 'qs',
    render: data => <div>{data}</div>,
  },
  {
    title: 'Points',
    dataIndex: 'points',
    key: 'points',
    render: data => <div>{data}</div>,
  },
];

const Summary = ({ total, tableData }) => (
  <div>
    <FlexContainer style={{ marginBottom: 25 }}>
      <InfoBlock>
        <Count>3</Count> Questions
      </InfoBlock>
      <InfoBlock>
        <Count>{total}</Count> Points
      </InfoBlock>
    </FlexContainer>
    <Table pagination={false} columns={columns} dataSource={tableData} />
  </div>
);

Summary.propTypes = {
  total: PropTypes.string.isRequired,
  tableData: PropTypes.array.isRequired,
};

export default Summary;

const InfoBlock = styled.div`
  width: 49%;
  padding: 8px;
  border-radius: 5px;
  border: solid 1px ${textColor};
  background-color: ${lightGrey};
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  color: ${textColor};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Count = styled.span`
  color: ${greenDark};
  font-size: 18px;
  font-weight: 700;
  margin-right: 15px;
`;
