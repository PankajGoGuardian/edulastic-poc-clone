import React, { useState } from "react";
import { Menu, Dropdown } from "antd";

import { ClassSelect, LabelMyClasses } from "./styled";

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
        Archive Classes
      </Menu.Item>
    </Menu>
  );

  return (
    <ClassSelect>
      <LabelMyClasses>My Classes</LabelMyClasses>
      <Dropdown.Button overlay={menu}> {filterClass || options[0]} </Dropdown.Button>
    </ClassSelect>
  );
};

export default ClassSelector;
