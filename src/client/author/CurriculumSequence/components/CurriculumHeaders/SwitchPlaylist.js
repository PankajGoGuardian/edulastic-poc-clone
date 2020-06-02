import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Popover } from "antd";
import { connect } from "react-redux";
import { themeColor, extraDesktopWidthMax } from "@edulastic/colors";
import { IconTile } from "@edulastic/icons";
import { FlexContainer } from "@edulastic/common";
import { toggleShowUseThisNotificationAction } from "../../ducks";

const SwitchPlaylist = ({
  onClickHandler,
  showUseThisNotification,
  toggleShowUseThisNotification,
  isDesktop,
  playlistsToSwitch
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverContent = <span>You can switch between playlists using this.</span>;
  const isShowSwitcher = (playlistsToSwitch?.length || 0) > 1;

  const showNotificationInSideMenu = () => {
    setIsOpen(false);
    if (toggleShowUseThisNotification) {
      toggleShowUseThisNotification(true);
      setTimeout(() => {
        toggleShowUseThisNotification(false);
      }, 4000);
    }
  };

  useEffect(() => {
    if (showUseThisNotification && isShowSwitcher) {
      if (isShowSwitcher) {
        setIsOpen(showUseThisNotification);
        setTimeout(showNotificationInSideMenu, 4000);
      } else {
        showNotificationInSideMenu();
      }
    }
  }, [showUseThisNotification]);

  if (!isShowSwitcher) {
    return "";
  }

  return (
    <Popover content={popoverContent} overlayClassName="antd-notify-custom-popover" visible={isOpen}>
      <FlexContainer onClick={onClickHandler} marginLeft="4px">
        <IconTile
          data-cy="open-dropped-playlist"
          style={{ cursor: "pointer" }}
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
