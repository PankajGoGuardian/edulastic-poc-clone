import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Dropdown, Menu } from 'antd'
import { CopyRight } from '@edulastic/common'
import Modal from 'react-responsive-modal'
import { get } from 'lodash'
import { roleuser, signUpState } from '@edulastic/constants'
import { logoutAction } from '../../../src/actions/auth'
import CLILogo from '../../assets/svgs/cli-logo.svg'
import {
  BaseText,
  Button,
  EduLogo,
  HighlightedText,
  IconDropdown,
  StyledLogo,
  StyledSignOut,
  StyledText,
  UserInfo,
  UserName,
} from './styled'
import { setShowWelcomePopupAction } from '../../ducks'
import { getUser } from '../../../src/selectors/user'
import { isPearDomain } from '../../../../../utils/pear'
import {
  edulasticText,
  pearAssessmentText,
} from '../../../../common/utils/helpers'

const CLIAccessBanner = ({
  visible = false,
  firstName = '',
  lastName = '',
  onClose,
  logout,
  userInfo,
  setShowWelcomePopup,
}) => {
  const [isVisible, setVisible] = useState(false)

  const menu = (
    <Menu>
      <Menu.Item onClick={logout}>Sign Out</Menu.Item>
    </Menu>
  )

  const toggleDropdown = () => {
    setVisible(!isVisible)
  }
  return (
    <Modal
      open={visible}
      onClose={() => {}}
      showCloseIcon={false}
      center
      styles={{
        overlay: {
          background: '#067059',
          zIndex: 1002,
        },
        modal: {
          background:
            'linear-gradient(to top,rgb(155, 225, 93) , rgb(0, 179, 115))',
          width: '320px',
          minHeight: '385px',
          borderRadius: 'none',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          boxShadow: 'none',
          opacity: 1,
          padding: '40px 20px',
        },
      }}
    >
      <EduLogo height="30" width="200" />
      <StyledSignOut>
        <Dropdown
          overlay={menu}
          onClick={toggleDropdown}
          className="headerDropdown"
          trigger={['click']}
          style={{ zIndex: 1003 }}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          placement="topCenter"
        >
          <div>
            <UserInfo>
              <UserName>
                {firstName} {lastName}
              </UserName>
            </UserInfo>
            <IconDropdown
              style={{ fontSize: 20, pointerEvents: 'none' }}
              type={isVisible ? 'caret-up' : 'caret-down'}
            />
          </div>
        </Dropdown>
      </StyledSignOut>
      <StyledLogo src={CLILogo} />
      <StyledText data-cy="cliBannerTitle" margin="50px auto 20px auto">
        Welcome to {isPearDomain ? pearAssessmentText : edulasticText}
        {/* <HighlightedText>
          {firstName || lastName ? `${firstName} ${lastName}` : 'Anonymous'}!
        </HighlightedText> */}
      </StyledText>
      <StyledText data-cy="cliBannerDesc" fontSize="16px">
        Your account has been created and you have access to Carnegie Learning
        content in the library.
      </StyledText>
      <Button
        onClick={() => {
          onClose()
          if (
            userInfo.role == roleuser.TEACHER &&
            (userInfo.currentSignUpState === signUpState.SCHOOL_NOT_SELECTED ||
              userInfo.currentSignUpState === signUpState.ACCESS_WITHOUT_SCHOOL)
          ) {
            setShowWelcomePopup(true)
          }
        }}
        data-cy="cliBannerBtn"
      >
        Continue
      </Button>
      <BaseText>
        <CopyRight />
      </BaseText>
    </Modal>
  )
}

export default connect(
  (state) => ({
    firstName: state.user.user.firstName,
    lastName: state.user.user.lastName,
    isCliUser: get(state, 'user.isCliUser', false),
    userInfo: getUser(state),
  }),
  {
    logout: logoutAction,
    setShowWelcomePopup: setShowWelcomePopupAction,
  }
)(CLIAccessBanner)
