import React, { useEffect } from 'react'
import { Spin } from 'antd'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { roleuser } from '@edulastic/constants'
import { testsApi } from '@edulastic/api'
import { getUser } from '../../author/src/selectors/user'
import { fetchAssignmentsByTestIdAction } from '../ducks'
import {
  fetchAssignmentsByTestAction,
  getAllAssignmentsSelector,
} from '../../publicTest/ducks'
import {
  startAssignmentAction,
  resumeAssignmentAction,
} from '../../student/Assignments/ducks'
import { redirectToStudentPage } from '../../publicTest/utils'

const { STUDENT, TEACHER, DISTRICT_ADMIN, SCHOOL_ADMIN } = roleuser

const AssignmentEmbedLink = ({
  user = {},
  match,
  fetchAssignmentsByTestId,
  fetchAssignmentsForStudent,
  loadingAssignments,
  assignments,
  startAssignment,
  resumeAssignment,
  history,
  isVersionId,
}) => {
  const { testId, versionId } = match.params
  useEffect(() => {
    ;(async () => {
      const { role } = user
      if ([TEACHER, DISTRICT_ADMIN, SCHOOL_ADMIN].includes(role)) {
        fetchAssignmentsByTestId(testId)
      } else if (role === STUDENT) {
        if (isVersionId && versionId) {
          const latestTest = await testsApi.getTestIdFromVersionId(versionId)
          fetchAssignmentsForStudent({ testId: latestTest.testId })
        } else {
          fetchAssignmentsForStudent({ testId })
        }
      }
    })()
  }, [])

  useEffect(() => {
    if (user?.role === STUDENT && loadingAssignments === false) {
      redirectToStudentPage(
        assignments,
        history,
        startAssignment,
        resumeAssignment
      )
    }
  }, [loadingAssignments])

  return <Spin />
}

export default connect(
  (state) => ({
    user: getUser(state),
    loadingAssignments: get(state, 'publicTest.loadingAssignments'),
    assignments: getAllAssignmentsSelector(state),
  }),
  {
    fetchAssignmentsByTestId: fetchAssignmentsByTestIdAction,
    fetchAssignmentsForStudent: fetchAssignmentsByTestAction,
    startAssignment: startAssignmentAction,
    resumeAssignment: resumeAssignmentAction,
  }
)(AssignmentEmbedLink)
