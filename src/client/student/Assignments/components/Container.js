import React, { useEffect, useState } from 'react'
import { largeDesktopWidth } from '@edulastic/colors'
import { useRealtimeV2 } from '@edulastic/common'
import useInterval from '@use-it/interval'
import { Layout, Spin } from 'antd'
import { get, values } from 'lodash'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import NoDataNotification from '../../../common/components/NoDataNotification'
import { getClasses, getCurrentGroup } from '../../Login/ducks'
// components
import AssignmentCard from '../../sharedComponents/AssignmentCard'
import {
  addRealtimeAssignmentAction,
  removeAssignmentAction,
  rerenderAssignmentsAction,
  setSelectedLanguageAction,
  updateTestIdRealTimeAction,
} from '../../sharedDucks/AssignmentModule/ducks'
import {
  addRealtimeReportAction,
  setAssignmentIsPausedAction,
} from '../../sharedDucks/ReportsModule/ducks'
import { Wrapper } from '../../styled'
// actions
import {
  assignmentsSelector,
  fetchAssignmentsAction,
  getAssignmentsSelector,
  transformAssignmentForRedirect,
  assignmentIdsByTestIdSelector,
  assignmentIdsGroupIdsByTestIdSelector,
  notStartedReportsByAssignmentId,
  getSelectedLanguageSelector,
} from '../ducks'
import EmbeddedVideoPreviewModal from '../../../author/CurriculumSequence/components/ManageContentBlock/components/EmbeddedVideoPreviewModal'
import { getUserNameSelector } from '../../../author/src/selectors/user'

const withinThreshold = (targetDate, threshold) => {
  const diff = new Date(targetDate) - Date.now()
  if (diff <= threshold) {
    return true
  }
  return false
}

/**
 *
 * @param {Object[]} assignments
 * @returns {boolean}
 */
const needRealtimeDateTracking = (assignments) => {
  const threshold = 24 * 60 * 60 * 1000 // 24 hours
  for (const assignment of assignments) {
    if (assignment.endDate && withinThreshold(assignment.endDate, threshold)) {
      return true
    }
    for (const cls of assignment.class) {
      if (cls.startDate && withinThreshold(cls.startDate, threshold)) {
        return true
      }
      if (cls.endDate && withinThreshold(cls.endDate, threshold)) {
        return true
      }
    }
  }
  return false
}

const Content = ({
  flag,
  assignments,
  fetchAssignments,
  currentGroup,
  allClasses = [],
  userId,
  addRealtimeAssignment,
  addRealtimeReport,
  isLoading,
  rerenderAssignments,
  allAssignments,
  removeAssignment,
  currentChild,
  assignmentIdsByTestId,
  updateTestIdRealTime,
  notStartedReportsByAssignment,
  setAssignmentIsPaused,
  setSelectedLanguage,
  languagePreference,
  assignmentsGrousByTestId,
  userName,
}) => {
  const [
    showVideoResourcePreviewModal,
    seShowVideoResourcePreviewModal,
  ] = useState(null)

  useEffect(() => {
    fetchAssignments(currentGroup)
  }, [currentChild, currentGroup])

  const topics = [
    `student_assignment:user:${userId}`,
    ...(currentGroup
      ? [`student_assignment:class:${currentGroup}`]
      : allClasses.map((x) => `student_assignment:class:${x._id}`)),
  ]

  const transformAssignment = (payload) => {
    addRealtimeAssignment(
      transformAssignmentForRedirect(
        currentGroup,
        userId,
        allClasses,
        {},
        {},
        payload
      )
    )
  }
  const regradeWatchTestIdTopics = Object.keys(
    assignmentsGrousByTestId
  ).flatMap((item) => [
    `student_assessment:test:${item}`,
    ...[...assignmentsGrousByTestId[item]].map(
      (g) => `student_assessment:test:${item}:group:${g}`
    ),
  ])
  if (regradeWatchTestIdTopics.length) {
    topics.push(...regradeWatchTestIdTopics)
  }
  useRealtimeV2(
    topics,
    {
      addAssignment: transformAssignment,
      addReport: addRealtimeReport,
      'absentee-mark': addRealtimeReport,
      'open-assignment': transformAssignment,
      'close-assignment': transformAssignment,
      removeAssignment,
      regradedAssignment: (payload) => {
        const assignmentIds = assignmentIdsByTestId[payload.oldTestId]
        if (assignmentIds && assignmentIds.length) {
          return updateTestIdRealTime({ assignmentIds, ...payload })
        }
      },
      'toggle-pause-assignment': (payload) => {
        const { activitiesByUserId, paused } = payload
        const utaId = activitiesByUserId[userId]
        if (utaId) {
          setAssignmentIsPaused({ utaId, paused })
        }
      },
    },
    { topicsWillBeAdded: true }
  )

  useInterval(() => {
    if (needRealtimeDateTracking(allAssignments)) {
      rerenderAssignments()
    }
  }, 60 * 1000)

  const noDataNotification = () => (
    <NoDataNotification
      heading="No Assignments "
      description={
        "You don't have any currently assigned or completed assignments."
      }
    />
  )

  const setEmbeddedVideoPreviewModal = (x) => seShowVideoResourcePreviewModal(x)
  const resetVideoPreviewModal = () => seShowVideoResourcePreviewModal(null)

  const renderAssignments = () => (
    <AssignmentWrapper>
      {assignments.map((item, i) => (
        <AssignmentCard
          key={`${item._id}_${item.classId}`}
          data={item}
          classId={item.classId}
          index={i}
          type="assignment"
          uta={notStartedReportsByAssignment[`${item._id}_${item.classId}`]}
          languagePreference={languagePreference}
          setSelectedLanguage={setSelectedLanguage}
          setEmbeddedVideoPreviewModal={setEmbeddedVideoPreviewModal}
          userName={userName}
        />
      ))}
    </AssignmentWrapper>
  )

  const showLoader = () => <Spin size="small" />

  return (
    <LayoutContent flag={flag}>
      <Wrapper>
        {!isLoading
          ? assignments && assignments.length > 0
            ? renderAssignments()
            : noDataNotification()
          : showLoader()}
      </Wrapper>

      {showVideoResourcePreviewModal && (
        <EmbeddedVideoPreviewModal
          isVisible={showVideoResourcePreviewModal}
          closeCallback={resetVideoPreviewModal}
        />
      )}
    </LayoutContent>
  )
}

export default connect(
  (state) => ({
    flag: state.ui.flag,
    currentGroup: getCurrentGroup(state),
    userName: getUserNameSelector(state),
    assignments: getAssignmentsSelector(state),
    allAssignments: values(assignmentsSelector(state)),
    allClasses: getClasses(state),
    userId: get(state, 'user.user._id'),
    isLoading: get(state, 'studentAssignment.isLoading'),
    currentChild: state?.user?.currentChild,
    assignmentIdsByTestId: assignmentIdsByTestIdSelector(state),
    assignmentsGrousByTestId: assignmentIdsGroupIdsByTestIdSelector(state),
    notStartedReportsByAssignment: notStartedReportsByAssignmentId(state),
    languagePreference: getSelectedLanguageSelector(state),
  }),
  {
    fetchAssignments: fetchAssignmentsAction,
    addRealtimeAssignment: addRealtimeAssignmentAction,
    addRealtimeReport: addRealtimeReportAction,
    rerenderAssignments: rerenderAssignmentsAction,
    removeAssignment: removeAssignmentAction,
    updateTestIdRealTime: updateTestIdRealTimeAction,
    setAssignmentIsPaused: setAssignmentIsPausedAction,
    setSelectedLanguage: setSelectedLanguageAction,
  }
)(Content)

Content.propTypes = {
  flag: PropTypes.bool.isRequired,
  assignments: PropTypes.array,
  fetchAssignments: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  currentGroup: PropTypes.string.isRequired,
  allClasses: PropTypes.object.isRequired,
  allAssignments: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  addRealtimeAssignment: PropTypes.func.isRequired,
  addRealtimeReport: PropTypes.func.isRequired,
  rerenderAssignments: PropTypes.func.isRequired,
}

Content.defaultProps = {
  assignments: [],
}

const LayoutContent = styled(Layout.Content)`
  width: 100%;
`

const AssignmentWrapper = styled.div`
  @media (max-width: ${largeDesktopWidth}) {
    margin-top: -3px;
  }
`
