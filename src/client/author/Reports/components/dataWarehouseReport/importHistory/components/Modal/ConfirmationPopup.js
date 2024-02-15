import { CustomModalStyled, EduButton, FlexContainer } from '@edulastic/common'
import React from 'react'
import { IconAlertCircle } from '@edulastic/icons'
import { themeColor } from '@edulastic/colors'
import { Header } from '../../../common/components/StyledComponents'

const ConfirmationPopup = ({ handleDeleteFile, closeModal, isVisible }) => {
  return (
    <CustomModalStyled
      modalWidth="465px"
      style={{ height: '264px' }}
      padding="50px 60px 20px 60px"
      visible={isVisible}
      maskClosable={false}
      onCancel={() => closeModal()}
      footer={false}
      centered
    >
      <Header $margin="-40px 0 0 0px">
        Are you sure you’d like to delete this file?
      </Header>
      <FlexContainer mt="30px">
        <IconAlertCircle fill={themeColor} style={{ margin: '15px 30px' }} />
        <h3>This file will be permanently deleted from the system.</h3>
      </FlexContainer>
      <FlexContainer justifyContent="right" mt="20px">
        <EduButton onClick={() => closeModal()} isGhost>
          Cancel
        </EduButton>
        <EduButton data-cy="deleteButton" onClick={() => handleDeleteFile()}>
          Delete
        </EduButton>
      </FlexContainer>
    </CustomModalStyled>
  )
}

export default ConfirmationPopup
