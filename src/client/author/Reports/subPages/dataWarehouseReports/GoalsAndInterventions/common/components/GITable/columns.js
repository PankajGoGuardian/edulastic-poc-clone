import React from 'react'
import ColoredCell from './ColoredCell'
import {
  statusColors,
  timeLeftColors,
  MULTIPLE_OF_TENS,
  statusTextColors,
  GIActionOptions,
  GI_STATUS,
} from '../../../constants/common'
import Tooltip from './Tooltip'
import ActionMenu from '../ActionMenu'
import { GOAL, INTERVENTION } from '../../../constants/form'
import {
  isNumeric,
  ucFirst,
  getTarget,
  isCurrentValueInValid,
  getDaysLeft,
  getTotalDaysBetweenTwoDates,
  hasCurrentReachedTarget,
  isTimeLeftWithinCertainPercent,
  isTimeLeftOverCertainPercent,
} from '../../utils'
import EllipsisText from '../EllipsisText'

const getCurrentStatusColor = (record) => {
  if (isCurrentValueInValid(record)) {
    return statusColors.WHITE
  }

  const isTargetAchieved = hasCurrentReachedTarget(record)

  if (isTargetAchieved) {
    return statusColors.GREEN
  }

  if (!isTargetAchieved && getDaysLeft(record.startDate, record.endDate) > 0) {
    return statusColors.WHITE
  }

  return statusColors.RED
}

const getTimeLeftColor = (record) => {
  const { status = '' } = record
  const timeLeft = getDaysLeft(record.startDate, record.endDate)
  const totalTime = getTotalDaysBetweenTwoDates(
    record.startDate,
    record.endDate
  )
  if (
    timeLeft === 0 ||
    (timeLeft === totalTime && status === GI_STATUS.NOT_STARTED)
  ) {
    return timeLeftColors.GRAY
  }
  if (
    isTimeLeftWithinCertainPercent(timeLeft, totalTime, MULTIPLE_OF_TENS.THIRTY)
  ) {
    return timeLeftColors.RED
  }

  if (
    isTimeLeftOverCertainPercent(
      timeLeft,
      totalTime,
      MULTIPLE_OF_TENS.THIRTY
    ) &&
    isTimeLeftWithinCertainPercent(timeLeft, totalTime, MULTIPLE_OF_TENS.FIFTY)
  ) {
    return timeLeftColors.YELLOW
  }

  return timeLeftColors.GREEN
}

const parseCurrentValue = (value) => {
  if (value) {
    return isNumeric(value) ? `${Math.round(parseFloat(value))}%` : value
  }
  return '-'
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
    align: 'center',
    sorter: (a, b) =>
      (a.type || '').toLowerCase().localeCompare((b.type || '').toLowerCase()),
    render: (text) => <p>{ucFirst(text)}</p>,
  },
  {
    title: 'Target Group',
    dataIndex: 'group',
    key: 'target_Groups',
    sorter: (a, b) =>
      (a.group || '')
        .toLowerCase()
        .localeCompare((b.group || '').toLowerCase()),
    width: 150,
    align: 'center',
    render: (groups) => <EllipsisText lines={2}>{groups}</EllipsisText>,
  },
  {
    title: 'Baseline',
    dataIndex: 'baseline',
    className: 'text-center',
    key: 'baseline',
    width: 150,
    align: 'center',
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
    align: 'center',
    sorter: (a, b) =>
      sortingBaselineCurrentTargetValues(a?.current?.value, b?.current?.value),
    width: 150,
    sortDirections: ['descend', 'ascend'],
    render: (text, record) => (
      <ColoredCell
        value={parseCurrentValue(text?.value)}
        bgColor={getCurrentStatusColor(record)}
      />
    ),
  },
  {
    title: 'Target',
    dataIndex: 'target',
    key: 'target',
    className: 'text-center',
    width: 150,
    sortDirections: ['descend', 'ascend'],
    align: 'center',
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
    align: 'center',
    sorter: (a, b) =>
      getDaysLeft(b.startDate, b.endDate) - getDaysLeft(a.startDate, a.endDate),
    sortDirections: ['descend', 'ascend'],
    render: (text, record) => (
      <ColoredCell
        value={`${getDaysLeft(
          record.startDate,
          record.endDate
        )}/${getTotalDaysBetweenTwoDates(record.startDate, record.endDate)}`}
        color={getTimeLeftColor(record)}
      />
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    align: 'center',
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
    align: 'center',
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
        GIData={record}
      />
    ),
  },
]

export default columns
