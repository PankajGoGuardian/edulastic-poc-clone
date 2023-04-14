import React from 'react'
import Table from 'antd/lib/table'
import styled from 'styled-components'
import './index.scss'
import StatusBox from '../StatusBox'
import ColoredCell from '../ColoredCell'
import { statusColors, summaryTileColors } from '../../constants'

const GITable = () => {
  const getCurrentStatusColor = (record) => {
    switch (true) {
      case record.current >= record.target:
        return statusColors.GREEN
      default:
        return statusColors.RED
    }
  }

  const getTimeLeftColor = (record) => {
    switch (true) {
      case record.time_left / record.total_time <= 0.3:
        return statusColors.RED
      case record.time_left / record.total_time > 0.3 &&
        record.time_left / record.total_time <= 0.5:
        return statusColors.YELLOW
      default:
        return statusColors.GREEN
    }
  }

  const getSummaryStatusCount = (key, data) => {
    switch (key) {
      case 'met': {
        return data.filter((record) => record.current >= record.target).length
      }
      case 'not-met': {
        return data.filter((record) => record.current < record.target).length
      }
      case 'off-track': {
        return data.filter(
          (record) => record.time_left / record.total_time < 0.2
        ).length
      }
      case 'rest': {
        return data.filter(
          (record) => record.time_left / record.total_time > 0.2
        ).length
      }
      case 'fully-executed':
      case 'done': {
        return data.filter((record) => record.time_left === 0).length
      }
      case 'on-going':
      case 'in-progress': {
        return data.filter((record) => record.time_left > 0).length
      }
      default:
        return 0
    }
  }

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
      width: 150,
      render: (text, record) => (
        <ColoredCell value={text} bgColor={getCurrentStatusColor(record)} />
      ),
    },
    {
      title: 'Target',
      dataIndex: 'target',
      key: 'target',
      sorter: true,
    },
    {
      title: 'TIME LEFT (DAYS)',
      dataIndex: 'time_left',
      key: 'time_left',
      sorter: true,
      width: 160,
      render: (text, record) => (
        <ColoredCell
          value={`${text}/${record.total_time}`}
          bgColor={getTimeLeftColor(record)}
        />
      ),
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
      width: 450,
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
      current: 70,
      target: 80,
      time_left: 30,
      total_time: 180,
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
      time_left: 100,
      total_time: 180,
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
      time_left: 30,
      total_time: 180,
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
          color: summaryTileColors.GRAY,
          border: '1px solid #D8D8D8',
          unit: getSummaryStatusCount('done', data),
        },
        {
          id: 2,
          text: 'Not met',
          color: summaryTileColors.RED,
          unit: getSummaryStatusCount('not-met', data),
        },
        {
          id: 3,
          text: 'Met',
          color: summaryTileColors.GREEN,
          unit: getSummaryStatusCount('met', data),
        },
      ],
    },
    {
      key: 2,
      items: [
        {
          id: 1,
          text: 'Ongoing',
          color: summaryTileColors.GRAY,
          border: '1px solid #D8D8D8',
          unit: getSummaryStatusCount('on-going', data),
        },
        {
          id: 2,
          text: 'Off-track',
          color: summaryTileColors.RED,
          unit: getSummaryStatusCount('off-track', data),
        },
        {
          id: 3,
          text: 'Rest',
          color: summaryTileColors.GREEN,
          unit: getSummaryStatusCount('rest', data),
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
        <Table
          className="gi-table"
          columns={columns}
          dataSource={expandData}
          pagination={false}
        />
      )}
      pagination={false}
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
