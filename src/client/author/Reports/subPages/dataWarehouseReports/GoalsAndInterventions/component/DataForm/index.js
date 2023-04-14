import React from 'react'
import {
  GOAL,
  INTERVENTION,
  SAVE_GOAL,
  saveGoalFormFields,
  saveInterventionFormFields,
  goalFormSectionHeaders,
  interventionFormSectionHeaders,
} from '../../constants/form'
import {
  StyledFormTitle,
  StyledNavContainer,
  StyledFormWrapper,
  StyledNavWrapper,
  StyledFormContainer,
  StyledNav,
} from './styled-components'
import Form from './Form'
import useSaveFormData from '../../hooks/useSaveFormData'

const DataForm = ({ view }) => {
  const formType = view === SAVE_GOAL ? GOAL : INTERVENTION
  const { formData, handleFieldDataChange } = useSaveFormData({ formType })

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
          <Form
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

export default DataForm
