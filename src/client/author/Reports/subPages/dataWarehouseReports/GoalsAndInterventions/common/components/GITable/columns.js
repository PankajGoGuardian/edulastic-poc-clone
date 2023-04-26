import React from 'react'
import moment from 'moment'
import ColoredCell from './ColoredCell'
import {
  statusColors,
  timeLeftColors,
  MULTIPLE_OF_TENS,
  statusTextColors,
  GIActionOptions,
} from '../../../constants/common'
import Tooltip from './Tooltip'
import ActionMenu from '../ActionMenu'
import { GOAL, INTERVENTION } from '../../../constants/form'
import { isNumeric, ucFirst, getPercentage } from '../../utils'
import EllipsisText from '../EllipsisText'

const getCurrentStatusColor = (record) => {
  if (record.current >= record.target) return statusColors.GREEN
  return statusColors.RED
}

const getTimeLeftColor = (record) => {
  const timeLeft = moment().diff(record.startDate, 'days')
  const totalTime = moment(record.endDate).diff(record.startDate, 'days')
  if (
    moment().diff(record.endDate, 'days') > 0 ||
    moment().diff(record.startDate, 'days') <= 0
  ) {
    return timeLeftColors.GRAY
  }
  if (timeLeft / totalTime <= getPercentage(MULTIPLE_OF_TENS.THIRTY))
    return timeLeftColors.RED
  if (
    timeLeft / totalTime > getPercentage(MULTIPLE_OF_TENS.THIRTY) &&
    timeLeft / totalTime <= getPercentage(MULTIPLE_OF_TENS.FIFTY)
  )
    return timeLeftColors.YELLOW
  return timeLeftColors.GREEN
}

const parseCurrentValue = (value) => {
  if (value) {
    return isNumeric(value) ? `${Math.ceil(parseFloat(value))}%` : value
  }
  return '-'
}

const getTarget = (record) => {
  return record?.interventionCriteria?.target || record?.goalCriteria?.target
}

const sortingBaselineCurrentTargetValues = (x, y) => {
  if (x === undefined) {
    return 1
  }
  if (y === undefined) {
    return -1
  }
  if (isNumeric(x) && isNumeric(y)) {
    return x - y
  }
  if (x && y) {
    return x.toLowerCase().localeCompare(y.toLowerCase())
  }
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 180,
    sorter: (a, b) =>
      (a.name || '').toLowerCase().localeCompare((b.name || '').toLowerCase()),
    sortDirections: ['descend', 'ascend'],
    render: (value, record) => (
      <Tooltip value={ucFirst(value)} record={record} />
    ),
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    width: 80,
    sorter: (a, b) =>
      (a.type || '').toLowerCase().localeCompare((b.type || '').toLowerCase()),
    render: (text) => <p>{ucFirst(text)}</p>,
  },
  {
    title: 'Target Groups',
    dataIndex: 'group',
    key: 'target_Groups',
    sorter: (a, b) =>
      (a.group || '')
        .toLowerCase()
        .localeCompare((b.group || '').toLowerCase()),
    width: 100,
    render: (groups) => <EllipsisText lines={2}>{groups}</EllipsisText>,
  },
  {
    title: 'Baseline',
    dataIndex: 'baseline',
    className: 'text-center',
    key: 'baseline',
    width: 100,
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) =>
      sortingBaselineCurrentTargetValues(a.baseline, b.baseline),
    render: (text) => <p>{parseCurrentValue(text)}</p>,
  },
  {
    title: 'Current',
    dataIndex: 'current',
    key: 'current',
    className: 'text-center',
    sorter: (a, b) => sortingBaselineCurrentTargetValues(a.current, b.current),
    width: 100,
    sortDirections: ['descend', 'ascend'],
    render: (text, record) => (
      <ColoredCell
        value={parseCurrentValue(text)}
        bgColor={getCurrentStatusColor(record)}
      />
    ),
  },
  {
    title: 'Target',
    dataIndex: 'target',
    key: 'target',
    className: 'text-center',
    width: 100,
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) =>
      sortingBaselineCurrentTargetValues(
        getTarget(a)?.metric,
        getTarget(b)?.metric
      ),
    render: (text, record) => {
      const metric = getTarget(record)?.metric
      return <p>{parseCurrentValue(metric)}</p>
    },
  },
  {
    title: 'TIME LEFT (DAYS)',
    dataIndex: 'time_left',
    key: 'time_left',
    className: 'text-center',
    width: 180,
    sorter: (a, b) =>
      moment().diff(b.startDate, 'days') - moment().diff(a.startDate, 'days'),
    sortDirections: ['descend', 'ascend'],
    render: (text, record) => (
      <ColoredCell
        value={`${
          moment().diff(record.endDate, 'days') > 0 ||
          moment().diff(record.startDate, 'days') < 0
            ? 0
            : moment().diff(record.startDate, 'days')
        }/${moment(record.endDate).diff(record.startDate, 'days')}`}
        color={getTimeLeftColor(record)}
      />
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    sorter: (a, b) => {
      const left = ucFirst(a.status || '')
      const right = ucFirst(b.status || '')
      return left.toLowerCase().localeCompare(right.toLowerCase())
    },
    render: (text) => (
      <p
        style={{
          color: statusTextColors[text],
        }}
      >
        {ucFirst((text || '').replace('_', ' '))}
      </p>
    ),
  },
  {
    title: 'Notes',
    dataIndex: 'comment',
    key: 'comment',
    sorter: (a, b) =>
      (a.comment || '')
        .toLowerCase()
        .localeCompare((b.comment || '').toLowerCase()),
    width: 200,
    render: (comment) => <EllipsisText lines={2}>{comment}</EllipsisText>,
  },
  {
    title: '',
    dataIndex: '',
    key: 'x',
    width: 100,
    render: (x, record) => (
      <ActionMenu
        type={record.goalCriteria ? GOAL : INTERVENTION}
        options={GIActionOptions}
      />
    ),
  },
]

export default columns
