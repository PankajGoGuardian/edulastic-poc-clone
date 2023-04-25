import { EduElse, EduIf, EduThen } from '@edulastic/common'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import VerticalScrollNavigation from '../../../../../../../common/components/VerticalScrollNavigation'
import {
  getPerformanceBandProfilesSelector,
  receivePerformanceBandAction,
} from '../../../../../../PerformanceBand/ducks'
import {
  fetchGroupsAction,
  getGroupsSelector,
} from '../../../../../../sharedDucks/groups'
import {
  getCurrentActiveTerms,
  getCurrentTerm,
} from '../../../../../../src/selectors/user'
import {
  GOAL,
  INTERVENTION,
  SAVE_GOAL,
  formNavigationLabels,
  formSectionExtraData,
  goalFormFields,
  interventionFormFields,
} from '../../constants/form'
import { actions } from '../../ducks/actionReducers'
import {
  attendanceBandList,
  formStatus,
  goalsList,
  isFormDataSaving,
} from '../../ducks/selectors'
import useSaveFormData from '../../hooks/useSaveFormData'
import Form from './Form'
import {
  StyledButton,
  StyledFormButtonsContainer,
  StyledFormContainer,
  StyledFormHeader,
  StyledFormTitle,
  StyledNavContainer,
  StyledNavWrapper,
} from '../../common/components/Form/styled-components'

const {
  [GOAL]: {
    sectionHeader: goalFormSectionHeaders,
    sectionTitle: goalFormSectionTitles,
  },
  [INTERVENTION]: {
    sectionHeader: interventionFormSectionHeaders,
    sectionTitle: interventionFormSectionTitles,
  },
} = formSectionExtraData

const {
  goal: goalFormNavigationLabels,
  intervention: interventionFormNavigationLabels,
} = formNavigationLabels

const CreateGI = ({
  view,
  fetchGroupsData,
  fetchPerformanceBandData,
  fetchGoalsList,
  fetchInterventionsList,
  groupsData,
  performanceBandData,
  goalsOptionsData,
  saveFormData,
  isSaveInProgress,
  group,
  onCancel,
  resetFormData,
  currentFormStatus,
  fetchAttendanceBandData,
  attendanceBandData,
  activeTerms,
  currentTermId,
}) => {
  const isSaveGoalView = view === SAVE_GOAL
  const formType = isSaveGoalView ? GOAL : INTERVENTION

  const termDetails = activeTerms.find(({ _id }) => _id === currentTermId) || {}

  const { startDate, endDate } = termDetails

  const {
    formData,
    groupOptions,
    performanceBandOptions,
    targetPerformanceBandOptions,
    goalsOptions,
    scrollContainer,
    formNavigationOptions,
    formContainerRef,
    handleFieldDataChange,
    handleSaveForm,
    setFormNavigationOptions,
    attendanceBandOptions,
    targetAttendanceBandOptions,
    resetForm,
  } = useSaveFormData({
    formType,
    fetchGroupsData,
    fetchPerformanceBandData,
    fetchGoalsList,
    groupsData,
    performanceBandData,
    goalsOptionsData,
    saveFormData,
    fetchAttendanceBandData,
    attendanceBandData,
    termDetails,
  })

  useEffect(() => {
    if (currentFormStatus === 'finished') {
      fetchGroupsData()
      fetchGoalsList()
      if (formType === INTERVENTION) {
        fetchInterventionsList()
      }
      resetForm()
      resetFormData()
      onCancel()
    }
  }, [currentFormStatus])

  const onCancelClick = () => {
    resetForm()
    onCancel()
  }

  const allFormFields = isSaveGoalView
    ? goalFormFields({ type: formData.type, startDate, endDate })
    : interventionFormFields({ type: formData.type, startDate, endDate })

  if (group) {
    if (!formData.studentGroupIds) {
      handleFieldDataChange('studentGroupIds', group._id)
    }
  }

  const sectionHeaders = isSaveGoalView
    ? goalFormSectionHeaders
    : interventionFormSectionHeaders

  const sectionTitles = isSaveGoalView
    ? goalFormSectionTitles
    : interventionFormSectionTitles

  const formNavigationLabelOptions = isSaveGoalView
    ? goalFormNavigationLabels
    : interventionFormNavigationLabels

  return (
    <div>
      <StyledFormHeader>
        <StyledFormTitle>
          {' '}
          Set {view === SAVE_GOAL ? 'Goal' : 'Intervention'} Criteria
        </StyledFormTitle>
        <StyledFormButtonsContainer>
          <StyledButton isGhost onClick={onCancelClick}>
            Cancel
          </StyledButton>
          <StyledButton onClick={handleSaveForm} disabled={isSaveInProgress}>
            <EduIf condition={isSaveInProgress}>
              <EduThen>Saving...</EduThen>
              <EduElse>
                Save {view === SAVE_GOAL ? 'Goal' : 'Intervention'}
              </EduElse>
            </EduIf>
          </StyledButton>
        </StyledFormButtonsContainer>
      </StyledFormHeader>
      <div style={{ display: 'flex' }}>
        <StyledNavWrapper>
          <StyledNavContainer>
            <VerticalScrollNavigation
              sections={formNavigationOptions}
              scrollContainer={scrollContainer}
              headerHeight={70}
            />
          </StyledNavContainer>
        </StyledNavWrapper>
        <StyledFormContainer ref={formContainerRef}>
          <Form
            allFormFields={allFormFields}
            sectionHeaders={sectionHeaders}
            sectionTitles={sectionTitles}
            formData={formData}
            handleFieldDataChange={handleFieldDataChange}
            groupOptions={groupOptions}
            performanceBandOptions={performanceBandOptions}
            attendanceBandOptions={attendanceBandOptions}
            targetPerformanceBandOptions={targetPerformanceBandOptions}
            targetAttendanceBandOptions={targetAttendanceBandOptions}
            goalsOptions={goalsOptions}
            setNavigationOptions={setFormNavigationOptions}
            formNavigationLabelOptions={formNavigationLabelOptions}
          />
        </StyledFormContainer>
      </div>
    </div>
  )
}

export default connect(
  (state) => ({
    groupsData: getGroupsSelector(state),
    performanceBandData: getPerformanceBandProfilesSelector(state),
    attendanceBandData: attendanceBandList(state),
    goalsOptionsData: goalsList(state),
    isSaveInProgress: isFormDataSaving(state),
    currentFormStatus: formStatus(state),
    activeTerms: getCurrentActiveTerms(state),
    currentTermId: getCurrentTerm(state),
  }),
  {
    fetchGroupsData: fetchGroupsAction,
    fetchPerformanceBandData: receivePerformanceBandAction,
    fetchAttendanceBandData: actions.getAttendanceBandList,
    fetchGoalsList: actions.getGoalsList,
    saveFormData: actions.saveFormDataRequest,
    resetFormData: actions.resetFormData,
    fetchInterventionsList: actions.getInterventionsList,
  }
)(CreateGI)
