import React from "react";
import styled from "styled-components";
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
  setZoomLevel
}) => {
  const onThemeChange = theme => setSelectedTheme(theme);
  const closeModal = () => setSettingsModalVisibility(false);

  return (
    <Modal
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
          <Select style={{ width: "80%" }} value={selectedTheme} onChange={setSelectedTheme}>
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
          <Select style={{ width: "80%" }} value={zoomLevel} onChange={setZoomLevel}>
            <Select.Option value="xs">No default zoom applied</Select.Option>
            <Select.Option value="sm">Default level of zoom is set to 1.5X</Select.Option>
            <Select.Option value="md">Default level of zoom is set to 1.75X</Select.Option>
            <Select.Option value="lg">Default level of zoom is set to 2.5X</Select.Option>
            <Select.Option value="xl">Default level of zoom is set to 3X</Select.Option>
          </Select>
        </Col>
      </RowWithMargin>
    </Modal>
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

const RowWithMargin = styled(Row)`
  margin-bottom: 10px;
`;

const StyledButton = styled(Button)`
  background-color: ${props => props.theme.confirmation.submitButtonBgColor};
  border-color: ${props => props.theme.confirmation.submitButtonBgColor};
  &:hover {
    background-color: ${props => props.theme.confirmation.submitButtonBgColor};
    border-color: ${props => props.theme.confirmation.submitButtonBgColor};
  }
`;

export default enhance(SettingsModal);
