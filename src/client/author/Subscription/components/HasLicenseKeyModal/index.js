import {
  CustomModalStyled,
  EduButton,
  FlexContainer,
  notification,
  TextInputStyled,
} from '@edulastic/common'
import React, { useState } from 'react'
import { Container, ExpiryDate } from './styled'

const getFooterComponent = ({
  hideModal,
  nextAction,
  isSubscribed,
  verificationPending,
}) =>
  !isSubscribed ? (
    <FlexContainer width="450px">
      <EduButton
        isGhost
        isBlue
        onClick={hideModal}
        disabled={verificationPending}
        width="190px"
      >
        CANCEL
      </EduButton>
      <EduButton
        isBlue
        onClick={nextAction}
        disabled={verificationPending}
        inverse
        width="190px"
      >
        NEXT
      </EduButton>
    </FlexContainer>
  ) : (
    <FlexContainer width="450px">
      <EduButton width="200px" isBlue onClick={hideModal} inverse>
        DONE
      </EduButton>
    </FlexContainer>
  )

const HasLicenseKeyModal = (props) => {
  const {
    visible = false,
    closeModal,
    verifyAndUpgradeLicense,
    expDate,
    isSubscribed = false,
    verificationPending = false,
    isPaidPremium,
    subType,
  } = props

  const [licenseKey, setLicenseKey] = useState()

  const hideModal = () => {
    setLicenseKey('')
    closeModal()
  }

  const handleChange = (e) => setLicenseKey(e.target.value)

  const nextAction = () => {
    if (licenseKey) verifyAndUpgradeLicense(licenseKey)
    else notification({ type: 'warn', messageKey: 'pleaseEnterLisence' })
  }

  return (
    <CustomModalStyled
      visible={visible}
      title={
        <h3 style={{ fontWeight: 700, fontSize: '22px' }}>
          Upgrade to Premium
        </h3>
      }
      onCancel={hideModal}
      footer={[
        getFooterComponent({
          hideModal,
          nextAction,
          isSubscribed,
          verificationPending,
        }),
      ]}
      centered
    >
      {isPaidPremium ? (
        <Container width="300">
          <h4>Congratulations!</h4>
          <p>
            Your account is upgraded to Premium version for a year and the
            subscription will expire on
          </p>
          <ExpiryDate>{expDate}</ExpiryDate>
          <br />
        </Container>
      ) : subType === 'TRIAL_PREMIUM' ? (
        <Container width="300">
          <h4>Congratulations!</h4>
          <p>
            Your account is upgraded to <b>Trial Premium version</b>, and the
            subscription will expire on
          </p>
          <ExpiryDate>{expDate}</ExpiryDate>
          <br />
        </Container>
      ) : (
        <Container width="480">
          <p>
            Enter your License Key that you received at the end of the order
            process or via email in the box below, the click on &quot;Next&quot;
          </p>
          <TextInputStyled
            placeholder="Enter your license key"
            value={licenseKey}
            onChange={handleChange}
            disabled={verificationPending}
          />
          <br />
        </Container>
      )}
    </CustomModalStyled>
  )
}

export default HasLicenseKeyModal
