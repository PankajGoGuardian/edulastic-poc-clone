import React, { useMemo } from 'react'
import next from 'immer'
import styled from 'styled-components'
import { Tag, Tooltip } from 'antd'

import { red, green, yellow, fadedBlack } from '@edulastic/colors'
import { IconCharInfo } from '@edulastic/icons'

import { isEmpty } from 'lodash'
import CsvTable from './CsvTable'
import { StyledTable } from '../../../../common/styled'

const columns = [
  {
    title: 'Test name',
    dataIndex: 'testName',
    key: 'testName',
  },
  {
    title: 'Last Updated',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
]

const sortText = (key) => (a, b) =>
  (a[key] || '').toLowerCase().localeCompare((b[key] || '').toLowerCase())

const getTag = (status, statusReason = '') => {
  if (status === 'SUCCESS') {
    return <Tag color={green}>Success</Tag>
  }
  if (status === 'ERROR') {
    return (
      <>
        <Tag color={red}>Failed</Tag>
        <Tooltip title={statusReason}>
          <InfoIcon />
        </Tooltip>
      </>
    )
  }
  return <Tag color={yellow}>In Progress</Tag>
}

const DataWarehouseUploadsTable = ({ uploadsStatusList }) => {
  const sortedData = useMemo(() => {
    return uploadsStatusList.sort((a, b) => b.updatedAt - a.updatedAt)
  }, [uploadsStatusList])

  const _columns = next(columns, (rawColumns) => {
    rawColumns[0].sorter = sortText('testName')
    rawColumns[1].sorter = (a, b) =>
      new Date(a.updatedAt) - new Date(b.updatedAt)
    rawColumns[1].render = (dateTime) => new Date(dateTime).toLocaleDateString()
    rawColumns[2].sorter = sortText('status')
    rawColumns[2].render = (status, record) =>
      getTag(status, record?.statusReason)
  })

  if (isEmpty(uploadsStatusList)) {
    return <NoDataContainer>No Uploads data available.</NoDataContainer>
  }

  return (
    <CsvTable
      dataSource={sortedData}
      columns={_columns}
      tableToRender={StyledTable}
      scroll={{ x: '100%' }}
      pagination={{
        pageSize: 10,
      }}
    />
  )
}

const InfoIcon = styled(IconCharInfo)`
  width: 6px;
  height: 10px;
  cursor: pointer;
`

const NoDataContainer = styled.div`
  background: white;
  color: ${fadedBlack};
  margin-top: 290px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ fontSize }) => fontSize || '25px'};
  font-weight: 700;
  text-align: 'center';
`

export default DataWarehouseUploadsTable
