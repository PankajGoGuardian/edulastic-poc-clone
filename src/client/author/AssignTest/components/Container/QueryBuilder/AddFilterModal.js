import React, { useState } from 'react'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'
import { Input } from 'antd'
import { EduButton, CustomModalStyled } from '@edulastic/common'
import styled from 'styled-components'
import { ModalTitle } from '../../../../AssessmentPage/common/Modal'
import { setIsAdvancedSearchSelectedAction } from '../../../../AdvanceSearch/ducks'

const ExtendedInput = ({ onChange, filterName }) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value)
    }
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

const StyledParagraph = styled.p`
  font: normal normal 600 10px/14px Open Sans;
  color: #434b5d;
  letter-spacing: 0px;
  text-transform: uppercase;
  opacity: 1;
`

const FooterContainer = styled.div`
  display: flex;
`

const StyledInput = styled(Input)`
  background: #f8f8f8 0% 0% no-repeat padding-box;
  border: 1px solid #b9b9b9;
  border-radius: 2px;
  opacity: 1;
  height: 32px;
`
