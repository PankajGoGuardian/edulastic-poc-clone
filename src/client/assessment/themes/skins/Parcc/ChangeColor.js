import {
  lightGreySecondary,
  themeColor,
  title,
  themeColorBlue,
  drcThemeColor,
  drcWhite,
  parcThemeColor,
  parcButtonColor,
} from '@edulastic/colors'
import { EduButton } from '@edulastic/common'
import { IconSelectCaretDown } from '@edulastic/icons'
import { test as testConstants } from '@edulastic/constants'
import { Select } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import styled, { withTheme } from 'styled-components'
import { InitOptions } from '../../../../common/components/ConfirmationModal/styled'
import { themeColorsMap } from '../../../../theme'
import { playerSkinTypeSelector } from '../../../selectors/test'
import { ConfirmationModal } from '../../../../author/src/components/common/ConfirmationModal'
import { setSelectedThemeAction } from '../../../../student/Sidebar/ducks'

const { playerSkinValues } = testConstants

const SettingsModal = ({
  selectedTheme,
  showChangeColor,
  setSelectedTheme,
  theme,
  playerSkinType,
  closeModal,
}) => {
  const bodyStyle = {
    padding: '20px',
    marginBottom: '15px',
    textAlign: 'left',
    fontSize: theme.smallFontSize,
    fontWeight: 600,
    boxShadow: 'none',
  }

  const handleApply = () => {
    localStorage.setItem('selectedTheme', selectedTheme)
    closeModal()
  }

  const handleCancel = () => {
    setSelectedTheme(localStorage.getItem('selectedTheme') || 'default')
    closeModal()
  }

  return (
    <ConfirmationModalStyled
      playerSkinType={playerSkinType}
      maskClosable={false}
      textAlign="left"
      title="Theme"
      centered
      visible={showChangeColor}
      onCancel={handleCancel}
      destroyOnClose
      footer={[
        <EduButton tabindex="0" isGhost key="cancel" onClick={handleCancel}>
          CANCEL
        </EduButton>,
        <EduButton
          tabindex="0"
          data-cy="apply"
          key="submit"
          onClick={handleApply}
        >
          APPLY
        </EduButton>,
      ]}
    >
      <InitOptions bodyStyle={bodyStyle}>
        <div>
          <CustomColumn>COLOR CONTRAST</CustomColumn>
          <StyledSelect
            value={selectedTheme}
            onChange={setSelectedTheme}
            suffixIcon={<IconSelectCaretDown color={themeColor} />}
            style={{ marginBottom: '10px' }}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            autoFocus
          >
            <Select.Option value="default" aria-label="Default">
              Default
            </Select.Option>
            {Object.keys(themeColorsMap).map((key) => {
              const item = themeColorsMap[key]
              return (
                <Select.Option value={key} aria-label={item.title}>
                  {item.title}
                </Select.Option>
              )
            })}
          </StyledSelect>
        </div>
      </InitOptions>
    </ConfirmationModalStyled>
  )
}

const enhance = compose(
  withTheme,
  connect(
    (state) => ({
      selectedTheme: state.ui.selectedTheme,
      zoomLevel: state.ui.zoomLevel,
      playerSkinType: playerSkinTypeSelector(state),
      isPreview: state.test.isTestPreviewModalVisible,
    }),
    {
      setSelectedTheme: setSelectedThemeAction,
    }
  )
)

const getFooterStyle = (skin) => {
  switch (skin) {
    case playerSkinValues.drc:
      return `.ant-modal-footer {
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
              }`
    case playerSkinValues.parcc:
      return `.ant-modal-footer {
            button.ant-btn.ant-btn-primary {
              border-color: ${parcThemeColor};
              color: ${parcThemeColor};
              background-color: ${parcButtonColor};
              &:hover{
                border-color: ${parcThemeColor};
                color: #fff;
                background-color: ${parcThemeColor};
              }
            }
            button.ant-btn.ant-btn-primary + button {
              background: ${parcThemeColor};
              color: #fff;
            }
          }`
    default:
      ''
  }
}

export const ConfirmationModalStyled = styled(ConfirmationModal)`
  ${(props) => getFooterStyle(props.playerSkinType)}
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
