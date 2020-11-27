import React from 'react'
import styled from 'styled-components'
import { IconClose, IconAlert } from '@edulastic/icons'
import { EduButton, CustomModalStyled } from '@edulastic/common'
import { title } from '@edulastic/colors'

const PassageConfirmationModal = ({
  visible,
  closeModal,
  itemsCount,
  handleResponse,
  removing,
}) => {
  const Footer = [
    <EduButton
      isGhost
      onClick={() => handleResponse(false)}
      height="40px"
      width="200px"
    >
      No, I will select
    </EduButton>,
    <EduButton onClick={() => handleResponse(true)} height="40px" width="200px">
      Yes, {removing ? `Remove` : `Add`} all
    </EduButton>,
  ]

  return (
    <CustomModalStyled
      centered
      closable={false}
      textAlign="left"
      visible={visible}
      footer={Footer}
      bodyPadding="0px"
      onCancel={closeModal}
    >
      <ModalHeader>
        <ModalHeaderTitle>
          <IconAlert width={28} height={24} />
          <span>Add passage item to test</span>
        </ModalHeaderTitle>
        <EduButton
          IconBtn
          isGhost
          width="28px"
          height="28px"
          onClick={closeModal}
          title="Close"
          noHover
          noBorder
        >
          <CloseIcon width={16} height={16} />
        </EduButton>
      </ModalHeader>
      <ModalContent>
        <p>
          {`There are ${itemsCount} items in this passage. Would you like`}
          <br />
          {`to ${removing ? `remove` : `add`} them ${
            removing ? `from` : `to`
          } your
          test?`}
        </p>
      </ModalContent>
    </CustomModalStyled>
  )
}

export default PassageConfirmationModal

const ModalContent = styled.div`
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    text-align: center;
  }
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const ModalHeaderTitle = styled.div`
  display: flex;
  align-items: center;
  color: ${title};
  font-weight: bold;
  font-size: 18px;

  span {
    margin-left: 16px;
  }
`

const CloseIcon = styled(IconClose)`
  fill: ${title} !important;
`
