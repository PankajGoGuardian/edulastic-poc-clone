import { CustomModalStyled, EduButton, FlexContainer } from '@edulastic/common'
import React from 'react'

const ConfirmTabChange = ({
  showConfirmationOnTabChange,
  confirmChangeNav,
}) => {
  const Footer = [
    <EduButton isGhost onClick={confirmChangeNav(false)}>
      Cancel
    </EduButton>,
    <EduButton onClick={confirmChangeNav(true)}>Proceed</EduButton>,
  ]
  return (
    <CustomModalStyled
      visible={showConfirmationOnTabChange}
      title="Unsaved AI Generated Items"
      footer={Footer}
      onCancel={confirmChangeNav(false)}
      centered
      padding="30px 60px"
      bodyPadding="0px"
      borderRadius="10px"
      closeTopAlign="14px"
      closeRightAlign="10px"
      closeIconColor="black"
      destroyOnClose
    >
      <FlexContainer justifyContent="center" alignItems="center" padding="2rem">
        <span>Click proceed to save all AI generated items to the Test</span>
      </FlexContainer>
    </CustomModalStyled>
  )
}

export default ConfirmTabChange
