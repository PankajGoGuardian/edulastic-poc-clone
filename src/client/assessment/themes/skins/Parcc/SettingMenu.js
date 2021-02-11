import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Icon, Menu } from 'antd'
import { get } from 'lodash'
import { IconUser } from '@edulastic/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { StyledButton, StyledDropdown, StyledMenu } from './styled'
import { useUtaPauseAllowed } from '../../common/SaveAndExit'

const menuItems = {
  changeColor: 'Change the background and foreground color',
  enableMagnifier: 'Enable Magnifier',
  showLineReaderMask: 'Show Line Reader Mask',
  enableAnswerMask: 'Enable Answer Masking',
  testOptions: 'Test Options',
}
const SettingMenu = ({
  user: { firstName },
  onSettingsChange,
  showMagnifier,
  enableMagnifier,
  utaId,
  hidePause,
}) => {
  const _pauseAllowed = useUtaPauseAllowed(utaId)
  const showPause = _pauseAllowed === undefined ? true : _pauseAllowed

  const menu = (
    <StyledMenu onClick={onSettingsChange}>
      {Object.keys(menuItems).map((key) => (
        <Menu.Item
          key={key}
          disabled={key === 'enableMagnifier' && !showMagnifier}
        >
          {menuItems[key]}
          {key === 'enableMagnifier' && enableMagnifier && (
            <FontAwesomeIcon icon={faCheck} />
          )}
        </Menu.Item>
      ))}
      {showPause && <Menu.Divider />}
      {showPause && (
        <Menu.Item
          disabled={hidePause}
          {...(hidePause
            ? {
                title:
                  'This assignment is configured to completed in a single sitting',
              }
            : {})}
          key="save"
        >
          Save & Exit
        </Menu.Item>
      )}
    </StyledMenu>
  )

  return (
    <StyledDropdown
      overlay={menu}
      getPopupContainer={(triggerNode) => triggerNode.parentNode}
    >
      <StyledButton style={{ width: 'auto' }}>
        <IconUser />
        {firstName} <Icon type="down" />
      </StyledButton>
    </StyledDropdown>
  )
}

const enhance = compose(
  connect(
    (state) => ({
      user: get(state, ['user', 'user'], {}),
    }),
    {}
  )
)

export default enhance(SettingMenu)
