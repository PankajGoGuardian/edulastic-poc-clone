import React from 'react'
import moment from 'moment'
import Popover from 'antd/lib/popover'
import { themeColor } from '@edulastic/colors'
import { titleCase, ucFirst } from '../../utils'
import EllipsisText from '../EllipsisText'
import {
  DW_GOALS_AND_INTERVENTIONS_TYPES,
  PERFORMANCE_BAND,
  ATTENDANCE_BAND,
} from '../../../constants/form'

const getMetricTypeTooltipValue = (record) => {
  const { type } = record
  const measureType = (record?.goalCriteria || record?.interventionCriteria)
    ?.target?.measureType

  if (
    type === DW_GOALS_AND_INTERVENTIONS_TYPES.ATTENDANCE &&
    measureType === PERFORMANCE_BAND
  ) {
    return ucFirst(titleCase(ATTENDANCE_BAND))
  }
  return ucFirst(titleCase(measureType))
}

const Tooltip = ({ value, record }) => {
  return (
    <Popover
      overlayClassName="gi-popover"
      placement="right"
      content={
        <div className="content">
          {record?.goalCriteria && (
            <>
              <p>Goal name:</p>
              <b>{ucFirst(record.name)}</b>
            </>
          )}
          {(record?.goalCriteria || record?.interventionCriteria)?.target
            ?.measureType && (
            <>
              <p>Metric type:</p>
              <b>{getMetricTypeTooltipValue(record)}</b>
            </>
          )}
          {(record?.goalCriteria || record?.interventionCriteria)?.applicableTo
            ?.subjects && (
            <>
              <p>Applicable to:</p>
              <b>
                {(
                  record?.goalCriteria || record?.interventionCriteria
                )?.applicableTo?.subjects.join(' , ')}
              </b>
            </>
          )}
          {record?.threshold && (
            <>
              <p>Threshold:</p>
              <b>{record?.threshold}%</b>
            </>
          )}
          {record?.owner && (
            <>
              <p>Owner(s):</p>
              <b>{record?.owner}</b>
            </>
          )}
          {record?.description && (
            <>
              <p>Description:</p>
              <b>{record?.description}</b>
            </>
          )}
          {record?.affectedGoals && record?.affectedGoals?.length > 0 && (
            <>
              <p>Affects goals:</p>
              <b>{record?.affectedGoals.join(',')}</b>
            </>
          )}
          {record?.startDate && (
            <>
              <p>Start Date:</p>
              <b>{moment(record?.startDate).format('DD MMM YYYY')}</b>
            </>
          )}
          {record?.endDate && (
            <>
              <p>End Date:</p>
              <b>{moment(record?.endDate).format('DD MMM YYYY')}</b>
            </>
          )}
        </div>
      }
      arrow={false}
    >
      <p style={{ color: themeColor, width: 'fit-content' }}>
        <EllipsisText lines={2}>{value}</EllipsisText>
      </p>
    </Popover>
  )
}

export default Tooltip
