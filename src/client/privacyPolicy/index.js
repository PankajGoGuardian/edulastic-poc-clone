import React, { useEffect, useState } from 'react'
import {
  CheckboxLabel,
  EduButton,
  notification,
  OnWhiteBgLogo,
  SpinLoader,
} from '@edulastic/common'
import { userApi, segmentApi } from '@edulastic/api'
import { connect } from 'react-redux'
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
import { setLocationToUserAction } from '../student/Login/ducks'

const PrivacyPolicyModal = ({ userID, setLocationData }) => {
  const [showSpinner, setShowSpinner] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [showModal, setShowModal] = useState(true)
  const [isEEAUser, setIsEEAUser] = useState(false)

  useEffect(() => {
    setShowSpinner(true)
    segmentApi.genericEventTrack('eulaPopupShown')
    userApi
      .getUserLocation()
      .then(({ result }) => {
        setIsEEAUser(result?.isEEAUser)
        setShowSpinner(false)
        setLocationData(result)
      })
      .catch((e) => {
        setShowSpinner(false)
        console.warn('Error', e)
      })
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
      <ModalTitle data-cy="eulaModalTitle">
        End User License Agreement and Product Privacy Policy
      </ModalTitle>
      <ModalHeaderSubcontent data-cy="eulaModalSubTitle">
        Welcome to <b>Edulastic!</b> Before we proceed, please read our entire
        (1) Terms of Service and End User License Agreement; and (2) Product
        Privacy Policy to make sure we’re on the same page.
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
        data-cy="policyAcceptButton"
        data-testid="acceptButton"
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
          <CheckboxWrapper data-cy="policyAgreeCheckboxText">
            <CheckboxLabel
              onChange={onCheck}
              data-cy="policyAgreeCheckbox"
              data-testid="check"
            >
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

export default connect(() => {}, { setLocationData: setLocationToUserAction })(
  PrivacyPolicyModal
)
