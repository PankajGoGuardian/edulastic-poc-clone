import React from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import { compose } from "redux";
import { Menu, Dropdown, message } from "antd";
import styled from "styled-components";
import { roleuser } from "@edulastic/constants";
import { withNamespaces } from "@edulastic/localization";
import { EduButton, Label, FlexContainer } from "@edulastic/common";
import { themeColor, white, mainTextColor, title } from "@edulastic/colors";

import { getSelectedItemSelector } from "../../../TestPage/components/AddItems/ducks";
import { getUserRole, isPublisherUserSelector } from "../../../src/selectors/user";
import { createTestFromCartAction } from "../../ducks";
import { getSelectedTestsSelector } from "../../../TestList/ducks";
import { setAddCollectionModalVisibleAction } from "../../../ContentBuckets/ducks";
import { getSelectedPlaylistSelector } from "../../../Playlist/ducks";

const Actions = ({
  selectedItems,
  selectedTests,
  selectedPlaylists,
  userRole,
  setAddCollectionModalVisible,
  createTestFromCart,
  isPublisherUser,
  type,
  t
}) => {
  if (!(userRole === roleuser.DISTRICT_ADMIN || isPublisherUser)) return null;
  let numberOfSelectedItems = selectedItems?.length;
  if (type === "TEST") {
    numberOfSelectedItems = selectedTests?.length;
  }
  if (type === "PLAYLIST") {
    numberOfSelectedItems = selectedPlaylists?.length;
  }

  // Keep this format as createTestFromCart is directly called in Menu item it will have a payload related to event
  const handleCreateTest = () => {
    if (!numberOfSelectedItems) {
      return message.error("Add items to create test");
    }
    createTestFromCart();
  };

  const menu = (
    <DropMenu>
      {type === "TESTITEM" && (
        <MenuItems onClick={handleCreateTest}>
          <span>Create a Test</span>
        </MenuItems>
      )}
      <MenuItems onClick={() => setAddCollectionModalVisible(true)}>
        <span>Add to Collection</span>
      </MenuItems>
      <MenuItems>
        <span>Remove from Collection</span>
      </MenuItems>
    </DropMenu>
  );

  return (
    <FlexContainer>
      <Label>
        <span>{numberOfSelectedItems || 0} </span>
        {t("component.item.itemCount")}
      </Label>
      <Dropdown overlay={menu} placement="bottomCenter">
        <EduButton height="30px" width="150px" isGhost>
          {t("component.item.actions")}
        </EduButton>
      </Dropdown>
    </FlexContainer>
  );
};

Actions.propTypes = {
  selectedItems: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  selectedItems: getSelectedItemSelector(state),
  userRole: getUserRole(state),
  isPublisherUser: isPublisherUserSelector(state),
  selectedTests: getSelectedTestsSelector(state),
  selectedPlaylists: getSelectedPlaylistSelector(state)
});

const withConnect = connect(
  mapStateToProps,
  {
    setAddCollectionModalVisible: setAddCollectionModalVisibleAction,
    createTestFromCart: createTestFromCartAction
  }
);

export default compose(
  withNamespaces("author"),
  withConnect
)(Actions);

const DropMenu = styled(Menu)`
  width: 150px;
`;

const MenuItems = styled(Menu.Item)`
  display: flex;
  align-items: center;
  font-size: 11px;
  color: ${title};
  font-weight: 600;
  &:hover {
    svg {
      fill: ${white};
      path {
        fill: ${white};
        stroke: ${white};
      }
    }
  }
  svg,
  i {
    fill: ${mainTextColor};
    height: 12px;
    margin-right: 10px;
    path {
      fill: ${mainTextColor};
    }
  }
  &:not(.ant-dropdown-menu-item-disabled):hover {
    color: ${white};
    background-color: ${themeColor};
  }
`;
