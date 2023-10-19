import React from 'react'
import {
  CustomModalStyled,
  EduButton,
  TextAreaInputStyled,
} from '@edulastic/common'
import { StyledButton } from './styled'

function DeleteLicenseModal({
  visible,
  onCancel,
  setNotes,
  onDeleteLicense,
  notes,
}) {
  const onChange = (e) => setNotes(e.target.value)
  const footer = (
    <>
      <StyledButton isGhost onClick={onDeleteLicense}>
        Delete
      </StyledButton>
      <EduButton isGhost onClick={onCancel}>
        No
      </EduButton>
    </>
  )
  return (
    <CustomModalStyled
      title=" Delete License"
      visible={visible}
      footer={footer}
      onCancel={onCancel}
    >
      <p>
        Deleting the subscription will revoke access for all the users
        associated with the license. Are you sure you want to do this?
      </p>
      <br />
      <br />
      <TextAreaInputStyled
        height="80px"
        onChange={onChange}
        placeholder="Notes"
        value={notes}
      />
    </CustomModalStyled>
  )
}

export default DeleteLicenseModal
