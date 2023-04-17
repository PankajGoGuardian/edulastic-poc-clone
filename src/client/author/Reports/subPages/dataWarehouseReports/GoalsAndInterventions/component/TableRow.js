import React from 'react'
import moment from 'moment'
import ColoredCell from './ColoredCell'
import { statusColors, timeLeftColors } from '../constants'
import Tooltip from './Tooltip'

const getCurrentStatusColor = (record) => {
  switch (true) {
    case record.current >= record.target:
      return statusColors.GREEN
    default:
      return statusColors.RED
  }
}

const getTimeLeftColor = (record) => {
  const timeLeft = moment().diff(record.startDate, 'days')
  const totalTime = moment(record.endDate).diff(record.startDate, 'days')

  switch (true) {
    case timeLeft / totalTime <= 0.3:
      return timeLeftColors.RED
    case timeLeft / totalTime > 0.3 && timeLeft / totalTime <= 0.5:
      return timeLeftColors.YELLOW
    default:
      return timeLeftColors.GREEN
  }
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: true,
    render: (value, record) => <Tooltip value={value} record={record} />,
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
    render: (text) => <p>{text}%</p>,
  },
  {
    title: 'Current',
    dataIndex: 'current',
    key: 'current',
    sorter: true,
    width: 150,
    render: (text, record) => (
      <ColoredCell value={`${text}%`} bgColor={getCurrentStatusColor(record)} />
    ),
  },
  {
    title: 'Target',
    dataIndex: 'threshold',
    key: 'threshold',
    sorter: true,
    render: (text) => <p>{text}%</p>,
  },
  {
    title: 'TIME LEFT (DAYS)',
    dataIndex: 'time_left',
    key: 'time_left',
    sorter: true,
    width: 160,
    render: (text, record) => (
      <ColoredCell
        value={`${moment().diff(record.startDate, 'days')}/${moment(
          record.endDate
        ).diff(record.startDate, 'days')}`}
        color={getTimeLeftColor(record)}
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

export default columns
