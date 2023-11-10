import React, { useState } from 'react'
import { Modal, Input, Spin } from 'antd'
import styled from 'styled-components'
import { authApi } from '@edulastic/api'
import { EduButton, EduIf } from '@edulastic/common'
import { themeColor } from '@edulastic/colors'
import { IconHash } from '@edulastic/icons'

const ClassCodeContainer = ({
  visible,
  setVisibility,
  disabled,
  onProceed,
}) => {
  const [classCode, setClassCode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onChangeClassCode = (e) => {
    setErrorMessage('')
    setClassCode(e.target.value)
  }

  const handleProceed = async () => {
    setIsLoading(true)
    try {
      await authApi.validateClassCode({
        classCode,
        role: 'student',
        signOnMethod: 'userNameAndPassword',
      })
      onProceed(classCode)
    } catch (e) {
      setErrorMessage(e?.response?.data?.message || 'Unknown Error')
    }
    setIsLoading(false)
  }

  return (
    <StyledModal visible={visible} footer={null} closable={false}>
      <Spin spinning={isLoading}>
        <ModalContentWrapper>
          <StyledHeader>Enter Class Code</StyledHeader>
          <p>Code will be given by your teacher</p>
          <StyledInput
            prefix={<IconHash color={themeColor} />}
            data-cy="classCode"
            placeholder="Class code"
            onChange={onChangeClassCode}
          />
          <EduIf condition={errorMessage}>
            <ErrorText>{errorMessage}</ErrorText>
          </EduIf>
          <ButtonsContainer>
            <EduButton isGhost onClick={() => setVisibility(false)}>
              Cancel
            </EduButton>

            <EduButton disabled={disabled} onClick={handleProceed}>
              Proceed
            </EduButton>
          </ButtonsContainer>
        </ModalContentWrapper>
      </Spin>
    </StyledModal>
  )
}

export default ClassCodeContainer

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  padding-top: 10px;
`

const StyledModal = styled(Modal)`
  top: 40%;
  .ant-modal-content {
    border-radius: 15px;
    .ant-modal-header {
      border: none;
      border-radius: 15px;
    }
  }
`

const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const StyledInput = styled(Input)`
  width: 40%;
  min-width: 300px;
  margin: 20px auto 20px;
`

const StyledHeader = styled.h3`
  font-weight: 700;
`

const ErrorText = styled.p`
  margin-top: -18px;
  margin-bottom: 10px;
  font-size: 13px;
  color: red;
`
