import React from 'react'
import { EduButton } from '@edulastic/common'
import { ButtonsContainer } from '../../common/styled'

export default function UserRegistrationModalFooter({
  handleCancel,
  handleOk,
  t,
}) {
  return (
    <ButtonsContainer>
      <EduButton isGhost onClick={handleCancel}>
        {t('manageByUser.userRegistration.cancel')}
      </EduButton>
      <EduButton onClick={handleOk}>
        {t('manageByUser.userRegistration.createUser')}
      </EduButton>
    </ButtonsContainer>
  )
}
