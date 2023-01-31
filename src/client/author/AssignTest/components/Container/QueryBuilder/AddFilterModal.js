import React, { useState } from 'react'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'
import { EduButton, CustomModalStyled } from '@edulastic/common'
import { ModalTitle } from '../../../../AssessmentPage/common/Modal'
import { setIsAdvancedSearchSelectedAction } from '../../../../AdvanceSearch/ducks'
import { StyledParagraph, StyledInput, FooterContainer } from './styled'

const ExtendedInput = ({ onChange, filterName }) => {
  const handleChange = (e) => {
    onChange(e.target.value)
  }

  return (
    <StyledInput
      placeholder="Enter quick filter name"
      onChange={handleChange}
      value={filterName}
    />
  )
}

const AddFilterModal = ({
  onCancel,
  onSave,
  visibile,
  quickFilterModalDetails,
  setIsAdvancedSearchSelected,
}) => {
  const isEdit = !isEmpty(quickFilterModalDetails)
  const initFilterName = isEdit ? quickFilterModalDetails?.name : ''
  const [filterName, setFilterName] = useState(initFilterName)

  const handleCancel = () => {
    onCancel()
  }

  return (
    <CustomModalStyled
      centered
      width="495px"
      visible={visibile}
      title={
        <ModalTitle margin="0">
          {isEdit ? 'Rename the Existing Filter' : 'Create New Quick Filter'}
        </ModalTitle>
      }
      onCancel={handleCancel}
      footer={
        <FooterContainer>
          <EduButton
            isGhost
            data-cy="cancel"
            key="back"
            variant="create"
            onClick={handleCancel}
          >
            Cancel
          </EduButton>
          <EduButton
            data-cy="submit"
            key="submit"
            color="primary"
            variant="create"
            onClick={() => {
              onSave(filterName)
              setIsAdvancedSearchSelected(true)
            }}
          >
            {isEdit ? `Update Filter` : 'Create New Filter'}
          </EduButton>
        </FooterContainer>
      }
    >
      <StyledParagraph>QUICK FILTER NAME</StyledParagraph>
      <ExtendedInput
        onChange={setFilterName}
        visible={isEdit}
        filterName={filterName}
      />
    </CustomModalStyled>
  )
}

export default connect(null, {
  setIsAdvancedSearchSelected: setIsAdvancedSearchSelectedAction,
})(AddFilterModal)
