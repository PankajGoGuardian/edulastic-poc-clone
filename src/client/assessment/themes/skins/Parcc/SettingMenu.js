import React, { useState } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Icon, Menu } from "antd";
import { get } from "lodash";
import { StyledButton, StyledDropdown, StyledMenu } from "./styled";
import { IconUser } from "@edulastic/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useUtaPauseAllowed } from "../../common/SaveAndExit";

const menuItems = {
  changeColor: "Change the background and foreground color",
  enableMagnifier: "Enable Magnifier",
  showLineReaderMask: "Show Line Reader Mask",
  enableAnswerMask: "Enable Answer Masking"
};
const SettingMenu = ({ user: { firstName }, onSettingsChange, showMagnifier, enableMagnifier, utaId }) => {
  const _pauseAllowed = useUtaPauseAllowed(utaId);
  const showPause = _pauseAllowed === undefined ? true : _pauseAllowed;

  const menu = (
    <StyledMenu onClick={onSettingsChange}>
      {Object.keys(menuItems).map(key => (
        <Menu.Item key={key} disabled={key === "enableMagnifier" && !showMagnifier}>
          {menuItems[key]}
          {key === "enableMagnifier" && enableMagnifier && <FontAwesomeIcon icon={faCheck} />}
        </Menu.Item>
      ))}
      {showPause && <Menu.Divider />}
      {showPause && <Menu.Item key="save">Save & Exit</Menu.Item>}
    </StyledMenu>
  );

  return (
    <StyledDropdown overlay={menu} getPopupContainer={triggerNode => triggerNode.parentNode}>
      <StyledButton style={{ width: "auto" }}>
        <IconUser />
        {firstName} <Icon type="down" />
      </StyledButton>
    </StyledDropdown>
  );
};

const enhance = compose(
  connect(
    state => ({
      user: get(state, ["user", "user"], {})
    }),
    {}
  )
);

export default enhance(SettingMenu);
