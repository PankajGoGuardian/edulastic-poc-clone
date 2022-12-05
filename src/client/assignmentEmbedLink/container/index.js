import React, { useEffect } from 'react'
import { Spin } from 'antd'
import { connect } from 'react-redux'
import { get } from 'lodash'
import * as Sentry from '@sentry/browser'
import { roleuser } from '@edulastic/constants'
import notfification from '@edulastic/common/src/components/Notification'
import { getUser } from '../../author/src/selectors/user'
import { fetchAssignmentsByTestIdAction } from '../ducks'
import {
  fetchAssignmentsByTestAction,
  getAllAssignmentsSelector,
} from '../../publicTest/ducks'
import {
  startAssignmentAction,
  resumeAssignmentAction,
  getSelectedLanguageSelector,
} from '../../student/Assignments/ducks'
import { redirectToStudentPage } from '../../publicTest/utils'
import { setSelectedLanguageAction } from '../../student/sharedDucks/AssignmentModule/ducks'

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
  languagePreference,
  setSelectedLanguage,
}) => {
  const { testId, versionId } = match.params
  useEffect(() => {
    ;(async () => {
      const { role } = user
      if ([TEACHER, DISTRICT_ADMIN, SCHOOL_ADMIN].includes(role)) {
        fetchAssignmentsByTestId(testId)
      } else if (role === STUDENT) {
        if (isVersionId && versionId) {
          try {
            fetchAssignmentsForStudent({ testId: versionId })
          } catch (err) {
            if (!err?.response) {
              Sentry.captureException(err)
            }
            history.push('/home/assignments')
            notfification({
              type: 'warning',
              msg: 'This assignment is not available.',
            })
          }
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
        resumeAssignment,
        {},
        languagePreference,
        setSelectedLanguage
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
    languagePreference: getSelectedLanguageSelector(state),
  }),
  {
    fetchAssignmentsByTestId: fetchAssignmentsByTestIdAction,
    fetchAssignmentsForStudent: fetchAssignmentsByTestAction,
    startAssignment: startAssignmentAction,
    resumeAssignment: resumeAssignmentAction,
    setSelectedLanguage: setSelectedLanguageAction,
  }
)(AssignmentEmbedLink)
