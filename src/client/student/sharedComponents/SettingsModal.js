import {
  lightGreySecondary,
  themeColor,
  title,
  themeColorBlue,
  drcThemeColor,
  drcWhite,
} from '@edulastic/colors'
import { withNamespaces } from '@edulastic/localization'
import { AssessmentPlayerContext, EduButton } from '@edulastic/common'
import { IconSelectCaretDown } from '@edulastic/icons'
import { test as testConstants } from '@edulastic/constants'
import { Select } from 'antd'
import React, { useState, useEffect, useContext } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import styled, { withTheme } from 'styled-components'
import { ConfirmationModal } from '../../author/src/components/common/ConfirmationModal'
import { InitOptions } from '../../common/components/ConfirmationModal/styled'
import { themeColorsMap } from '../../theme'
import {
  setSelectedThemeAction,
  setSettingsModalVisibilityAction,
  setZoomLevelAction,
} from '../Sidebar/ducks'
import {
  getIsMultiLanguageEnabled,
  getUtaPeferredLanguage,
} from '../../common/components/LanguageSelector/duck'
import {
  setPreviewLanguageAction,
  switchLanguageAction,
} from '../../assessment/actions/test'
import { playerSkinTypeSelector } from '../../assessment/selectors/test'
import { clearUserWorkAction } from '../../assessment/actions/userWork'
import { startAssessmentAction } from '../../assessment/actions/assessment'
import {
  getTextToSpeechPlaybackSpeed,
  updateTestPlayerAction,
} from '../../author/sharedDucks/testPlayer'

const { languageCodes, playerSkinValues } = testConstants

const SettingsModal = ({
  selectedTheme,
  settingsModalVisible,
  setSelectedTheme,
  setSettingsModalVisibility,
  zoomLevel,
  setZoomLevel,
  theme,
  languagePreference,
  multiLanguageEnabled,
  switchLanguage,
  playerSkinType,
  isPreview,
  setPreviewLanguage,
  clearUserWork,
  startAssessment,
  isPremiumContentWithoutAccess = false,
  ttsPlaybackSpeed,
  updateTestPlayer,
  canShowPlaybackOptionTTS,
  t: i18Translate,
}) => {
  const bodyStyle = {
    padding: '20px',
    marginBottom: '15px',
    textAlign: 'left',
    fontSize: theme.smallFontSize,
    fontWeight: 600,
    boxShadow: 'none',
  }

  const reconfirmContentStyle = {
    fontSize: '14px',
    textAlign: 'center',
    margin: '0 -15px',
  }

  const [selectedLang, setChangedLang] = useState(languagePreference)
  const [showReconfirm, setShowReconfirm] = useState(false)
  const { setCurrentItem } = useContext(AssessmentPlayerContext)

  const [selectedPlaybackSpeed, setSelectedPlaybackSpeed] = useState(
    ttsPlaybackSpeed
  )

  useEffect(() => {
    setChangedLang(languagePreference)
    setShowReconfirm(false)
  }, [languagePreference, settingsModalVisible])

  const closeModal = () => setSettingsModalVisibility(false)

  const handleApply = () => {
    localStorage.setItem('selectedTheme', selectedTheme)
    localStorage.setItem('zoomLevel', zoomLevel)

    localStorage.setItem('ttsPlaybackSpeed', selectedPlaybackSpeed)
    updateTestPlayer({ ttsPlaybackSpeed: selectedPlaybackSpeed })

    if (selectedLang !== languagePreference && !showReconfirm) {
      return setShowReconfirm(true)
    }
    if (showReconfirm && selectedLang !== languagePreference) {
      if (isPreview) {
        clearUserWork()
        startAssessment()
        setCurrentItem(0)
        setPreviewLanguage(selectedLang)
      } else {
        switchLanguage({ languagePreference: selectedLang })
      }
    }
    closeModal()
  }

  const handleCancel = () => {
    setSelectedTheme(localStorage.getItem('selectedTheme') || 'default')
    setZoomLevel(localStorage.getItem('zoomLevel') || '1')
    setSelectedPlaybackSpeed(ttsPlaybackSpeed)
    closeModal()
  }
  const hideColorOrZoom =
    playerSkinType === playerSkinValues.parcc ||
    playerSkinType === playerSkinValues.sbac
  return (
    <ConfirmationModalStyled
      playerSkinType={playerSkinType}
      maskClosable={false}
      textAlign="left"
      title={
        showReconfirm
          ? i18Translate('testOptions.alert')
          : i18Translate('testOptions.title')
      }
      centered
      visible={settingsModalVisible}
      onCancel={handleCancel}
      destroyOnClose
      footer={[
        <EduButton isGhost key="cancel" onClick={handleCancel}>
          {i18Translate('common.cancel')}
        </EduButton>,
        <EduButton
          data-cy={showReconfirm ? 'continue' : 'apply'}
          key="submit"
          onClick={handleApply}
        >
          {showReconfirm
            ? i18Translate('common.continue')
            : i18Translate('common.apply')}
        </EduButton>,
      ]}
    >
      <InitOptions bodyStyle={bodyStyle}>
        {showReconfirm ? (
          <div style={reconfirmContentStyle}>
            {' '}
            {i18Translate('testOptions.responsesWillBeLostAlert')}{' '}
          </div>
        ) : (
          <>
            {!hideColorOrZoom && (
              <>
                <div>
                  {/* Color contrast switch is a seperate component for parcc skin any change here should be made for 'parcc/changecolor' component as well */}
                  <CustomColumn>
                    {i18Translate('testOptions.colorContrast')}
                  </CustomColumn>
                  <StyledSelect
                    value={selectedTheme}
                    onChange={setSelectedTheme}
                    suffixIcon={<IconSelectCaretDown color={themeColor} />}
                    style={{ marginBottom: '10px' }}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    disabled={isPremiumContentWithoutAccess}
                  >
                    <Select.Option value="default" aria-label="Default">
                      {i18Translate('testOptions.default')}
                    </Select.Option>
                    {Object.keys(themeColorsMap).map((key) => {
                      const item = themeColorsMap[key]
                      return (
                        <Select.Option value={key} aria-label={item.title}>
                          {i18Translate(
                            `testOptions.colorContrastOptions.${key}`
                          )}
                        </Select.Option>
                      )
                    })}
                  </StyledSelect>
                </div>
                <div>
                  <CustomColumn>
                    {i18Translate('testOptions.zoom')}
                  </CustomColumn>
                  <StyledSelect
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    value={zoomLevel}
                    onChange={setZoomLevel}
                    style={{ marginBottom: '10px' }}
                    suffixIcon={<IconSelectCaretDown color={themeColor} />}
                    disabled={isPremiumContentWithoutAccess}
                  >
                    <Select.Option value="1" aria-label="None">
                      {i18Translate('testOptions.none')}
                    </Select.Option>
                    <Select.Option value="1.5" aria-label="1.5X standard">
                      1.5X {i18Translate('testOptions.standard')}
                    </Select.Option>
                    <Select.Option value="1.75" aria-label="1.75X standard">
                      1.75X {i18Translate('testOptions.standard')}
                    </Select.Option>
                    <Select.Option value="2.5" aria-label="2.5X standard">
                      2.5X {i18Translate('testOptions.standard')}
                    </Select.Option>
                    <Select.Option value="3" aria-label="3X standard">
                      3X {i18Translate('testOptions.standard')}
                    </Select.Option>
                  </StyledSelect>
                </div>
              </>
            )}
            {multiLanguageEnabled && (
              <div>
                <CustomColumn>
                  {i18Translate('testOptions.selectPreferredLanguage')}
                </CustomColumn>
                <StyledSelect
                  data-cy="langPref"
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  onChange={setChangedLang}
                  value={selectedLang}
                  suffixIcon={<IconSelectCaretDown color={themeColor} />}
                  disabled={isPremiumContentWithoutAccess}
                >
                  <Select.Option value="" disabled aria-label="Select Language">
                    {i18Translate('testOptions.selectLanguage')}
                  </Select.Option>
                  <Select.Option
                    value={languageCodes.ENGLISH}
                    aria-label="English"
                  >
                    English
                  </Select.Option>
                  <Select.Option
                    value={languageCodes.SPANISH}
                    aria-label="Spanish"
                  >
                    Spanish
                  </Select.Option>
                </StyledSelect>
              </div>
            )}
            {canShowPlaybackOptionTTS && (
              <div>
                <CustomColumn>
                  {i18Translate('testOptions.playBackTextToSpeech')}
                </CustomColumn>
                <StyledSelect
                  data-cy="playBackSpeedPref"
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  onChange={setSelectedPlaybackSpeed}
                  value={selectedPlaybackSpeed}
                  suffixIcon={<IconSelectCaretDown color={themeColor} />}
                >
                  <Select.Option value="0.5" aria-label="0.5X">
                    0.5X
                  </Select.Option>
                  <Select.Option value="0.75" aria-label="0.75X">
                    0.75X
                  </Select.Option>
                  <Select.Option value="1" aria-label="Normal">
                    {i18Translate(
                      'testOptions.playBackTextToSpeechNormalValue'
                    )}
                  </Select.Option>
                  <Select.Option value="1.5" aria-label="1.5X">
                    1.5X
                  </Select.Option>
                  <Select.Option value="2" aria-label="2X">
                    2X
                  </Select.Option>
                </StyledSelect>
              </div>
            )}
          </>
        )}
      </InitOptions>
    </ConfirmationModalStyled>
  )
}

const enhance = compose(
  withNamespaces('header'),
  withTheme,
  connect(
    (state) => ({
      selectedTheme: state.ui.selectedTheme,
      settingsModalVisible: state.ui.settingsModalVisible,
      zoomLevel: state.ui.zoomLevel,
      languagePreference: getUtaPeferredLanguage(state),
      multiLanguageEnabled: getIsMultiLanguageEnabled(state),
      playerSkinType: playerSkinTypeSelector(state),
      isPreview: state.test.isTestPreviewModalVisible,
      ttsPlaybackSpeed: getTextToSpeechPlaybackSpeed(state),
    }),
    {
      setSelectedTheme: setSelectedThemeAction,
      setSettingsModalVisibility: setSettingsModalVisibilityAction,
      setZoomLevel: setZoomLevelAction,
      switchLanguage: switchLanguageAction,
      setPreviewLanguage: setPreviewLanguageAction,
      clearUserWork: clearUserWorkAction,
      startAssessment: startAssessmentAction,
      updateTestPlayer: updateTestPlayerAction,
    }
  )
)

export const ConfirmationModalStyled = styled(ConfirmationModal)`
  ${(props) =>
    props.playerSkinType === playerSkinValues.drc
      ? `
.ant-modal-footer {
  button.ant-btn.ant-btn-primary {
    border-color: ${drcThemeColor};
    color: ${drcThemeColor};
    background-color: ${drcWhite};
    &:hover{
      border-color: ${drcWhite};
      color: ${drcWhite};
      background-color: ${drcThemeColor};
    }
  }
  button.ant-btn.ant-btn-primary + button {
    background: ${drcThemeColor};
    color: ${drcWhite};
  }
}
`
      : ``}
`

export const CustomColumn = styled.div`
  margin-bottom: 8px;
`

export const StyledSelect = styled(Select)`
  width: 100%;
  font-size: ${(props) => props.theme.smallFontSize};
  .ant-select-selection {
    height: 36px;
    border: 1px solid ${(props) => props.theme.header.settingsInputBorder};
    background: ${lightGreySecondary};
    color: ${title};
    &:focus {
      outline: 0;
      box-shadow: 0 0 0 2px ${themeColorBlue};
    }
  }
  .ant-select-selection__rendered {
    margin: 2px 15px;
  }
`

export default enhance(SettingsModal)
