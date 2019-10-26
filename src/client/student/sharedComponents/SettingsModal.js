import React from "react";
import styled, { withTheme } from "styled-components";
import { Modal, Select, Button, Row, Col } from "antd";
import { connect } from "react-redux";
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
  const onThemeChange = theme => setSelectedTheme(theme);
  const closeModal = () => setSettingsModalVisibility(false);

  const dropdownStyle = { zoom: theme.confirmation.modalWidth };

  return (
    <StyledModal
      id="student-settings-modal"
      visible={settingsModalVisible}
      onCancel={closeModal}
      footer={[
        <StyledButton key="submit" type="primary" onClick={closeModal}>
          Done
        </StyledButton>
      ]}
    >
      <RowWithMargin>
        <Col md={12}>Color Contrast</Col>
        <Col md={12}>
          <Select
            dropdownStyle={dropdownStyle}
            style={{ width: "80%" }}
            value={selectedTheme}
            onChange={setSelectedTheme}
          >
            <Select.Option value="default">Default</Select.Option>
            {Object.keys(themeColorsMap).map(key => {
              const item = themeColorsMap[key];
              return <Select.Option value={key}>{item.title}</Select.Option>;
            })}
          </Select>
        </Col>
      </RowWithMargin>
      <RowWithMargin>
        <Col md={12}>Zoom</Col>
        <Col md={12}>
          <Select dropdownStyle={dropdownStyle} style={{ width: "80%" }} value={zoomLevel} onChange={setZoomLevel}>
            <Select.Option value="1">No default zoom applied</Select.Option>
            <Select.Option value="1.5">Default level of zoom is set to 1.5X</Select.Option>
            <Select.Option value="1.75">Default level of zoom is set to 1.75X</Select.Option>
            <Select.Option value="2.5">Default level of zoom is set to 2.5X</Select.Option>
            <Select.Option value="3">Default level of zoom is set to 3X</Select.Option>
          </Select>
        </Col>
      </RowWithMargin>
    </StyledModal>
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

const StyledModal = styled(Modal)`
  zoom: ${props => props.theme.confirmation.modalWidth};

  .ant-modal-content {
    background-color: ${props => props.theme.sectionBackgroundColor};
    color: ${props => props.theme.confirmation.descriptionTextColor};

    .ant-modal-close-icon {
      svg {
        fill: ${props => props.theme.confirmation.descriptionTextColor};
      }
    }
  }

  .ant-select-selection {
    background-color: ${props => props.theme.headerDropdownBgColor};
    color: ${props => props.theme.headerDropdownTextColor};
    border: ${props =>
      props.theme.headerDropdownBorderColor ? `1px solid ${props.theme.headerDropdownBorderColor}` : "0px"};
  }

  .ant-select-dropdown-menu-item {
    background-color: ${props => props.theme.headerDropdownItemBgColor};
    color: ${props => props.theme.headerDropdownTextColor};

    &.ant-select-dropdown-menu-item-selected {
      background-color: ${props => props.theme.headerDropdownItemBgSelectedColor};
      color: ${props => props.theme.headerDropdownItemTextSelectedColor};
    }

    &:hover {
      background-color: ${props => props.theme.headerDropdownItemBgHoverColor} !important;
      color: ${props => props.theme.headerDropdownItemTextHoverColor} !important;
    }
  }

  .ant-select-selection__rendered {
    height: 100%;
    align-items: center;
    display: flex !important;
    padding-left: 15px;
  }
  .anticon-down {
    svg {
      fill: ${props => props.theme.headerDropdownTextColor};
    }
  }
`;

const RowWithMargin = styled(Row)`
  margin-bottom: 10px;
`;

const StyledButton = styled(Button)`
  background-color: ${props => props.theme.confirmation.submitButtonBgColor};
  border-color: ${props => props.theme.confirmation.submitButtonBgColor};
  color: ${props => props.theme.confirmation.submitButtonTextColor};
  &:hover {
    background-color: ${props => props.theme.confirmation.submitButtonBgColor};
    border-color: ${props => props.theme.confirmation.submitButtonBgColor};
    color: ${props => props.theme.confirmation.submitButtonTextColor};
  }
`;

export default enhance(withTheme(SettingsModal));
