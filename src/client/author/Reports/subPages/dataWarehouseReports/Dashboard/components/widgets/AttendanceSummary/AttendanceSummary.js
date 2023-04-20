import { dataWarehouseApi } from '@edulastic/api'
import {
  EduElse,
  EduIf,
  EduThen,
  SpinLoader,
  useApiQuery,
} from '@edulastic/common'
import { Empty } from 'antd'
import { isEmpty } from 'lodash'
import React, { useMemo } from 'react'
import useErrorNotification from '../../../../../../common/hooks/useErrorNotification'
import { Widget } from '../../../../common/components/styledComponents'
import WidgetHeader from '../../../../common/components/WidgetHeader'
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
      deDuplicate: false,
    }
  )

  const hasContent =
    !error &&
    (data?.result?.prePeriod.totalStudents ||
      data?.result?.postPeriod.totalStudents)
  const errorMsg = 'Error fetching Attendance Summary data.'

  const emptyContainerDesc = error ? errorMsg : 'No Data Available'
  useErrorNotification(errorMsg, error)

  return (
    <Widget aspectRatio="32 / 9" width="100%">
      <WidgetHeader title={title} />
      <EduIf condition={loading}>
        <EduThen>
          <SpinLoader
            tip="Loading Attendance Summary Data"
            height="70%"
            position="relative"
          />
        </EduThen>
        <EduElse>
          <EduIf condition={hasContent}>
            <EduThen>
              <AttendanceSummaryContents
                data={data}
                selectedPeriodType={settings.requestFilters.periodType}
              />
            </EduThen>
            <EduElse>
              <Empty description={emptyContainerDesc} />
            </EduElse>
          </EduIf>
        </EduElse>
      </EduIf>
    </Widget>
  )
}

export default AttendanceSummary
