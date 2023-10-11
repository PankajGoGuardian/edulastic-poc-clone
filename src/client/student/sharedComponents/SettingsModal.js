import {
  lightGreySecondary,
  themeColor,
  title,
  themeColorBlue,
  drcThemeColor,
  drcWhite,
} from '@edulastic/colors'
import { AssessmentPlayerContext, EduButton, RcSelect } from '@edulastic/common'
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

const {
  playerSkinValues,
  zoomOptions,
  playbackSpeedOptions,
  languageOptions,
} = testConstants

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
      title={showReconfirm ? 'Alert' : 'Test Options'}
      centered
      visible={settingsModalVisible}
      onCancel={handleCancel}
      destroyOnClose
      footer={[
        <EduButton isGhost key="cancel" onClick={handleCancel}>
          CANCEL
        </EduButton>,
        <EduButton
          data-cy={showReconfirm ? 'continue' : 'apply'}
          key="submit"
          onClick={handleApply}
        >
          {showReconfirm ? 'CONTINUE' : 'APPLY'}
        </EduButton>,
      ]}
    >
      <InitOptions bodyStyle={bodyStyle}>
        {showReconfirm ? (
          <div style={reconfirmContentStyle}>
            {' '}
            All your previous responses will be lost and assignment will start
            from the beginning. Are you sure you want to continue?{' '}
          </div>
        ) : (
          <>
            {!hideColorOrZoom && (
              <>
                <div>
                  {/* Color contrast switch is a seperate component for parcc skin any change here should be made for 'parcc/changecolor' component as well */}
                  <CustomColumn>COLOR CONTRAST</CustomColumn>
                  <RcSelect
                    value={selectedTheme}
                    onChange={setSelectedTheme}
                    suffixIcon={<IconSelectCaretDown color={themeColor} />}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    disabled={isPremiumContentWithoutAccess}
                    options={[
                      { label: 'Default', value: 'default' },
                      ...Object.keys(themeColorsMap).map((key) => {
                        const item = themeColorsMap[key]
                        return { label: item.title, value: key }
                      }),
                    ]}
                  />
                </div>
                <div>
                  <CustomColumn>ZOOM</CustomColumn>
                  <RcSelect
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    value={zoomLevel}
                    onChange={setZoomLevel}
                    suffixIcon={<IconSelectCaretDown color={themeColor} />}
                    disabled={isPremiumContentWithoutAccess}
                    options={zoomOptions}
                  />
                </div>
              </>
            )}
            {multiLanguageEnabled && (
              <div>
                <CustomColumn>SELECT PREFERRED LANGUAGE</CustomColumn>
                <RcSelect
                  data-cy="langPref"
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  onChange={setChangedLang}
                  value={selectedLang}
                  suffixIcon={<IconSelectCaretDown color={themeColor} />}
                  disabled={isPremiumContentWithoutAccess}
                  options={languageOptions}
                />
              </div>
            )}
            {canShowPlaybackOptionTTS && (
              <div>
                <CustomColumn>PLAYBACK SPEED (TEXT TO SPEECH)</CustomColumn>
                <RcSelect
                  data-cy="playBackSpeedPref"
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  onChange={setSelectedPlaybackSpeed}
                  value={selectedPlaybackSpeed}
                  suffixIcon={<IconSelectCaretDown color={themeColor} />}
                  options={playbackSpeedOptions}
                />
              </div>
            )}
          </>
        )}
      </InitOptions>
    </ConfirmationModalStyled>
  )
}

const enhance = compose(
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
export const StyledRcSelect = styled(RcSelect)`
  width: 100%;
  font-size: ${(props) => props.theme.smallFontSize};
  .rc-select-selector {
    height: 36px;
    border: 1px solid ${(props) => props.theme.header.settingsInputBorder};
    background: ${lightGreySecondary};
    color: ${title};
    &:focus {
      outline: 0;
      box-shadow: 0 0 0 2px ${themeColorBlue};
    }
  }
`

export default enhance(SettingsModal)
