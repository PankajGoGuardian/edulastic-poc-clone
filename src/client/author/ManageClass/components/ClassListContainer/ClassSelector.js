import React from "react";
import { Menu, Icon } from "antd";
import { themeColor } from "@edulastic/colors";
import { ClassSelect, ClassStatusButton, ClassStatusDropdown } from "./styled";

const options = ["Active Classes", "Archive Classes"];

const ClassSelector = ({ groups, archiveGroups, setClassGroups, filterClass, setFilterClass }) => {
  const handleActiveClassClick = () => {
    setFilterClass(options[0]);
    setClassGroups(groups);
  };
  const handleArchiveClassClick = () => {
    setFilterClass(options[1]);
    setClassGroups(archiveGroups);
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={handleActiveClassClick}>
        Active Classes
      </Menu.Item>
      <Menu.Item key="2" onClick={handleArchiveClassClick}>
        Archived Classes
      </Menu.Item>
    </Menu>
  );

  return (
    <ClassSelect>
      <ClassStatusDropdown overlay={menu}>
        <ClassStatusButton data-cy="class-status">
          {filterClass || options[0]} <Icon color={themeColor} type="down" />
        </ClassStatusButton>
      </ClassStatusDropdown>
    </ClassSelect>
  );
};

export default ClassSelector;
