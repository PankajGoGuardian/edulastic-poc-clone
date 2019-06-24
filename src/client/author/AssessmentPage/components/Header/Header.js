import React from "react";
import PropTypes from "prop-types";
import { Button, Dropdown, Menu, Icon } from "antd";

import { IconDiskette } from "@edulastic/icons";
import { FlexContainer, EduButton } from "@edulastic/common";

import HeaderWrapper from "../../../src/mainContent/headerWrapper";
import Title from "../../common/Title";
import TestPageNav from "../../../TestPage/components/TestPageNav/TestPageNav";
import { Status, SaveWrapper } from "./styled";

const style = { justifyContent: "center", background: "white" };

const Header = ({ onTabChange, currentTab, tabs, title, status, onSave, onPublish, onAssign }) => (
  <HeaderWrapper>
    <Title>
      {title} <Status>{status}</Status>
    </Title>
    <TestPageNav onChange={onTabChange} current={currentTab} buttons={tabs} />
    <SaveWrapper>
      <FlexContainer justifyContent="space-between" className="abcdTesting">
        <EduButton data-cy="save" style={{ ...style, width: 42, padding: 0 }} size="large" onClick={onSave("draft")}>
          <IconDiskette color="#00AD50" fill="#00AD50" />
        </EduButton>
        <EduButton data-cy="assign" style={{ ...style, width: 120 }} size="large" onClick={onAssign}>
          Assign
        </EduButton>
        <EduButton data-cy="publish" style={{ ...style, width: 120 }} size="large" onClick={onPublish}>
          Publish
        </EduButton>
      </FlexContainer>
    </SaveWrapper>
  </HeaderWrapper>
);

Header.propTypes = {
  onTabChange: PropTypes.func.isRequired,
  currentTab: PropTypes.string.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired
};

export default Header;
