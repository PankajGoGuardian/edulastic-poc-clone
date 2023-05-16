import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Result, Spin } from 'antd'
import { TypeToConfirmModal } from '@edulastic/common'
import { report } from '@edulastic/constants'
import { SubHeader } from '../../common/components/Header'
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
  breadcrumbData,
  isCliUser,
}) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [reportToArchive, setReportToArchive] = useState({})

  useEffect(() => setShowConfirmationModal(!!reportToArchive._id), [
    reportToArchive,
  ])

  const handleArchiveReport = () => {
    if (reportToArchive._id) {
      archiveReport({ id: reportToArchive._id })
    }
    setReportToArchive({})
  }

  const showReport = ({ _id, reportGroupType, reportType, filters }) => {
    switch (reportGroupType) {
      case report.reportGroupType.SINGLE_ASSESSMENT_REPORT:
        history.push(
          `/author/reports/${reportType}/test/${filters.testId}?reportId=${_id}`
        )
        break
      case report.reportGroupType.MULTIPLE_ASSESSMENT_REPORT:
      case report.reportGroupType.STANDARDS_MASTERY_REPORT:
      case report.reportGroupType.ENGAGEMENT_REPORT:
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
    switch (reportType) {
      case report.reportNavType.WHOLE_LEARNER_REPORT:
        history.push(
          `/author/reports/${reportType}/student/${filters.studentId}?termId=${filters.termId}&reportId=${_id}`
        )
        break
      case report.reportNavType.MULTIPLE_ASSESSMENT_REPORT_DW:
        history.push(
          `/author/reports/${reportType}?termId=${filters.termId}&reportId=${_id}`
        )
        break
      case report.reportNavType.DW_EFFICACY_REPORT:
        history.push(
          `/author/reports/${reportType}?termId=${filters.termId}&reportId=${_id}`
        )
        break
      default:
      // do nothing
    }
  }

  const sharedReportsData = useMemo(() => {
    // collaborative groups mapping where the current user is group admin
    const isCGAdmin = {}
    const collaborativeGroupIds = []
    collaborativeGroupList.forEach((cg) => {
      const currentUserAsMember = cg.groupMembers.find(
        (u) => u._id === currentUserId
      )
      isCGAdmin[cg._id] = currentUserAsMember?.isAdmin
      collaborativeGroupIds.push(cg._id)
    })
    // append reportGroupType and group admin flag for shared reports
    return sharedReportList
      .map((sharedReport) => {
        // reportGroupTypeTitle = 'Single Assessment Report'
        // => reportGroupType = 'single-assessment-report'
        const reportGroupTypeTitle =
          navigation.locToData[sharedReport.reportType]?.groupTitle || '-'
        const reportGroupType = reportGroupTypeTitle
          .toLowerCase()
          .split(' ')
          .join('-')
        const sharedWith = sharedReport.sharedWith
          .filter((cg) => collaborativeGroupIds.includes(cg._id))
          .sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
          )
        const sharedWithNamesStr = sharedWith.map(({ name }) => name).join(', ')
        /**
         * TODO: uncomment below code and add backend support
         * if groupAdmin is allowed to archive shared reports
         */
        // const isGroupAdmin = !!sharedWith.filter(
        //   (cg) => isCGAdmin[cg._id]
        // ).length
        return {
          ...sharedReport,
          sharedWith,
          sharedWithNamesStr,
          reportGroupType,
          reportGroupTypeTitle,
        }
      })
      .sort((a, b) => b.createdAt - a.createdAt)
  }, [sharedReportList, collaborativeGroupList])

  return (
    <>
      <SubHeader breadcrumbData={breadcrumbData} isCliUser={isCliUser} />
      <StyledContainer>
        <TypeToConfirmModal
          modalVisible={showConfirmationModal}
          title="Revoke Sharing"
          handleOnOkClick={handleArchiveReport}
          wordToBeTyped="REVOKE"
          primaryLabel="Are you sure you want to revoke sharing of the following report?"
          secondaryLabel={reportToArchive.title}
          closeModal={() => setReportToArchive({})}
        />
        {isLoading ? (
          <Spin size="small" />
        ) : sharedReportList.length ? (
          <SharedReportsTable
            sharedReportsData={sharedReportsData}
            showReport={showReport}
            setReportToArchive={setReportToArchive}
            currentUserId={currentUserId}
          />
        ) : (
          <Result title="No report found" />
        )}
      </StyledContainer>
    </>
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
