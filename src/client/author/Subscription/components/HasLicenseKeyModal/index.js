import {
  greyishBorder,
  lightGreySecondary,
  themeColor,
} from '@edulastic/colors'
import {
  CustomModalStyled,
  EduButton,
  FlexContainer,
  notification,
} from '@edulastic/common'
import { Input } from 'antd'
import React, { useState } from 'react'
import { Container } from './styled'

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
      {!isPaidPremium ? (
        <Container width="300">
          <h4 style={{ fontWeight: 700 }}>Congratulations!</h4>
          <p>
            Your account is upgraded to Premium version for a year and the
            subscription will expire on
          </p>
          <p style={{ color: themeColor, paddingTop: '8px', fontWeight: 600 }}>
            {expDate}
          </p>
          <br />
        </Container>
      ) : subType === 'TRIAL_PREMIUM' ? (
        <Container width="300">
          <h4 style={{ fontWeight: 700 }}>Congratulations!</h4>
          <p>
            Your account is upgraded to <b>Trial Premium version</b>, and the
            subscription will expire on
          </p>
          <p style={{ color: themeColor, paddingTop: '8px', fontWeight: 600 }}>
            {expDate}
          </p>
          <br />
        </Container>
      ) : (
        <Container width="480">
          <p>
            Enter your License Key that you received at the end of the order
            process or via email in the box below, the click on &quot;Next&quot;
          </p>
          <Input
            placeholder="Enter your license key"
            style={{
              width: '85%',
              height: '50px',
              background: lightGreySecondary,
              border: `1px solid ${greyishBorder}`,
              margin: 'auto',
            }}
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
