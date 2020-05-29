import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Popover } from "antd";
import { connect } from "react-redux";
import { themeColor, extraDesktopWidthMax } from "@edulastic/colors";
import { IconTile } from "@edulastic/icons";
import { FlexContainer } from "@edulastic/common";
import { toggleShowUseThisNotificationAction } from "../../ducks";

const SwitchPlaylist = ({ onClickHandler, showUseThisNotification, toggleShowUseThisNotification, isDesktop }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverContent = <span>You can switch between playlists using this.</span>;

  const showNotificationInSideMenu = () => {
    setIsOpen(false);
    if (toggleShowUseThisNotification) {
      toggleShowUseThisNotification(true);
      setTimeout(() => {
        toggleShowUseThisNotification(false);
      }, 3000);
    }
  };

  useEffect(() => {
    if (showUseThisNotification) {
      setIsOpen(showUseThisNotification);
      setTimeout(showNotificationInSideMenu, 3000);
    }
  }, [showUseThisNotification]);

  return (
    <Popover content={popoverContent} overlayClassName="antd-notify-custom-popover" visible={isOpen}>
      <FlexContainer onClick={onClickHandler}>
        <IconTile
          data-cy="open-dropped-playlist"
          style={{ cursor: "pointer", marginLeft: "18px" }}
          width={18}
          height={18}
          color={themeColor}
        />
        {isDesktop && <SwitchLable>SWITCH</SwitchLable>}
      </FlexContainer>
    </Popover>
  );
};

export default connect(
  null,
  { toggleShowUseThisNotification: toggleShowUseThisNotificationAction }
)(SwitchPlaylist);

const SwitchLable = styled.div`
  font-size: 12px;
  color: ${themeColor};
  text-transform: uppercase;
  line-height: 1;
  margin-left: 8px;

  @media (max-width: ${extraDesktopWidthMax}) {
    font-size: 10px;
  }
`;
