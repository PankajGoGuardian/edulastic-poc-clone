import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Result, Spin } from 'antd'
import { report } from '@edulastic/constants'
import SharedReportsTable from './SharedReportsTable'
import { StyledContainer } from '../../common/styled'

import navigation from '../../common/static/json/navigation.json'

import {
  getSharedReportsLoader,
  getSharedReportList,
  archiveReportAction,
  getCollaborativeGroupList,
} from './ducks'
import { getUserIdSelector } from '../../../src/selectors/user'

const SharedReportsContainer = ({
  collaborativeGroupList = [],
  sharedReportList = [],
  archiveReport,
  isLoading,
  history,
  currentUserId,
}) => {
  const showReport = ({ _id, reportGroupType, reportType, filters }) => {
    switch (reportGroupType) {
      case report.reportGroupType.SINGLE_ASSESSMENT_REPORT:
        history.push(
          `/author/reports/${reportType}/test/${filters.testId}?reportId=${_id}`
        )
        break
      case report.reportGroupType.MULTIPLE_ASSESSMENT_REPORT:
      case report.reportGroupType.STANDARDS_MASTERY_REPORT:
        history.push(`/author/reports/${reportType}?reportId=${_id}`)
        break
      case report.reportGroupType.STUDENT_PROFILE_REPORT:
        history.push(
          `/author/reports/${reportType}/student/${filters.studentId}?termId=${filters.termId}&reportId=${_id}`
        )
        break
      default:
      // do nothing
    }
  }

  const sharedReportsData = useMemo(() => {
    // collaborative groups mapping where the current user is group admin
    const isCGAdmin = {}
    collaborativeGroupList.forEach((cg) => {
      const currentUserAsMember = cg.groupMembers.find(
        (u) => u._id === currentUserId
      )
      isCGAdmin[cg._id] = currentUserAsMember?.isAdmin
    })
    // append reportGroupType and group admin flag for shared reports
    return sharedReportList.map((sharedReport) => {
      // reportGroupTypeTitle = 'Single Assessment Report'
      // => reportGroupType = 'single-assessment-report'
      const reportGroupTypeTitle =
        navigation.locToData[sharedReport.reportType]?.groupTitle || '-'
      const reportGroupType = reportGroupTypeTitle
        .toLowerCase()
        .split(' ')
        .join('-')
      /**
       * TODO: uncomment below code and add backend support
       * if groupAdmin is allowed to archive shared reports
       */
      // const isGroupAdmin = !!sharedReport.sharedWith.filter(
      //   (cg) => isCGAdmin[cg._id]
      // ).length
      return {
        ...sharedReport,
        // isGroupAdmin,
        reportGroupType,
        reportGroupTypeTitle,
      }
    })
  }, [sharedReportList, collaborativeGroupList])

  return (
    <StyledContainer>
      {isLoading ? (
        <Spin size="small" />
      ) : sharedReportList.length ? (
        <SharedReportsTable
          sharedReportsData={sharedReportsData}
          showReport={showReport}
          archiveReport={archiveReport}
          currentUserId={currentUserId}
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
    currentUserId: getUserIdSelector(state),
    isLoading: getSharedReportsLoader(state),
    sharedReportList: getSharedReportList(state),
    collaborativeGroupList: getCollaborativeGroupList(state),
  }),
  {
    archiveReport: archiveReportAction,
  }
)

export default enhance(SharedReportsContainer)
