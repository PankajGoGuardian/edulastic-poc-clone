import React from 'react'
import { EduButton, FlexContainer, SearchInputStyled } from '@edulastic/common'
import PropTypes from 'prop-types'

const AddUsersSection = ({
  setShowAddUsersModal,
  handleTableSearch,
  searchValue,
}) => {
  const openModal = () => setShowAddUsersModal(true)
  return (
    <FlexContainer justifyContent="flex-end" padding="10px 0px">
      <EduButton
        isGhost
        height="34px"
        width="140px"
        mr="10px"
        onClick={openModal}
        data-cy="openAddUsersModalBtn"
      >
        ADD USER(S)
      </EduButton>
      <SearchInputStyled
        placeholder="Search..."
        height="34px"
        width="310px"
        data-cy="searchUsersInputField"
        value={searchValue}
        onChange={handleTableSearch}
      />
    </FlexContainer>
  )
}

AddUsersSection.propTypes = {
  setShowAddUsersModal: PropTypes.func,
}
AddUsersSection.defaultProps = {
  setShowAddUsersModal: () => {},
}

export default AddUsersSection
