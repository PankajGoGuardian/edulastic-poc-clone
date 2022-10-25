import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Icon, Menu } from 'antd'
import { get } from 'lodash'
import { IconUser } from '@edulastic/icons'
import { withKeyboard } from '@edulastic/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { StyledButton, StyledDropdown, StyledMenu } from './styled'
import { useUtaPauseAllowed } from '../../common/SaveAndExit'
import { getIsMultiLanguageEnabled } from '../../../../common/components/LanguageSelector/duck'

const menuItems = {
  changeColor: 'Change the background and foreground color',
  enableMagnifier: 'Enable Magnifier',
  showLineReaderMask: 'Show Line Reader Mask',
  enableAnswerMask: 'Enable Answer Masking',
  testOptions: 'Test Options',
}

const MenuItem = withKeyboard(Menu.Item)

const SettingMenu = ({
  user: { firstName },
  onSettingsChange,
  showMagnifier,
  enableMagnifier,
  utaId,
  hidePause,
  multiLanguageEnabled,
  isPremiumContentWithoutAccess = false,
  canShowPlaybackOptionTTS,
}) => {
  const _pauseAllowed = useUtaPauseAllowed(utaId)
  const showPause = _pauseAllowed === undefined ? true : _pauseAllowed
  const handleSettingsChange = (e) => e && onSettingsChange(e)

  const menu = (
    <StyledMenu onClick={handleSettingsChange}>
      {Object.keys(menuItems)
        .filter(
          (item) =>
            (item === 'testOptions' && canShowPlaybackOptionTTS) ||
            item !== 'testOptions' ||
            multiLanguageEnabled
        )
        .map((key) => (
          <MenuItem
            key={key}
            aria-label={`Select ${menuItems[key]}`}
            disabled={
              (key === 'enableMagnifier' && !showMagnifier) ||
              isPremiumContentWithoutAccess
            }
            onClick={() => {
              handleSettingsChange({ key })
            }}
          >
            {menuItems[key]}
            {key === 'enableMagnifier' && enableMagnifier && (
              <FontAwesomeIcon icon={faCheck} aria-hidden="true" />
            )}
          </MenuItem>
        ))}
      {showPause && <Menu.Divider />}
      {showPause && (
        <MenuItem
          disabled={hidePause}
          {...(hidePause
            ? {
                title:
                  'This assignment is configured to completed in a single sitting',
              }
            : {})}
          key="save"
          data-cy="finishTest"
          aria-label="Save and exit test"
          onClick={() => {
            handleSettingsChange({ key: 'save' })
          }}
        >
          Save & Exit
        </MenuItem>
      )}
    </StyledMenu>
  )

  return (
    <StyledDropdown
      overlay={menu}
      getPopupContainer={(triggerNode) => triggerNode.parentNode}
      trigger={['hover', 'click']}
    >
      <StyledButton
        style={{ width: 'auto' }}
        data-cy="exitMenu"
        aria-label="Select option"
      >
        <IconUser aria-hidden="true" />
        {firstName} <Icon type="down" aria-hidden="true" />
      </StyledButton>
    </StyledDropdown>
  )
}

const enhance = compose(
  connect(
    (state) => ({
      user: get(state, ['user', 'user'], {}),
      multiLanguageEnabled: getIsMultiLanguageEnabled(state),
    }),
    {}
  )
)

export default enhance(SettingMenu)
