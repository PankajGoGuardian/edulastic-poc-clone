import { dataWarehouseApi } from '@edulastic/api'
import {
  EduElse,
  EduIf,
  EduThen,
  SpinLoader,
  useApiQuery,
} from '@edulastic/common'
import qs from 'qs'
import { Empty } from 'antd'
import { isEmpty } from 'lodash'
import React, { useMemo } from 'react'
import useErrorNotification from '../../../../../../common/hooks/useErrorNotification'
import { Widget } from '../../../../common/components/styledComponents'
import WidgetHeader from '../../../../common/components/WidgetHeader'
import AttendanceSummaryContents from './AttendanceSummaryContents'
import { DW_ATTENDANCE_REPORT_URL } from '../../../../../../common/constants/dataWarehouseReports'
import { Spacer } from '../../../../../../../../common/styled'
import { ControlDropDown } from '../../../../../../common/components/widgets/controlDropDown'

const title = 'Attendance Summary'

const AttendanceSummary = ({
  settings,
  setSettings,
  attendanceBandInfo,
  location,
  history,
  showAbsents,
}) => {
  const query = useMemo(
    () => ({
      ...settings.requestFilters,
      attendanceProfileId: settings.attendanceProfileId,
    }),
    [settings.requestFilters, settings.attendanceProfileId]
  )

  const { data, loading, error } = useApiQuery(
    dataWarehouseApi.getDashboardAttendanceSummary,
    [query],
    {
      enabled: !isEmpty(settings.requestFilters),
      deDuplicate: false,
    }
  )
  const onAttendanceBandChange = (e, selected) => {
    setSettings({
      ...settings,
      attendanceProfileId: selected.key,
    })
    const newSearchParams = {
      ...settings.requestFilters,
      profileId: settings.academicSummaryFilters.profileId?.key,
      attendanceProfileId: selected.key,
    }
    history.replace(`${location.pathname}?${qs.stringify(newSearchParams)}`)
  }

  const hasContent =
    !error &&
    (data?.result?.prePeriod.totalStudents ||
      data?.result?.postPeriod.totalStudents)
  const errorMsg = 'Error fetching Attendance Summary data.'

  const emptyContainerDesc = error ? errorMsg : 'No Data Available'
  useErrorNotification(errorMsg, error)

  const externalUrl = `${DW_ATTENDANCE_REPORT_URL}?${qs.stringify({
    ...settings.requestFilters,
    profileId: settings.attendanceProfileId,
  })}`

  return (
    <Widget aspectRatio="32 / 9" width="100%">
      <WidgetHeader title={title} url={externalUrl}>
        <Spacer />
        <EduIf condition={attendanceBandInfo.length}>
          <ControlDropDown
            style={{ margin: '8px 10px 0 0' }}
            by={settings.attendanceProfileId}
            data={attendanceBandInfo}
            selectCB={onAttendanceBandChange}
          />
        </EduIf>
      </WidgetHeader>
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
                showAbsents={showAbsents}
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
