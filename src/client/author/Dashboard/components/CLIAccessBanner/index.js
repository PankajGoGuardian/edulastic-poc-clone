import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Dropdown, Menu } from 'antd'
import Modal from 'react-responsive-modal'
import qs from 'qs'
import { get } from 'lodash'
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

const CLIAccessBanner = ({
  visible = false,
  firstName = '',
  lastName = '',
  onClose,
  logout,
  location,
  isCliUser,
}) => {
  const [isVisible, setVisible] = useState(false)

  const menu = (
    <Menu>
      <Menu.Item onClick={logout}>Sign Out</Menu.Item>
    </Menu>
  )

  const query = qs.parse(location.search, { ignoreQueryPrefix: true })
  const { cliUser } = query
  const isShowBanner = cliUser || isCliUser

  const toggleDropdown = () => {
    setVisible(!isVisible)
  }
  return (
    !isShowBanner && (
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
        <EduLogo />
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
        <StyledText margin="50px auto 20px auto">
          Welcome{' '}
          <HighlightedText>
            {firstName || lastName ? `${firstName} ${lastName}` : 'Anonymous'}!
          </HighlightedText>
        </StyledText>
        <StyledText fontSize="16px">
          You now have access to <br /> CLI collection.
        </StyledText>
        <Button
          onClick={() => {
            onClose()
          }}
        >
          Continue
        </Button>
        <BaseText>Edulastic @ 2020 - All rights reserved.</BaseText>
      </Modal>
    )
  )
}

export default connect(
  (state) => ({
    firstName: state.user.user.firstName,
    lastName: state.user.user.lastName,
    isCliUser: get(state, 'user.isCliUser', false),
  }),
  {
    logout: logoutAction,
  }
)(CLIAccessBanner)
