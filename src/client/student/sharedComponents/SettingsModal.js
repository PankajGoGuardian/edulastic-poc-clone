import {
  lightGreySecondary,
  tabletWidth,
  themeColor,
  title,
  themeColorBlue,
} from '@edulastic/colors'
import { AssessmentPlayerContext, EduButton } from '@edulastic/common'
import { IconSelectCaretDown } from '@edulastic/icons'
import { test as testConstants } from '@edulastic/constants'
import { Select } from 'antd'
import React, { useState, useEffect, useContext } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import styled, { withTheme } from 'styled-components'
import { ConfirmationModal } from '../../author/src/components/common/ConfirmationModal'
import {
  InitOptions,
  ModalWrapper,
} from '../../common/components/ConfirmationModal/styled'
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

  useEffect(() => {
    setChangedLang(languagePreference)
    setShowReconfirm(false)
  }, [languagePreference, settingsModalVisible])

  const closeModal = () => setSettingsModalVisibility(false)

  const handleApply = () => {
    localStorage.setItem('selectedTheme', selectedTheme)
    localStorage.setItem('zoomLevel', zoomLevel)
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
    closeModal()
  }
  const hideColorOrZoom =
    playerSkinType === playerSkinValues.parcc ||
    playerSkinType === playerSkinValues.sbac
  return (
    <ConfirmationModal
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
        <EduButton key="submit" onClick={handleApply}>
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
                  <CustomColumn>COLOR CONTRAST</CustomColumn>
                  <StyledSelect
                    value={selectedTheme}
                    onChange={setSelectedTheme}
                    suffixIcon={<IconSelectCaretDown color={themeColor} />}
                    style={{ marginBottom: '10px' }}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    <Select.Option value="default">Default</Select.Option>
                    {Object.keys(themeColorsMap).map((key) => {
                      const item = themeColorsMap[key]
                      return (
                        <Select.Option value={key}>{item.title}</Select.Option>
                      )
                    })}
                  </StyledSelect>
                </div>
                <div>
                  <CustomColumn>ZOOM</CustomColumn>
                  <StyledSelect
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    value={zoomLevel}
                    onChange={setZoomLevel}
                    style={{ marginBottom: '10px' }}
                    suffixIcon={<IconSelectCaretDown color={themeColor} />}
                  >
                    <Select.Option value="1">None</Select.Option>
                    <Select.Option value="1.5">1.5X standard</Select.Option>
                    <Select.Option value="1.75">1.75X standard</Select.Option>
                    <Select.Option value="2.5">2.5X standard</Select.Option>
                    <Select.Option value="3">3X standard</Select.Option>
                  </StyledSelect>
                </div>
              </>
            )}
            {multiLanguageEnabled && (
              <div>
                <CustomColumn>SELECT PREFERRED LANGUAGE</CustomColumn>
                <StyledSelect
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  onChange={setChangedLang}
                  value={selectedLang}
                  suffixIcon={<IconSelectCaretDown color={themeColor} />}
                >
                  <Select.Option value="" disabled>
                    Select Language
                  </Select.Option>
                  <Select.Option value={languageCodes.ENGLISH}>
                    English
                  </Select.Option>
                  <Select.Option value={languageCodes.SPANISH}>
                    Spanish
                  </Select.Option>
                </StyledSelect>
              </div>
            )}
          </>
        )}
      </InitOptions>
    </ConfirmationModal>
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
    }),
    {
      setSelectedTheme: setSelectedThemeAction,
      setSettingsModalVisibility: setSettingsModalVisibilityAction,
      setZoomLevel: setZoomLevelAction,
      switchLanguage: switchLanguageAction,
      setPreviewLanguage: setPreviewLanguageAction,
      clearUserWork: clearUserWorkAction,
      startAssessment: startAssessmentAction,
    }
  )
)

export const ModifyModalWrapper = styled(ModalWrapper)`
  .ant-modal-footer {
    text-align: center;
  }
  .ant-modal-title {
    color: ${title};
    font-size: ${(props) => props.theme.header.headerTitleSecondaryTextSize};
  }
  @media (min-width: ${tabletWidth}) {
    height: 367px;
  }
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
