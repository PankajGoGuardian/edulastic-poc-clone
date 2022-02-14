/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState } from 'react'
import styled from 'styled-components'
import {
  CustomModalStyled,
  CheckboxLabel,
  EduButton,
  notification,
} from '@edulastic/common'
import { userApi } from '@edulastic/api'
import { darkGrey2, lightGrey8, greyThemeDark1 } from '@edulastic/colors'

import PrivacyPolicyText from './privacyPolicyText'

const PrivacyPolicyModal = ({ userID }) => {
  const [isChecked, setIsChecked] = useState(false)
  const [showModal, setShowModal] = useState(true)

  const onCheck = (value) => {
    setIsChecked(value?.target?.checked)
  }

  const onAccept = () => {
    const payload = {
      userId: userID,
      isPolicyAccepted: isChecked,
    }
    userApi.updateUserDetails(payload).catch((e) => {
      notification({
        msg: e?.response?.data?.message,
      })
    })
    setShowModal(false)
  }

  const headerContent = (
    <>
      <ModalTitle>
        End User License Agreement and Product Privacy Policy
      </ModalTitle>
      <ModalHeaderSubcontent>
        Welcome to Edulastic! We are so excited to start helping you protect
        your students. But before we proceed, please read our entire End user
        License Agreement to make sure that we’re on the same page.”
      </ModalHeaderSubcontent>
    </>
  )

  const footer = (
    <>
      <p> scroll to the bottom of page to accept</p>
      <EduButton
        disabled={!isChecked}
        onClick={onAccept}
        style={{ marginLeft: '15px' }}
      >
        ACCEPT
      </EduButton>
    </>
  )
  return (
    <StyledPrivacyPolicyModal
      visible={showModal}
      closable={false}
      footer={footer}
      title={headerContent}
      width="80%"
      height="100vh"
    >
      <ModalTextBody>
        <PrivacyPolicyText />
        <CheckboxWrapper>
          <CheckboxLabel onChange={onCheck}>
            By checking the box and clicking “Accept”, I agree to the Terms of
            Service and End User License Agreement and Privacy Policy of the
            Product
          </CheckboxLabel>
        </CheckboxWrapper>
      </ModalTextBody>
    </StyledPrivacyPolicyModal>
  )
}

const StyledPrivacyPolicyModal = styled(CustomModalStyled)`
  position: absolute;
  left: 50%;
  top: 54%;
  transform: translate(-50%, -50%);
  .ant-modal-body {
    background-color: white;
    height: 80%;
    padding: 10px 24px;
  }
  .ant-modal-content {
    height: 90%;
  }
  .ant-modal-header {
    border: none;
    padding: 10px 24px;
  }
  .ant-modal-footer {
    background-color: white;
    display: flex;
    justify-content: end;
    align-items: center;
    border: none;
    padding-bottom: 10px;
  }
`

const ModalTitle = styled.h6`
  color: ${greyThemeDark1};
  font-size: 20px;
  font-weight: bold;
  margin-top: 10px;
`

const ModalHeaderSubcontent = styled.p`
  width: 100%;
  color: ${greyThemeDark1};
  font-size: 12px;
  line-height: 1.5;
`

const ModalTextBody = styled.div`
  text-align: left;
  font-size: 12px;
  letter-spacing: 0px;
  color: ${darkGrey2};
  background: #f8f8f8;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c7c7c7 0% 0% no-repeat padding-box;
    border-radius: 33px;
    opacity: 1;
    height: 70px;
  }
`

const Styledp = styled.p`
  white-space: pre-wrap;
`
const CheckboxWrapper = styled.div`
  padding: 0px 10px;
  background: ${lightGrey8};
`

export default PrivacyPolicyModal
