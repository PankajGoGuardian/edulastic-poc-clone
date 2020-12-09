import React, { useEffect } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Layout from "antd/es/layout";
import Spin from "antd/es/spin";
import { get } from 'lodash'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { useRealtimeV2 } from '@edulastic/common'
import { getCurrentGroup } from '../../Login/ducks'

// actions
import { fetchAssignmentsAction, getAssignmentsSelector } from '../ducks'

// components
import AssignmentCard from '../../sharedComponents/AssignmentCard'
import NoDataNotification from '../../../common/components/NoDataNotification'
import { assignmentIdsByTestIdSelector } from '../../Assignments/ducks'
import { updateTestIdRealTimeAction } from '../../sharedDucks/AssignmentModule/ducks'

const Content = ({
  flag,
  assignments,
  fetchAssignments,
  currentGroup,
  isLoading,
  currentChild,
  location: { state = {} },
  assignmentIdsByTestId,
  updateTestIdRealTime,
}) => {
  useEffect(() => {
    fetchAssignments(currentGroup)
  }, [currentChild, currentGroup])
  const topics = Object.keys(assignmentIdsByTestId).map(
    (item) => `student_assessment:test:${item}`
  )

  useRealtimeV2(topics, {
    regradedAssignment: (payload) => {
      const assignmentIds = assignmentIdsByTestId[payload.oldTestId]
      if (assignmentIds && assignmentIds.length) {
        return updateTestIdRealTime({ assignmentIds, ...payload })
      }
    },
  })
  if (isLoading) {
    return <Spin size="large" />
  }
  const { highlightAssignment } = state
  return (
    <LayoutContent flag={flag}>
      <Wrapper>
        {assignments.length < 1 ? (
          <NoDataNotification
            heading="No Grades"
            description="You don't have any completed assignment."
          />
        ) : (
          assignments.map((item, i) => (
            <AssignmentCard
              key={`${item._id}_${item.classId}`}
              data={item}
              classId={item.classId}
              type="reports"
              highlightMode={item._id === highlightAssignment}
              index={i}
            />
          ))
        )}
      </Wrapper>
    </LayoutContent>
  )
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      flag: state.ui.flag,
      currentGroup: getCurrentGroup(state),
      isLoading: get(state, 'studentAssignment.isLoading'),
      assignments: getAssignmentsSelector(state),
      currentChild: state?.user?.currentChild,
      assignmentIdsByTestId: assignmentIdsByTestIdSelector(state),
    }),
    {
      fetchAssignments: fetchAssignmentsAction,
      updateTestIdRealTime: updateTestIdRealTimeAction,
    }
  )
)

export default enhance(Content)

Content.propTypes = {
  flag: PropTypes.bool.isRequired,
  assignments: PropTypes.array,
  fetchAssignments: PropTypes.func.isRequired,
}

Content.defaultProps = {
  assignments: [],
}

const LayoutContent = styled(Layout.Content)`
  min-height: 75vh;
  width: 100%;
`

const Wrapper = styled.div`
  height: 100%;
  margin: 15px 0px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.assignment.cardContainerBgColor};
  position: relative;
`
