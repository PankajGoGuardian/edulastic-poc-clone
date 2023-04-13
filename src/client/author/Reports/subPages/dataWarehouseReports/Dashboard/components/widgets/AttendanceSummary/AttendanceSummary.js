import { dataWarehouseApi } from '@edulastic/api'
import { EduElse, EduIf, EduThen, useApiQuery } from '@edulastic/common'
import { Empty, Spin } from 'antd'
import { isEmpty } from 'lodash'
import React, { useMemo } from 'react'
import { Widget } from '../../common/styledComponents'
import WidgetHeader from '../common/WidgetHeader'
import AttendanceSummaryContents from './AttendanceSummaryContents'

const title = 'ATTENDANCE SUMMARY'

const AttendanceSummary = ({ settings }) => {
  const query = useMemo(
    () => ({
      ...settings.requestFilters,
    }),
    [settings.requestFilters]
  )

  const { data, loading, error } = useApiQuery(
    dataWarehouseApi.getDashboardAttendanceSummary,
    [query],
    {
      enabled: !isEmpty(query),
    }
  )
  const hasContent =
    data?.result?.prePeriod.totalStudents ||
    data?.result?.postPeriod.totalStudents
  return (
    <Widget small>
      <WidgetHeader title={title} />
      <Spin spinning={loading}>
        <EduIf condition={data?.result && !error && hasContent}>
          <EduThen>
            <AttendanceSummaryContents
              data={data}
              selectedPeriodType={settings.requestFilters.periodType}
            />
          </EduThen>
          <EduElse>
            <Empty />
          </EduElse>
        </EduIf>
      </Spin>
    </Widget>
  )
}

export default AttendanceSummary
