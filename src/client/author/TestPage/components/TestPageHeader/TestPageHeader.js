import React, { memo } from "react";
import PropTypes from "prop-types";
import { white } from "@edulastic/colors";
import { compose } from "redux";
import { connect } from "react-redux";
import { FlexContainer, EduButton } from "@edulastic/common";
import {
  IconAddItems,
  IconReview,
  IconSettings,
  IconShare,
  IconSource,
  IconDiskette,
  IconDescription
} from "@edulastic/icons";
import { Container, ShareIcon, Title, MenuIcon, MenuIconWrapper, TestStatus } from "./styled";

import TestPageNav from "../TestPageNav/TestPageNav";
import HeaderWrapper from "../../../src/mainContent/headerWrapper";

import { toggleSideBarAction } from "../../../src/actions/togglemenu";

export const navButtons = [
  {
    icon: <IconDescription color={white} width={16} height={16} />,
    value: "summary",
    text: "Description"
  },
  {
    icon: <IconAddItems color={white} width={16} height={16} />,
    value: "addItems",
    text: "Add Items"
  },
  {
    icon: <IconReview color={white} width={24} height={24} />,
    value: "review",
    text: "Review"
  },
  {
    icon: <IconSettings color={white} width={16} height={16} />,
    value: "settings",
    text: "Settings"
  }
];
// TODO mobile look
const TestPageHeader = ({
  onChangeNav,
  current,
  onSave,
  title,
  creating,
  onShare,
  onPublish,
  windowWidth,
  onEnableEdit,
  toggleSideBar,
  showPublishButton,
  showShareButton,
  testStatus,
  onShowSource,
  onAssign
}) =>
  windowWidth > 993 ? (
    <HeaderWrapper>
      <Title>
        {title} <TestStatus>{testStatus}</TestStatus>
      </Title>

      <TestPageNav onChange={onChangeNav} current={current} buttons={navButtons} />

      <FlexContainer justifyContent="space-between">
        <EduButton style={{ width: 42, padding: 0 }} size="large" onClick={onShowSource}>
          <IconSource color="#1774F0" style={{ stroke: "#1774F0", strokeWidth: 1 }} />
        </EduButton>
        {showShareButton && (
          <EduButton style={{ width: 42, padding: 0 }} size="large" onClick={onShare}>
            <IconShare color="#1774F0" />
          </EduButton>
        )}
        <EduButton style={{ width: 42, padding: 0 }} disabled={creating} size="large" onClick={onSave}>
          <IconDiskette color="#1774F0" />
        </EduButton>
        <EduButton style={{ width: 120 }} size="large" onClick={onAssign}>
          Assign
        </EduButton>
        {showPublishButton && testStatus === "draft" && (
          <EduButton style={{ width: 120 }} size="large" onClick={onPublish}>
            Publish
          </EduButton>
        )}
        {!showPublishButton && (
          <EduButton style={{ width: 120 }} size="large" onClick={onEnableEdit}>
            Edit
          </EduButton>
        )}
      </FlexContainer>
    </HeaderWrapper>
  ) : (
    <Container>
      <FlexContainer
        flexDirection="column"
        style={{
          width: "100%",
          justifyContent: "space-between"
        }}
      >
        <FlexContainer
          style={{
            width: "100%",
            justifyContent: "space-between",
            padding: "0 25px"
          }}
        >
          {" "}
          <MenuIconWrapper>
            <MenuIcon type="bars" onClick={toggleSideBar} />
            <Title>{title}</Title>
          </MenuIconWrapper>
          <FlexContainer justifyContent="space-between">
            <EduButton size="large" onClick={onShare}>
              <ShareIcon />
            </EduButton>
            <EduButton style={{ width: 80 }} disabled={creating} size="large" type="secondary" onClick={onSave}>
              {creating ? "Saving..." : "Save"}
            </EduButton>
          </FlexContainer>
        </FlexContainer>
        <TestPageNav onChange={onChangeNav} current={current} buttons={navButtons} />
      </FlexContainer>
    </Container>
  );

TestPageHeader.propTypes = {
  onChangeNav: PropTypes.func.isRequired,
  toggleSideBar: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  current: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  creating: PropTypes.bool.isRequired,
  onShare: PropTypes.func.isRequired,
  onEnableEdit: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  onShowSource: PropTypes.func.isRequired,
  onAssign: PropTypes.func.isRequired
};

const enhance = compose(
  memo,
  connect(
    null,
    { toggleSideBar: toggleSideBarAction }
  )
);
export default enhance(TestPageHeader);
