import React from 'react'
import { IconWarnTriangle } from '@edulastic/icons'
import { CustomModalStyled, EduButton, FlexContainer } from '@edulastic/common'
import { SUPPORT_EMAIL } from '../../../../common/utils/static/emails'
import { StyledFlexContainer } from '../Container/styled'

const IgnoreRaceInfoModal = ({ visible, onClose }) => {
  return (
    <CustomModalStyled
      visible={visible}
      onCancel={onClose}
      title="Apologies, this setting cannot be changed directly"
      footer={
        <FlexContainer justifyContent="flex-end" width="100%">
          <EduButton
            height="40px"
            width="120px"
            key="okButton"
            fontSize="12px"
            onClick={onClose}
          >
            OKAY
          </EduButton>
        </FlexContainer>
      }
      centered
    >
      <StyledFlexContainer>
        <IconWarnTriangle />
        <p>
          Please contact <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>{' '}
          for assistance with updating this setting.
          <br /> <br /> Note: This setting can only be changed for the following
          rosters: Clever, Atlas, and OneRoster.
        </p>
      </StyledFlexContainer>
    </CustomModalStyled>
  )
}

export default IgnoreRaceInfoModal
