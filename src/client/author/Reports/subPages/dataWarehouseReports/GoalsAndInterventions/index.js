import React from 'react'
import {
  GOAL,
  INTERVENTION,
  SAVE_GOAL,
  saveGoalFormFields,
  saveInterventionFormFields,
  goalFormSectionHeaders,
  interventionFormSectionHeaders,
} from './constants'
import {
  StyledFormTitle,
  StyledNavContainer,
  StyledFormWrapper,
  StyledNavWrapper,
  StyledFormContainer,
  StyledNav,
} from './styled-components'
import SaveGoal from './SaveGoal'
import useSaveData from './useSaveData'

const GoalsAndInterventions = ({ view }) => {
  const formType = view === SAVE_GOAL ? GOAL : INTERVENTION
  const { formData, handleFieldDataChange } = useSaveData({ formType })

  const allFormFields =
    view === SAVE_GOAL ? saveGoalFormFields : saveInterventionFormFields

  const sectionHeaders =
    view === SAVE_GOAL ? goalFormSectionHeaders : interventionFormSectionHeaders

  return (
    <>
      <StyledFormWrapper>
        <StyledNavWrapper>
          <StyledNavContainer>
            <StyledFormTitle>
              Set {view === SAVE_GOAL ? 'Goal' : 'Intervention'} Criteria
            </StyledFormTitle>
            <StyledNav />
          </StyledNavContainer>
        </StyledNavWrapper>
        <StyledFormContainer span={18}>
          <SaveGoal
            allFormFields={allFormFields}
            sectionHeaders={sectionHeaders}
            formData={formData}
            handleFieldDataChange={handleFieldDataChange}
          />
        </StyledFormContainer>
      </StyledFormWrapper>
    </>
  )
}

export default GoalsAndInterventions
