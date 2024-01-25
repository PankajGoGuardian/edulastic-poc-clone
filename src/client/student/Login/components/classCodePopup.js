import React from 'react'
import styled from 'styled-components'
import { Input } from 'antd'

import { CustomModalStyled, EduButton } from '@edulastic/common'
import { lightGrey, lightGrey9 } from '@edulastic/colors'

export const ClassCodePopup = ({
  visible,
  classCode,
  handleClassCodeChange,
  toggleClassCodeModal,
  onOk,
}) => {
  const onCancel = () => {
    handleClassCodeChange('')
    toggleClassCodeModal(false)
  }

  return (
    <CustomModalStyled
      visible={visible}
      onCancel={onCancel}
      footer={[
        <ModalFooter marginTop="35px">
          <EduButton isGhost onClick={onCancel}>
            No, Cancel
          </EduButton>
          <EduButton
            data-cy="signInButton"
            onClick={onOk}
            disabled={!classCode}
          >
            Yes, Sign In
          </EduButton>
        </ModalFooter>,
      ]}
    >
      <ModalContent>
        <p>
          Please sign-in to your district-specific page. Contact your
          teacher/administrator for the correct sign-in link.
        </p>
        <p>OR</p>
        <p>
          <FieldLabel>Use Class Code</FieldLabel>
          <StyledInput
            data-cy="classCodeInput"
            type="text"
            placeholder="Enter Class Code"
            value={classCode}
            onChange={(event) => handleClassCodeChange(event.target.value)}
          />
        </p>
      </ModalContent>
    </CustomModalStyled>
  )
}

const ModalContent = styled.div`
  margin-top: 25px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const FieldLabel = styled.span`
  margin-right: 10px;
`

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.marginTop};
  .ant-btn {
    width: 150px;
  }
`

const StyledInput = styled(Input)`
  margin: 0 auto;
  width: 100px;
  text-align: center;
  width: 70%;
  margin-top: 15px;
  background: ${lightGrey};
  padding: 20px;
  &::placeholder {
    text-align: left;
    color: ${lightGrey9};
  }
  &:focus::placeholder {
    color: transparent;
  }
`
