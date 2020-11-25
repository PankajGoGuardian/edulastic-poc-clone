import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Result, Spin } from 'antd'
import { report } from '@edulastic/constants'
import SharedReportsTable from './SharedReportsTable'
import { StyledContainer } from '../../common/styled'

import navigation from '../../common/static/json/navigation.json'

import { getSharedReportsLoader, getSharedReportList } from './ducks'

const SharedReportsContainer = ({
  sharedReportList = [],
  isLoading,
  history,
}) => {
  const showReport = ({ _id, reportGroupType, reportType, filters }) => {
    switch (reportGroupType) {
      case report.reportGroupType.SINGLE_ASSESSMENT_REPORT:
        history.push(
          `/author/reports/${reportType}/test/${filters.testId}?reportId=${_id}`
        )
        break
      case report.reportGroupType.MULTIPLE_ASSESSMENT_REPORT:
        history.push(`/author/reports/${reportType}?reportId=${_id}`)
        break
      case report.reportGroupType.STUDENT_PROFILE_REPORT:
        history.push(
          `/author/reports/${reportType}/student/${filters.studentId}?termId=${filters.termId}&reportId=${_id}`
        )
        break
      case report.reportGroupType.STANDARDS_MASTERY_REPORT:
      default:
      // do nothing
    }
  }

  const sharedReportsData = useMemo(
    () =>
      sharedReportList.map((sharedReport) => {
        const reportGroupTypeTitle =
          navigation.locToData[sharedReport.reportType]?.groupTitle || '-'
        const reportGroupType = reportGroupTypeTitle
          .toLowerCase()
          .split(' ')
          .join('-')
        return {
          ...sharedReport,
          reportGroupType,
          reportGroupTypeTitle,
        }
      }),
    [sharedReportList]
  )

  return (
    <StyledContainer>
      {isLoading ? (
        <Spin size="small" />
      ) : sharedReportList.length ? (
        <SharedReportsTable
          sharedReportsData={sharedReportsData}
          showReport={showReport}
        />
      ) : (
        <Result title="No report found" />
      )}
    </StyledContainer>
  )
}

SharedReportsContainer.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  sharedReportList: PropTypes.array.isRequired,
}

const enhance = connect(
  (state) => ({
    isLoading: getSharedReportsLoader(state),
    sharedReportList: getSharedReportList(state),
  }),
  {}
)

export default enhance(SharedReportsContainer)
