import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { EduButton, notification } from '@edulastic/common'
import {
  assignmentPolicyOptions,
  roleuser,
  test as testConst,
} from '@edulastic/constants'
import { IconAssignment } from '@edulastic/icons'
import * as moment from 'moment'
import { connect } from 'react-redux'
import produce from 'immer'
import ListHeader from '../../../src/components/common/ListHeader'
import { getUserRole } from '../../../src/selectors/user'
import { getDefaultTestSettingsAction } from '../../../TestPage/ducks'
import {
  clearAssignmentSettingsAction,
  getTestEntitySelector,
  updateAssingnmentSettingsAction,
} from '../../duck'
import {
  getRecommendationsToAssignSelector,
  addRecommendationsAction,
} from '../../../CurriculumSequence/ducks'
import SimpleOptionsModal from '../SimpleOptions/SimpleOptionsModal'
import SimpleOptions from '../SimpleOptions/SimpleOptions'
import AdvancedOptions from '../AdvancedOptons/AdvancedOptons'
import { Container } from './styled'

const { ASSESSMENT, COMMON } = testConst.type

const AssignRecommendations = ({
  userRole,
  assignmentSettings,
  addRecommendations,
  testSettings,
  getDefaultTestSettings,
  updateAssignmentSettings,
  clearAssignmentSettings,
  recommendationsToAssign,
  defaultTestProfiles,
  isModalView,
  isModalVisible,
  toggleModal,
  onClickFullSettings,
}) => {
  const isAdvancedView = userRole !== roleuser.TEACHER

  useEffect(() => {
    const isAdmin =
      userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN

    getDefaultTestSettings()

    const updatedAssignment = {
      startDate: moment(),
      endDate: moment().add('days', 7),
      openPolicy: isAdmin
        ? assignmentPolicyOptions.POLICY_OPEN_MANUALLY_BY_TEACHER
        : assignmentSettings.openPolicy ||
          assignmentPolicyOptions.POLICY_AUTO_ON_STARTDATE,
      closePolicy: isAdmin
        ? assignmentPolicyOptions.POLICY_CLOSE_MANUALLY_BY_ADMIN
        : assignmentSettings.closePolicy ||
          assignmentPolicyOptions.POLICY_AUTO_ON_DUEDATE,
      testType: isAdmin ? COMMON : ASSESSMENT,
      playerSkinType: testSettings.playerSkinType,
    }

    updateAssignmentSettings(updatedAssignment)

    return () => clearAssignmentSettings()
  }, [])

  const handleAssign = () => {
    if (recommendationsToAssign.isAssigning) {
      return
    }

    const updatedAssignmentSettings = produce(assignmentSettings, (draft) => {
      if (
        draft.passwordPolicy !==
        testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC
      ) {
        delete draft.passwordExpireIn
      }
      if (
        draft.passwordPolicy &&
        draft.passwordPolicy !==
          testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_STATIC
      ) {
        delete draft.assignmentPassword
      }
    })

    if (
      assignmentSettings.passwordPolicy ===
        testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_STATIC &&
      assignmentSettings.assignmentPassword &&
      (assignmentSettings?.assignmentPassword?.trim().length < 6 ||
        assignmentSettings?.assignmentPassword?.trim().length > 25)
    ) {
      notification({ messageKey: 'enterValidPassword' })
      return
    }

    if (assignmentSettings.endDate < Date.now()) {
      notification({ messageKey: 'endDate' })
      return
    }

    const recommendations = recommendationsToAssign.recommendations.map(
      (recommendation) => ({
        ...recommendation,
        assignmentSettings: updatedAssignmentSettings,
      })
    )

    if (recommendations.length) {
      addRecommendations(recommendations)
    }
  }

  const renderHeaderButton = () => (
    <EduButton
      isBlue
      data-cy="assignButton"
      onClick={handleAssign}
      disabled={recommendationsToAssign.isAssigning}
    >
      ASSIGN
    </EduButton>
  )

  if (isModalView) {
    return (
      <SimpleOptionsModal
        assignment={assignmentSettings}
        testSettings={testSettings}
        updateOptions={updateAssignmentSettings}
        handleAssign={handleAssign}
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}
        onClickFullSettings={onClickFullSettings}
        isAssignRecommendations
      />
    )
  }

  const title = recommendationsToAssign.recommendations[0]?.resourceTitle

  return (
    <>
      <ListHeader
        title={`Assign ${title}`}
        midTitle=""
        titleIcon={IconAssignment}
        btnTitle="ASSIGN"
        renderButton={renderHeaderButton}
      />
      <Container>
        {isAdvancedView ? (
          <AdvancedOptions
            assignment={assignmentSettings}
            updateOptions={updateAssignmentSettings}
            testSettings={testSettings}
            defaultTestProfiles={defaultTestProfiles}
            isAssignRecommendations
          />
        ) : (
          <SimpleOptions
            assignment={assignmentSettings}
            testSettings={testSettings}
            updateOptions={updateAssignmentSettings}
            isAssignRecommendations
          />
        )}
      </Container>
    </>
  )
}

export default connect(
  (state) => ({
    testSettings: getTestEntitySelector(state),
    userRole: getUserRole(state),
    recommendationsToAssign: getRecommendationsToAssignSelector(state),
    assignmentSettings: state.assignmentSettings,
  }),
  {
    getDefaultTestSettings: getDefaultTestSettingsAction,
    updateAssignmentSettings: updateAssingnmentSettingsAction,
    clearAssignmentSettings: clearAssignmentSettingsAction,
    addRecommendations: addRecommendationsAction,
  }
)(AssignRecommendations)

AssignRecommendations.propTypes = {
  userRole: PropTypes.string.isRequired,
  assignmentSettings: PropTypes.object.isRequired,
  addRecommendations: PropTypes.func.isRequired,
  getDefaultTestSettings: PropTypes.func.isRequired,
  updateAssignmentSettings: PropTypes.func.isRequired,
  clearAssignmentSettings: PropTypes.func.isRequired,
  recommendationsToAssign: PropTypes.object.isRequired,
  testSettings: PropTypes.object.isRequired,
  defaultTestProfiles: PropTypes.object,
  isModalView: PropTypes.bool,
  isModalVisible: PropTypes.bool,
  toggleModal: PropTypes.func,
  onClickFullSettings: PropTypes.func,
}

AssignRecommendations.defaultProps = {
  defaultTestProfiles: {},
  isModalView: false,
  isModalVisible: false,
  toggleModal: () => false,
  onClickFullSettings: () => false,
}
