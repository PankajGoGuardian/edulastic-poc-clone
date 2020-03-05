import { lightGreySecondary, mobileWidthMax, tabletWidth, themeColor, title, white } from "@edulastic/colors";
import { EduButton } from "@edulastic/common";
import { IconSelectCaretDown } from "@edulastic/icons";
import { Button, Select } from "antd";
import React from "react";
import { connect } from "react-redux";
import styled, { withTheme } from "styled-components";
import { ConfirmationModal } from "../../author/src/components/common/ConfirmationModal";
import { InitOptions, ModalWrapper } from "../../common/components/ConfirmationModal/styled";
import { themeColorsMap } from "../../theme";
import { setSelectedThemeAction, setSettingsModalVisibilityAction, setZoomLevelAction } from "../Sidebar/ducks";

const SettingsModal = ({
  selectedTheme,
  settingsModalVisible,
  setSelectedTheme,
  setSettingsModalVisibility,
  zoomLevel,
  setZoomLevel,
  theme
}) => {
  const bodyStyle = {
    padding: "20px",
    marginBottom: "15px",
    textAlign: "left",
    fontSize: theme.smallFontSize,
    fontWeight: 600,
    boxShadow: "none"
  };

  const closeModal = () => setSettingsModalVisibility(false);

  const handleApply = () => {
    localStorage.setItem("selectedTheme", selectedTheme);
    localStorage.setItem("zoomLevel", zoomLevel);
    closeModal();
  };

  const handleCancel = () => {
    setSelectedTheme(localStorage.getItem("selectedTheme") || "default");
    setZoomLevel(localStorage.getItem("zoomLevel") || "1");
    closeModal();
  };
  return (
    <ConfirmationModal
      maskClosable={false}
      textAlign="left"
      title="Zoom & Contrast"
      centered
      visible={settingsModalVisible}
      onCancel={handleCancel}
      destroyOnClose
      footer={[
        <EduButton isGhost key="cancel" onClick={handleCancel}>
          CANCEL
        </EduButton>,
        <EduButton key="submit" onClick={handleApply}>
          APPLY
        </EduButton>
      ]}
    >
      <InitOptions bodyStyle={bodyStyle}>
        <div>
          <CustomColumn>COLOR CONTRAST</CustomColumn>
          <StyledSelect
            value={selectedTheme}
            onChange={setSelectedTheme}
            suffixIcon={<IconSelectCaretDown color={themeColor} />}
            style={{ marginBottom: "10px" }}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            <Select.Option value="default">Default</Select.Option>
            {Object.keys(themeColorsMap).map(key => {
              const item = themeColorsMap[key];
              return <Select.Option value={key}>{item.title}</Select.Option>;
            })}
          </StyledSelect>
        </div>
        <div>
          <CustomColumn>ZOOM</CustomColumn>
          <StyledSelect
            getPopupContainer={triggerNode => triggerNode.parentNode}
            value={zoomLevel}
            onChange={setZoomLevel}
            suffixIcon={<IconSelectCaretDown color={themeColor} />}
          >
            <Select.Option value="1">None</Select.Option>
            <Select.Option value="1.5">1.5X standard</Select.Option>
            <Select.Option value="1.75">1.75X standard</Select.Option>
            <Select.Option value="2.5">2.5X standard</Select.Option>
            <Select.Option value="3">3X standard</Select.Option>
          </StyledSelect>
        </div>
      </InitOptions>
    </ConfirmationModal>
  );
};

const enhance = connect(
  state => ({
    selectedTheme: state.ui.selectedTheme,
    settingsModalVisible: state.ui.settingsModalVisible,
    zoomLevel: state.ui.zoomLevel
  }),
  {
    setSelectedTheme: setSelectedThemeAction,
    setSettingsModalVisibility: setSettingsModalVisibilityAction,
    setZoomLevel: setZoomLevelAction
  }
);

export const ModifyModalWrapper = styled(ModalWrapper)`
  .ant-modal-footer {
    text-align: center;
  }
  .ant-modal-title {
    color: ${title};
    font-size: ${props => props.theme.header.headerTitleSecondaryTextSize};
  }
  @media (min-width: ${tabletWidth}) {
    height: 367px;
  }
`;

export const CustomColumn = styled.div`
  margin-bottom: 8px;
`;

export const StyledSelect = styled(Select)`
  width: 100%;
  font-size: ${props => props.theme.smallFontSize};
  .ant-select-selection {
    height: 36px;
    border: 1px solid ${props => props.theme.header.settingsInputBorder};
    background: ${lightGreySecondary};
    color: ${title};
  }
  .ant-select-selection__rendered {
    margin: 2px 15px;
  }
`;

export default enhance(withTheme(SettingsModal));
