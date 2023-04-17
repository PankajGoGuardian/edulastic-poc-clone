import React from 'react'
import { connect } from 'react-redux'
import { EduElse, EduIf, EduThen } from '@edulastic/common'
import {
  GOAL,
  INTERVENTION,
  SAVE_GOAL,
  goalFormFields,
  interventionFormFields,
  formSectionExtraData,
  formNavigationLabels,
} from '../../constants/form'
import {
  StyledFormTitle,
  StyledNavContainer,
  StyledNavWrapper,
  StyledFormContainer,
  StyledFormHeader,
  StyledFormButtonsContainer,
  StyledButton,
} from './styled-components'
import {
  fetchGroupsAction,
  getGroupsSelector,
} from '../../../../../../sharedDucks/groups'
import {
  receivePerformanceBandAction,
  getPerformanceBandProfilesSelector,
} from '../../../../../../PerformanceBand/ducks'
import { isFormDataSaving } from '../../ducks/selectors'
import { actions } from '../../ducks/actionReducers'
import Form from './Form'
import VerticalScrollNavigation from '../../../../../../../common/components/VerticalScrollNavigation'
import useSaveFormData from '../../hooks/useSaveFormData'

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

const { saveFormDataRequest } = actions

const {
  goal: goalFormNavigationLabels,
  intervention: interventionFormNavigationLabels,
} = formNavigationLabels

const DataForm = ({
  view,
  fetchGroupsData,
  fetchPerformanceBandData,
  groupsData,
  performanceBandData,
  saveFormData,
  isSaveInProgress,
}) => {
  const isSaveGoalView = view === SAVE_GOAL
  const formType = isSaveGoalView ? GOAL : INTERVENTION

  const {
    formData,
    groupOptions,
    performanceBandOptions,
    targetPerformanceBandOptions,
    scrollContainer,
    formNavigationOptions,
    formContainerRef,
    handleFieldDataChange,
    handleSaveForm,
    setFormNavigationOptions,
  } = useSaveFormData({
    formType,
    fetchGroupsData,
    fetchPerformanceBandData,
    groupsData,
    performanceBandData,
    saveFormData,
  })

  const allFormFields = isSaveGoalView ? goalFormFields : interventionFormFields

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
          <StyledButton isGhost>Cancel</StyledButton>
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
      <div
        ref={formContainerRef}
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: '50vh',
          overflow: 'auto',
        }}
      >
        <StyledNavWrapper>
          <StyledNavContainer>
            <VerticalScrollNavigation
              sections={formNavigationOptions}
              scrollContainer={scrollContainer}
              headerHeight={70}
            />
          </StyledNavContainer>
        </StyledNavWrapper>
        <StyledFormContainer>
          <Form
            allFormFields={allFormFields}
            sectionHeaders={sectionHeaders}
            sectionTitles={sectionTitles}
            formData={formData}
            handleFieldDataChange={handleFieldDataChange}
            groupOptions={groupOptions}
            performanceBandOptions={performanceBandOptions}
            targetPerformanceBandOptions={targetPerformanceBandOptions}
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
    isSaveInProgress: isFormDataSaving(state),
  }),
  {
    fetchGroupsData: fetchGroupsAction,
    fetchPerformanceBandData: receivePerformanceBandAction,
    saveFormData: saveFormDataRequest,
  }
)(DataForm)
