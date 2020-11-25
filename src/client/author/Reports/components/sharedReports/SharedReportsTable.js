import React from 'react'
import moment from 'moment'
import { Table } from 'antd'

const SharedReportsTable = ({ sharedReportsData, showReport }) => {
  const columns = [
    {
      title: 'Report Name',
      key: 'title',
      dataIndex: 'title',
    },
    {
      title: 'Report Type',
      key: 'reportGroupTypeTitle',
      dataIndex: 'reportGroupTypeTitle',
    },
    {
      title: 'Shared By',
      key: 'sharedBy',
      dataIndex: 'sharedBy',
      render: ({ name }) => name,
    },
    {
      title: 'Shared With',
      key: 'sharedWith',
      dataIndex: 'sharedWith',
      render: (data) => (data || []).map(({ name }) => name).join(', '),
    },
    {
      title: 'Date',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (data) => moment(data).format('MMMM DD, YYYY'),
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={sharedReportsData}
      onRow={(record) => ({
        onClick: () => showReport(record),
      })}
    />
  )
}

export default SharedReportsTable
