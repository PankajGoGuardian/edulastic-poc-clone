import React from 'react'
import Table from 'antd/lib/table'
import styled from 'styled-components'
import './index.scss'
import StatusBox from '../StatusBox'

const GITable = () => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      sorter: true,
    },
    {
      title: 'Target Students',
      dataIndex: 'target_students',
      key: 'target_students',
      sorter: true,
    },
    {
      title: 'Baseline',
      dataIndex: 'baseline',
      key: 'baseline',
      sorter: true,
    },
    {
      title: 'Current',
      dataIndex: 'current',
      key: 'current',
      sorter: true,
    },
    {
      title: 'Target',
      dataIndex: 'target',
      key: 'target',
      sorter: true,
    },
    {
      title: 'TIME LEFT (DAYS)',
      dataIndex: 'time',
      key: 'time',
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
    },
    {
      title: 'Comments',
      dataIndex: 'comments',
      key: 'comments',
      sorter: true,
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: () => <a>Delete</a>,
    },
  ]
  const data = [
    {
      key: 1,
      name: 'Goal 1',
      type: 'Academic',
      target_students: 1024,
      baseline: 80,
      current: 80,
      target: 80,
      time: '30/180',
      isExpandable: false,
      status: 'In progress',
      comments: 'Requires some modification',
    },
    {
      key: 2,
      name: 'Goal 2',
      type: 'Academic',
      target_students: 1024,
      baseline: 80,
      current: 80,
      target: 80,
      time: '100/180',
      status: 'Completed',
      isExpandable: true,
      comments: 'Requires some modification',
    },
  ]

  const expandData = [
    {
      key: 1,
      name: 'Intervention 1',
      type: 'Academic',
      target_students: 1024,
      baseline: 80,
      current: 80,
      target: 80,
      time: '30/180',
      isExpandable: false,
      status: 'In progress',
      comments: 'Requires some modification',
    },
  ]

  const statusList = [
    {
      key: 1,
      items: [
        {
          id: 1,
          text: 'Done',
          color: '#F9F9F9',
          border: '1px solid #D8D8D8',
          unit: 4,
        },
        {
          id: 2,
          text: 'Not met',
          color: '#FBBFBA',
          unit: 2,
        },
        {
          id: 3,
          text: 'Met',
          color: '#D3FCD5',
          unit: 2,
        },
      ],
    },
    {
      key: 2,
      items: [
        {
          id: 1,
          text: 'Ongoing',
          color: '#F9F9F9',
          border: '1px solid #D8D8D8',
          unit: 4,
        },
        {
          id: 2,
          text: 'Off-track',
          color: '#FBBFBA',
          unit: 2,
        },
        {
          id: 3,
          text: 'Rest',
          color: '#D3FCD5',
          unit: 2,
        },
      ],
    },
  ]

  return (
    <Table
      className="gi-table"
      title={() => (
        <Header>
          {statusList.map((ele) => (
            <StatusBox key={ele.key} items={ele.items} />
          ))}
        </Header>
      )}
      columns={columns}
      rowClassName={(record) => {
        if (!record.isExpandable) {
          return 'not-expandible'
        }
      }}
      expandedRowRender={() => (
        <Table className="gi-table" columns={columns} dataSource={expandData} />
      )}
      dataSource={data}
    />
  )
}

const Header = styled.div`
  display: flex;
  gap: 10px;
  div {
    flex: 1;
  }
`

export default GITable
