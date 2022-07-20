import React, { useEffect } from 'react'
import { CustomModalStyled } from '@edulastic/common'
import { connect } from 'react-redux'
import {
  setShowWelcomePopupAction,
  setShowGetStartedModalAction,
} from '../../Dashboard/ducks'
import { GreetingUser, WelcomeHeader, WelcomeNote } from '../styled/styled'
import { getUserNameSelector } from '../../src/selectors/user'

const WelcomePopup = ({
  isVisible,
  setShowWelcomePopup,
  setShowGetStartedModal,
  userName,
}) => {
  const closeModal = () => {
    setShowWelcomePopup(false)
    setShowGetStartedModal(true)
  }

  useEffect(() => {
    const timer = setTimeout(closeModal, 3000)
    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <CustomModalStyled
      visible={isVisible}
      onCancel={closeModal}
      footer={false}
      maskClosable={false}
      centered
      modalWidth="500px"
      borderRadius="10px"
      closeTopAlign="14px"
      closeRightAlign="10px"
      closeIconColor="black"
    >
      <GreetingUser>Hi there, {userName}! 👋</GreetingUser>
      <WelcomeHeader>Welcome to Edulastic!</WelcomeHeader>
      <WelcomeNote>Join our 700K+ community of teachers</WelcomeNote>
    </CustomModalStyled>
  )
}

export default connect(
  (state) => ({
    userName: getUserNameSelector(state),
  }),
  {
    setShowWelcomePopup: setShowWelcomePopupAction,
    setShowGetStartedModal: setShowGetStartedModalAction,
  }
)(WelcomePopup)
