import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Icon, Menu } from 'antd'
import { IconUser } from '@edulastic/icons'
import { withKeyboard } from '@edulastic/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { StyledButton, StyledDropdown, StyledMenu } from './styled'
import { useUtaPauseAllowed } from '../../common/SaveAndExit'
import { getIsMultiLanguageEnabled } from '../../../../common/components/LanguageSelectorTab/duck'
import { lineReaderVisible } from '../../../../common/components/LineReader/duck'
import { getUserNameSelector } from '../../../../author/src/selectors/user'

const MenuItem = withKeyboard(Menu.Item)

const SettingMenu = ({
  userName,
  onSettingsChange,
  showMagnifier,
  enableMagnifier,
  utaId,
  hidePause,
  multiLanguageEnabled,
  isPremiumContentWithoutAccess = false,
  canShowPlaybackOptionTTS,
  isLineReaderVisible,
  i18Translate,
}) => {
  const _pauseAllowed = useUtaPauseAllowed(utaId)
  const showPause = _pauseAllowed === undefined ? true : _pauseAllowed
  const handleSettingsChange = (e) => e && onSettingsChange(e)

  const menuItems = {
    changeColor: i18Translate('header:headerMenuOptions.changeColor'),
    enableMagnifier: i18Translate('header:headerMenuOptions.enableMagnifier'),
    showLineReaderMask: i18Translate(
      'header:headerMenuOptions.showLineReaderMask'
    ),
    enableAnswerMask: i18Translate('header:headerMenuOptions.enableAnswerMask'),
    testOptions: i18Translate('header:headerMenuOptions.testOptions'),
  }

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
            disabled={
              (key === 'enableMagnifier' && !showMagnifier) ||
              isPremiumContentWithoutAccess
            }
            data-cy={key}
            onClick={() => {
              handleSettingsChange({ key })
            }}
          >
            {menuItems[key]}
            {((key === 'enableMagnifier' && enableMagnifier) ||
              (key === 'showLineReaderMask' && isLineReaderVisible)) && (
              <FontAwesomeIcon icon={faCheck} />
            )}
          </MenuItem>
        ))}
      {showPause && <Menu.Divider />}
      {showPause && (
        <MenuItem
          disabled={hidePause}
          {...(hidePause
            ? {
                title: i18Translate(
                  'header:saveAndExit.assignmentInOneSitting'
                ),
              }
            : {})}
          key="save"
          data-cy="finishTest"
          onClick={() => {
            handleSettingsChange({ key: 'save' })
          }}
        >
          {i18Translate('header:saveAndExit.saveAndExit')}
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
      <StyledButton style={{ width: 'auto' }} data-cy="exitMenu">
        <IconUser />
        {userName} <Icon type="down" />
      </StyledButton>
    </StyledDropdown>
  )
}

const enhance = compose(
  connect(
    (state) => ({
      userName: getUserNameSelector(state),
      multiLanguageEnabled: getIsMultiLanguageEnabled(state),
      isLineReaderVisible: lineReaderVisible(state),
    }),
    {}
  )
)

export default enhance(SettingMenu)
