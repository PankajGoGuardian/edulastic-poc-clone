import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { EduButton, notification } from '@edulastic/common'
import {
  assignmentPolicyOptions,
  roleuser,
  test as testConst,
  testTypes as testTypesConstants,
} from '@edulastic/constants'
import { IconAssignment } from '@edulastic/icons'
import * as moment from 'moment'
import { connect } from 'react-redux'
import produce from 'immer'
import ListHeader from '../../../src/components/common/ListHeader'
import {
  getUserRole,
  getCurrentTerm,
  getUserOrgId,
} from '../../../src/selectors/user'
import { getDefaultTestSettingsAction } from '../../../TestPage/ducks'
import {
  clearAssignmentSettingsAction,
  getTestEntitySelector,
  updateAssingnmentSettingsAction,
} from '../../duck'
import {
  getRecommendationsToAssignSelector,
  addRecommendationsAction,
  setRecommendationsToAssignAction,
} from '../../../CurriculumSequence/ducks'
import SimpleOptionsModal from '../SimpleOptions/SimpleOptionsModal'
import SimpleOptions from '../SimpleOptions/SimpleOptions'
import {
  Anchor,
  AnchorLink,
  TextAnchor,
  Container,
  FullFlexContainer,
  PaginationInfo,
} from './styled'
import {
  getTestSettings,
  receiveTestSettingAction,
} from '../../../TestSetting/ducks'

const { ASSESSMENT } = testTypesConstants.TEST_TYPES_VALUES_MAP

const AssignRecommendations = ({
  userRole,
  assignmentSettings,
  addRecommendations,
  testSettings,
  termId,
  getDefaultTestSettings,
  updateAssignmentSettings,
  clearAssignmentSettings,
  recommendationsToAssign,
  setRecommendationsToAssign,
  playlistId,
  isModalView,
  isModalVisible,
  toggleModal,
  onClickFullSettings,
  districtTestSettings,
  userOrgId,
  loadTestSetting,
}) => {
  const isAdvancedView = userRole !== roleuser.TEACHER
  const [activeTab, setActiveTab] = useState('1')

  useEffect(() => {
    const isAdmin =
      userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN

    getDefaultTestSettings()

    const testType = assignmentSettings.testType
      ? assignmentSettings.testType
      : isAdmin
      ? testTypesConstants.DEFAULT_ADMIN_TEST_TYPE_MAP[userRole]
      : ASSESSMENT

    const updatedAssignment = {
      startDate: moment(),
      endDate: assignmentSettings.endDate || moment().add('days', 7),
      openPolicy: isAdmin
        ? assignmentPolicyOptions.POLICY_OPEN_MANUALLY_BY_TEACHER
        : assignmentSettings.openPolicy ||
          assignmentPolicyOptions.POLICY_AUTO_ON_STARTDATE,
      closePolicy: isAdmin
        ? assignmentPolicyOptions.POLICY_CLOSE_MANUALLY_BY_ADMIN
        : assignmentSettings.closePolicy ||
          assignmentPolicyOptions.POLICY_AUTO_ON_DUEDATE,
      testType,
      playerSkinType: testSettings.playerSkinType,
      questionPerStandard: assignmentSettings.questionPerStandard,
      termId,
      restrictNavigationOut: testSettings.restrictNavigationOut,
      restrictNavigationOutAttemptsThreshold:
        testSettings.restrictNavigationOutAttemptsThreshold,
      blockSaveAndContinue: testSettings.blockSaveAndContinue,
    }

    updateAssignmentSettings(updatedAssignment)

    loadTestSetting({ orgType: 'district', orgId: userOrgId })

    return () => clearAssignmentSettings()
  }, [])

  const handleTabChange = (key) => setActiveTab(key)

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
      if (
        draft.scoringType ===
        testConst.evalTypeLabels.PARTIAL_CREDIT_IGNORE_INCORRECT
      ) {
        draft.scoringType = testConst.evalTypeLabels.PARTIAL_CREDIT
      }
      draft.startDate = moment(draft.startDate).valueOf()
      draft.endDate = moment(draft.endDate).valueOf()
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
      addRecommendations({ recommendations, toggleAssignModal: toggleModal })
    }
  }

  const selectedStandardsCount = recommendationsToAssign.recommendations.reduce(
    (a, c) => a + (c.standardIdentifiers?.length || 0),
    0
  )

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
  const handleAnchorClick = () =>
    setRecommendationsToAssign({
      isRecommendationAssignView: false,
    })

  const isRecommendingStandards = recommendationsToAssign.recommendations.some(
    (recommendation) => recommendation.standardIdentifiers
  )

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
        <FullFlexContainer justifyContent="space-between">
          <PaginationInfo>
            &lt;{' '}
            {playlistId && (
              <>
                <AnchorLink
                  onClick={handleAnchorClick}
                  to={`/author/playlists/playlist/${playlistId}/use-this`}
                >
                  My Playlist
                </AnchorLink>
                &nbsp;/&nbsp;
              </>
            )}
            <TextAnchor onClick={handleAnchorClick}>Differentation</TextAnchor>
            &nbsp;/&nbsp;
            <Anchor>Assign</Anchor>
          </PaginationInfo>
        </FullFlexContainer>
        <SimpleOptions
          handleTabChange={handleTabChange}
          activeTab={activeTab}
          assignment={assignmentSettings}
          isAdvancedView={isAdvancedView}
          testSettings={testSettings}
          updateOptions={updateAssignmentSettings}
          isAssignRecommendations
          isRecommendingStandards={isRecommendingStandards}
          selectedStandardsCount={selectedStandardsCount}
          districtTestSettings={districtTestSettings}
        />
      </Container>
    </>
  )
}

export default connect(
  (state) => ({
    testSettings: getTestEntitySelector(state),
    userRole: getUserRole(state),
    termId: getCurrentTerm(state),
    recommendationsToAssign: getRecommendationsToAssignSelector(state),
    assignmentSettings: state.assignmentSettings,
    districtTestSettings: getTestSettings(state),
    userOrgId: getUserOrgId(state),
  }),
  {
    getDefaultTestSettings: getDefaultTestSettingsAction,
    updateAssignmentSettings: updateAssingnmentSettingsAction,
    clearAssignmentSettings: clearAssignmentSettingsAction,
    addRecommendations: addRecommendationsAction,
    setRecommendationsToAssign: setRecommendationsToAssignAction,
    loadTestSetting: receiveTestSettingAction,
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
  playlistId: PropTypes.string,
  isModalView: PropTypes.bool,
  isModalVisible: PropTypes.bool,
  toggleModal: PropTypes.func,
  onClickFullSettings: PropTypes.func,
  setRecommendationsToAssign: PropTypes.func.isRequired,
}

AssignRecommendations.defaultProps = {
  isModalView: false,
  isModalVisible: false,
  toggleModal: () => false,
  onClickFullSettings: () => false,
  playlistId: '',
}
