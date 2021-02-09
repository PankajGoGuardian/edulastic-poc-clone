import React from 'react'
import { EduButton, FlexContainer, SearchInputStyled } from '@edulastic/common'
import PropTypes from 'prop-types'

const InviteTeachersSection = ({ setShowInviteTeachersModal }) => {
  const openModal = () => setShowInviteTeachersModal(true)
  const handleOnChange = () => {}
  const handleOnSearch = () => {}
  return (
    <FlexContainer justifyContent="flex-end" padding="10px 0px">
      <EduButton
        isGhost
        height="34px"
        width="140px"
        mr="10px"
        onClick={openModal}
        data-cy="openInvitetTeachersModalBtn"
      >
        ADD TEACHERS
      </EduButton>
      <SearchInputStyled
        placeholder="Search..."
        onChange={(e) => handleOnChange(e)}
        onSearch={(e) => handleOnSearch(e)}
        value=""
        height="34px"
        width="310px"
        data-cy="searchTeachersInputField"
      />
    </FlexContainer>
  )
}

InviteTeachersSection.propTypes = {
  setShowInviteTeachersModal: PropTypes.func,
}
InviteTeachersSection.defaultProps = {
  setShowInviteTeachersModal: () => {},
}

export default InviteTeachersSection
