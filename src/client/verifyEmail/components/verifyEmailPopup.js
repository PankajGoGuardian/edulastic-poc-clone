import React, { useState, useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { withNamespaces } from '@edulastic/localization'
import { textBlackColor } from '@edulastic/colors'
import { CustomModalStyled, EduButton } from '@edulastic/common'
import { withRouter } from 'react-router'
import {
  verifyEmailAction,
  getIsEmailVerifedSelector,
  sendVerificationEmailAction,
  getIsEmailVerificationLinkSent,
  toggleVerifyEmailModalAction,
  getShowVerifyEmailModal,
  getUserId,
  setIsUserOnProfilePageAction,
} from '../../student/Login/ducks'
import { emailRegex } from '../../common/utils/helpers'

const VerifyEmailPopup = (props) => {
  const {
    verifyEmail,
    emailVerifiedStatus,
    emailVerified,
    sendVerificationEmail,
    isEmailVerificationLinkSent,
    ShowVerifyEmailModal,
    isUserIdPresent,
    toggleVerifyEmailModal,
    uid,
    match,
    role,
    flag = false,
    verificationTS = null,
    onProfilePage,
    email,
    setIsUserOnProfilePage,
  } = props
  const [userId, setUserId] = useState(null)
  const [isInvalidEmail, setIsInvalidEmail] = useState(false)
  const { vc } = match.params

  let expiryDate
  if (verificationTS) {
    const existingVerificationTS = new Date(verificationTS)
    expiryDate = new Date(
      existingVerificationTS.setDate(existingVerificationTS.getDate() + 14)
    ).getTime()
  }

  useEffect(() => {
    if (vc) {
      toggleVerifyEmailModal(true)
      verifyEmail({ vc })
    }
  }, [])

  useEffect(() => {
    setUserId(uid)
  }, [uid])

  const handleRedirect = () => {
    window.location.replace('/')
  }

  const sendVerificationLink = () => {
    sendVerificationEmail({ uid: userId })
  }

  const handleClose = () => {
    toggleVerifyEmailModal(false)
    if (onProfilePage) {
      setIsUserOnProfilePage(false)
    }
    if (flag) return
    const pathname = window.location.pathname
    if (pathname.indexOf('verify') > -1) {
      window.location.replace('/')
    } else if (
      pathname === '/author/reports' ||
      pathname === '/author/assignments'
    ) {
      window.location.replace(
        role === 'teacher' ? '/author/dashboard' : '/author/items'
      )
    }
  }

  const getModalContent = () => {
    if (onProfilePage && !emailRegex.test(email)) {
      setIsInvalidEmail(true)
      return 'Please provide a valid email address for verification.'
    }
    if (emailVerifiedStatus.length || emailVerified) {
      if (emailVerifiedStatus === 'linkExpired') {
        return 'The link has expired and is no longer valid.'
      }
      if (emailVerifiedStatus === 'alreadyVerified') {
        return 'Your email has already been verified.'
      }
      if (emailVerifiedStatus === 'success' || emailVerified) {
        return 'Your email address has been verified.'
      }
      if (emailVerifiedStatus === 'failed') {
        return 'Your email address could not be verified. Please request a new verification link!'
      }
    }
    if (isEmailVerificationLinkSent) {
      if (isEmailVerificationLinkSent === 'success') {
        if (!onProfilePage && !window.location.pathname.includes('/verify/')) {
          return 'A verification link has been sent to your email. Please click the link to verify and continue using Edulastic.'
        }
        return 'A verification link has been sent to your email. Please click the link to verify.'
      }
      if (isEmailVerificationLinkSent === 'failed') {
        return 'Failed to send the verification mail. Please try again later.'
      }
    }
    if (flag && !verificationTS) {
      return 'Your email address has not been verified. Please request a new verification link!'
    }
    if (
      (flag && verificationTS && expiryDate < Date.now()) ||
      (verificationTS && expiryDate < Date.now())
    ) {
      return 'The link has expired and is no longer valid.'
    }
    if (uid && !vc && !isEmailVerificationLinkSent && !emailVerified) {
      return 'A verification link has already been sent to your email address. Please click the link to verify your account and continue using Edulastic.'
    }
  }

  const footer = (
    <>
      {(uid && !vc) ||
      isEmailVerificationLinkSent === 'success' ||
      emailVerifiedStatus === 'linkExpired' ||
      emailVerifiedStatus === 'failed' ||
      onProfilePage ? (
        <EduButton type="primary" isGhost height="37px" onClick={handleClose}>
          Close
        </EduButton>
      ) : null}
      {isEmailVerificationLinkSent !== 'success' &&
      (!flag ||
        (flag && !verificationTS) ||
        (flag && verificationTS && expiryDate < Date.now())) &&
      uid &&
      isUserIdPresent &&
      !isInvalidEmail ? (
        <EduButton
          height="37px"
          onClick={
            (emailVerifiedStatus === 'success' ||
              emailVerified ||
              emailVerifiedStatus === 'alreadyVerified') &&
            !flag
              ? handleRedirect
              : sendVerificationLink
          }
        >
          {(emailVerifiedStatus === 'success' ||
            emailVerified ||
            emailVerifiedStatus === 'alreadyVerified') &&
          !flag
            ? 'Continue'
            : 'Request New Link'}
        </EduButton>
      ) : null}
    </>
  )

  return (
    <>
      {emailVerifiedStatus !== '' ||
      (uid && !vc) ||
      isEmailVerificationLinkSent ? (
        <StyledVerifyEmailPopup
          modalWidth="500px"
          title="Verify Account"
          visible={ShowVerifyEmailModal}
          footer={footer}
          onCancel={() => handleClose()}
          destroyOnClose
          textAlign="left"
        >
          <Description>{getModalContent()}</Description>
        </StyledVerifyEmailPopup>
      ) : null}
    </>
  )
}

const StyledVerifyEmailPopup = styled(CustomModalStyled)`
  .ant-modal-content {
    color: ${textBlackColor};
    padding: 2em 3em;
    width: 500px;
    .ant-modal-close-x {
      margin-right: -18px;
    }
  }
`
const Description = styled.div`
  line-height: 2;
`

const enhance = compose(
  withRouter,
  withNamespaces('login'),
  connect(
    (state) => ({
      onProfilePage: state?.user?.onProfilePage || false,
      email: state?.user?.user?.email || state?.user?.user?.username || '',
      flag: state?.user?.signedUpUsingUsernameAndPassword || false,
      role: state?.user?.user?.role || null,
      isUserIdPresent: state?.user?.isUserIdPresent,
      emailVerified: state?.user?.user?.emailVerified || false,
      verificationTS: state?.user?.user?.verificationTS || null,
      emailVerifiedStatus: getIsEmailVerifedSelector(state),
      isEmailVerificationLinkSent: getIsEmailVerificationLinkSent(state),
      ShowVerifyEmailModal: getShowVerifyEmailModal(state),
      uid: getUserId(state),
    }),
    {
      verifyEmail: verifyEmailAction,
      sendVerificationEmail: sendVerificationEmailAction,
      toggleVerifyEmailModal: toggleVerifyEmailModalAction,
      setIsUserOnProfilePage: setIsUserOnProfilePageAction,
    }
  )
)

const ConnectedStyledVerifyEmailPopup = enhance(VerifyEmailPopup)

export { ConnectedStyledVerifyEmailPopup as VerifyEmailPopup }
