import React from "react";
import styled from "styled-components";
import { Modal, Select, Button, Row, Col } from "antd";
import { connect } from "react-redux";
import { themeColorsMap } from "../themes";

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
        <Button key="submit" type="primary" onClick={closeModal}>
          Done
        </Button>
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
            <Select.Option value="0">No default zoom applied</Select.Option>
            <Select.Option value="1">Default level of zoom is set to 1.5X</Select.Option>
            <Select.Option value="2">Default level of zoom is set to 1.75X</Select.Option>
            <Select.Option value="3">Default level of zoom is set to 2.5X</Select.Option>
            <Select.Option value="4">Default level of zoom is set to 3X</Select.Option>
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

export default enhance(SettingsModal);
