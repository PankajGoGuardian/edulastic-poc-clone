import React, { useEffect } from 'react'
import next from 'immer'
import { Tag, Spin } from 'antd'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { red, green, yellow } from '@edulastic/colors'

import { isEmpty } from 'lodash'
import CsvTable from '../../common/components/tables/CsvTable'
import { NoDataContainer, StyledTable } from '../../common/styled'

import {
  getUploadsStatusListAction,
  getUploadsStatusLoader,
  getUploadsStatusList,
} from './ducks'

const columns = [
  {
    title: 'Test name',
    dataIndex: 'testName',
    key: 'testName',
  },
  {
    title: 'Last Updated',
    dataIndex: 'lastUpdatedAt',
    key: 'lastUpdatedAt',
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

const TestDataUploadsTable = ({
  fetchUploadsStatusList,
  uploadsStatusList,
  loading,
}) => {
  useEffect(() => {
    fetchUploadsStatusList()
  }, [])

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
    <>
      {loading ? (
        <Spin />
      ) : (
        <CsvTable
          dataSource={uploadsStatusList}
          columns={_columns}
          tableToRender={StyledTable}
          scroll={{ x: '100%' }}
          pagination={{
            pageSize: 10,
          }}
        />
      )}
    </>
  )
}

const withConnect = connect(
  (state) => ({
    loading: getUploadsStatusLoader(state),
    uploadsStatusList: getUploadsStatusList(state),
  }),
  {
    fetchUploadsStatusList: getUploadsStatusListAction,
  }
)

export default compose(withConnect)(TestDataUploadsTable)
