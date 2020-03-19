import React, {useState} from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Icon, Menu } from "antd";
import { get } from "lodash";
import { StyledButton, StyledDropdown, StyledMenu } from "./styled";
import { IconUser } from "@edulastic/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const menuItems = {
  changeColor: "Change the background and foreground color",
  enableMagnifier: "Enable Magnifier",
  showLineReaderMask: "Show Line Reader Mask",
  enableAnswerMask: "Enable Answer Masking",
}
const SettingMenu = ({
  user: {firstName},
  onSettingsChange,
  showMagnifier,
  enableMagnifier
}) => {
  const [setting, setSetting] = useState({
    enableMagnifier: false,
    showLineReaderMask: false
  });
  const handleSettingsChange = (e) => {
    setSetting({
      ...setting,
      [e.key]: !setting[e.key]
    });
    onSettingsChange(e);
  }
  const menu = <StyledMenu onClick={handleSettingsChange}>
    {Object.keys(menuItems).map(key => <Menu.Item key={key} disabled={key === "enableMagnifier" && !showMagnifier}>{menuItems[key]}{setting[key] && <FontAwesomeIcon icon={faCheck} />}</Menu.Item>)}
    <Menu.Divider />
    <Menu.Item key="save">Save & Exit</Menu.Item>
  </StyledMenu>

  return (
    <StyledDropdown overlay={menu} getPopupContainer={triggerNode => triggerNode.parentNode}>
      <StyledButton style={{width: "auto"}}>
        <IconUser />
          {firstName} <Icon type="down" />
      </StyledButton>
    </StyledDropdown>
  );
}

const enhance = compose(
  connect(
    state => ({
      user: get(state, ["user", "user"], {})
    }),
    {}
  )
);

export default enhance(SettingMenu);