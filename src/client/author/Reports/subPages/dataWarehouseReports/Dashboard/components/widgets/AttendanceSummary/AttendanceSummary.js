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
  return (
    <Widget small>
      <WidgetHeader title={title} />
      <Spin spinning={loading}>
        <EduIf condition={data?.result && !error}>
          <EduThen>
            <AttendanceSummaryContents data={data} />
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
