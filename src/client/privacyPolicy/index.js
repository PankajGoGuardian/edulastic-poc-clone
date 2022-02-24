/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useEffect, useState } from 'react'
import {
  CheckboxLabel,
  EduButton,
  notification,
  OnWhiteBgLogo,
  SpinLoader,
} from '@edulastic/common'
import { userApi, segmentApi } from '@edulastic/api'
import EulaPolicyContent from './eulaPolicyContent'
import ProductPolicyContent from './productPolicyContent'
import EeaPolicyContent from './eeaPolicyContent'
import {
  CheckboxWrapper,
  EdulasticLogo,
  ModalHeaderSubcontent,
  ModalTextBody,
  ModalTitle,
  StyledPrivacyPolicyModal,
} from './Styled'

const PrivacyPolicyModal = ({ userID, isEEAUser }) => {
  const [showSpinner, setShowSpinner] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [showModal, setShowModal] = useState(true)

  useEffect(() => {
    segmentApi.genericEventTrack('eulaPopupShown')
  }, [])

  const onCheck = (value) => {
    setIsChecked(value?.target?.checked)
  }

  const onAccept = () => {
    const payload = {
      userId: userID,
      isPolicyAccepted: isChecked,
    }
    segmentApi.genericEventTrack('eulaPolicyAccepted')
    setShowSpinner(true)
    userApi
      .eulaPolicyStatusUpdate(payload)
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
        user License Agreement to make sure that we’re on the same page.
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

export default PrivacyPolicyModal
