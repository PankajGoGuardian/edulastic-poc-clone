import React from 'react'
import next from 'immer'
import { Tag } from 'antd'

import { red, green, yellow } from '@edulastic/colors'

import { isEmpty } from 'lodash'
import CsvTable from '../../common/components/tables/CsvTable'
import { NoDataContainer, StyledTable } from '../../common/styled'

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

const getTag = (status) => {
  if (status === 'success') {
    return <Tag color={green}>Success</Tag>
  }
  if (status === 'failed') {
    return <Tag color={red}>Failed</Tag>
  }
  return <Tag color={yellow}>In Progress</Tag>
}

const TestDataUploadsTable = ({ uploadsStatusList }) => {
  const _columns = next(columns, (rawColumns) => {
    rawColumns[0].sorter = sortText('testName')
    rawColumns[1].sorter = (a, b) => a - b
    rawColumns[1].render = (dateTime) => new Date(dateTime).toLocaleDateString()
    rawColumns[2].sorter = sortText('status')
    rawColumns[2].render = (status) => getTag(status)
  })

  if (isEmpty(uploadsStatusList)) {
    return <NoDataContainer>No Uploads data available.</NoDataContainer>
  }

  return (
    <CsvTable
      dataSource={uploadsStatusList}
      columns={_columns}
      tableToRender={StyledTable}
      scroll={{ x: '100%' }}
      pagination={{
        pageSize: 10,
      }}
    />
  )
}

export default TestDataUploadsTable
