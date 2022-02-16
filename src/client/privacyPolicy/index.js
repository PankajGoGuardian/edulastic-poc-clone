/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState } from 'react'
import styled from 'styled-components'
import {
  CustomModalStyled,
  CheckboxLabel,
  EduButton,
  notification,
  OnWhiteBgLogo,
  SpinLoader,
} from '@edulastic/common'
import { userApi } from '@edulastic/api'
import { darkGrey2, lightGrey8, greyThemeDark1 } from '@edulastic/colors'

import EulaPolicyContent from './eulaPolicyContent'
import ProductPolicyContent from './productPolicyContent'
import EeaPolicyContent from './eeaPolicyContent'

const PrivacyPolicyModal = ({ userID, isEEAUser }) => {
  const [showSpinner, setShowSpinner] = useState(false)
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
    setShowSpinner(true)
    userApi
      .updateUserDetails(payload)
      .then(() => {
        setShowModal(false)
      })
      .catch((e) => {
        setShowSpinner(false)
        notification({
          msg: e?.response?.data?.message,
        })
      })
  }

  const headerContent = (
    <>
      <EdulasticLogo>
        <OnWhiteBgLogo />
      </EdulasticLogo>
      <ModalTitle>
        End User License Agreement and Product Privacy Policy
      </ModalTitle>
      <ModalHeaderSubcontent>
        Welcome to <b>Edulastic!</b> We are so excited to start helping you
        protect your students. But before we proceed, please read our entire End
        user License Agreement to make sure that we’re on the same page.”
      </ModalHeaderSubcontent>
    </>
  )

  const footer = (
    <>
      <p>Scroll to the bottom of the page and tick the checkbox to accept</p>

      <EduButton
        disabled={!isChecked || showSpinner}
        onClick={onAccept}
        ml="15px"
        fontSize="17px"
        height="40px"
        width="150px"
      >
        ACCEPT
      </EduButton>
    </>
  )
  return (
    <>
      <StyledPrivacyPolicyModal
        wrapClassName="privacyPolicyModal"
        visible={showModal}
        closable={false}
        footer={footer}
        title={headerContent}
        width="80%"
        height="calc(100vh - 50px)"
        maskStyle={{
          background: 'rgba(0,0,0,0.8)',
          zIndex: '300000',
        }}
      >
        {showSpinner && <SpinLoader />}
        <ModalTextBody>
          <EulaPolicyContent />
          <ProductPolicyContent />
          {isEEAUser && <EeaPolicyContent />}
          <CheckboxWrapper>
            <CheckboxLabel onChange={onCheck}>
              By checking the box and clicking “Accept”, I agree to the Terms of
              Service and End User License Agreement and Privacy Policy of the
              Product
            </CheckboxLabel>
          </CheckboxWrapper>
        </ModalTextBody>
      </StyledPrivacyPolicyModal>
    </>
  )
}

const EdulasticLogo = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px;
`

const StyledPrivacyPolicyModal = styled(CustomModalStyled)`
  top: 50px;
  .ant-modal-body {
    background-color: white;
    height: calc(100% - 170px);
    padding: 10px 24px;
    p {
      font-weight: normal !important;
    }
  }
  .ant-modal-content {
    height: calc(100vh - 100px);
  }
  .ant-modal-header {
    border: none;
    padding: 10px 24px;
  }
  .ant-modal-footer {
    display: flex;
    justify-content: end !important;
    align-items: center;
    background-color: white;
    border: none;
    padding-bottom: 10px;
    p {
      font-weight: 600;
    }
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
  font-size: 14px;
  line-height: 1.5;
  font-weight: normal;
`

const ModalTextBody = styled.div`
  text-align: left;
  font-size: 12px;
  letter-spacing: 0px;
  color: ${darkGrey2} !important;
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
const CheckboxWrapper = styled.div`
  padding: 5px 10px;
  background: ${lightGrey8};
  .ant-checkbox-wrapper {
    font-weight: bold;
    .ant-checkbox .ant-checkbox-inner {
      border-color: #000000;
    }
  }
`

export default PrivacyPolicyModal
