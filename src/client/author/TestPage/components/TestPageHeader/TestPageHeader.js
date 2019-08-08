import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import { white, themeColor } from "@edulastic/colors";
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
  IconDescription,
  IconSend,
  IconPencilEdit
} from "@edulastic/icons";
import { Container, ShareIcon, Title, MenuIcon, MenuIconWrapper, TestStatus, TitleWrapper } from "./styled";

import TestPageNav from "../TestPageNav/TestPageNav";
import HeaderWrapper from "../../../src/mainContent/headerWrapper";

import { toggleSideBarAction } from "../../../src/actions/toggleMenu";
import EditTestModal from "../../../src/components/common/EditTestModal";

export const navButtonsTest = [
  {
    icon: <IconDescription color={white} width={16} height={16} />,
    value: "description",
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
export const playlistNavButtons = [
  {
    icon: <IconDescription color={white} width={16} height={16} />,
    value: "summary",
    text: "Summary"
  },
  {
    icon: <IconAddItems color={white} width={16} height={16} />,
    value: "addTests",
    text: "Add Tests"
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
  isUsed = false,
  onPublish,
  showEditButton = false,
  editEnable = false,
  windowWidth,
  onEnableEdit,
  toggleSideBar,
  showPublishButton,
  showShareButton,
  testStatus,
  onShowSource,
  isPlaylist,
  owner,
  onAssign
}) => {
  let navButtons = isPlaylist ? [...playlistNavButtons] : [...navButtonsTest];
  const [openEditPopup, setOpenEditPopup] = useState(false);
  if (!owner) {
    navButtons = navButtons.slice(2);
  }
  return windowWidth > 993 ? (
    <HeaderWrapper>
      <EditTestModal
        visible={openEditPopup}
        isUsed={isUsed}
        onCancel={() => setOpenEditPopup(false)}
        onOk={() => {
          onEnableEdit();
          setOpenEditPopup(false);
        }}
      />
      <TitleWrapper>
        <Title title={title}>{title || "Untitled Test"} </Title>
        <TestStatus className={isPlaylist || editEnable ? "draft" : testStatus}>
          {isPlaylist || editEnable ? "DRAFT" : testStatus}
        </TestStatus>
      </TitleWrapper>

      <TestPageNav
        onChange={onChangeNav}
        current={current}
        buttons={navButtons}
        owner={owner}
        showPublishButton={!showShareButton || showPublishButton}
      />

      <FlexContainer childMarginRight="5" justifyContent="flex-end" style={{ "flex-basis": "400px" }}>
        {showShareButton && false && (
          <EduButton data-cy="source" style={{ width: 42, padding: 0 }} size="large" onClick={onShowSource}>
            <IconSource color={themeColor} style={{ stroke: themeColor, strokeWidth: 1 }} />
          </EduButton>
        )}
        {showShareButton && owner && (
          <EduButton title="Share" data-cy="share" style={{ width: 42, padding: 0 }} size="large" onClick={onShare}>
            <IconShare color={themeColor} />
          </EduButton>
        )}
        {showShareButton && owner && showPublishButton && (
          <EduButton
            title="Save as Draft"
            data-cy="save"
            style={{ width: 42, padding: 0 }}
            size="large"
            onClick={onSave}
          >
            <IconDiskette color={themeColor} />
          </EduButton>
        )}
        {showShareButton && owner && showPublishButton && (
          <EduButton
            title="Publish Test"
            data-cy="publish"
            style={{ width: 42, padding: 0 }}
            size="large"
            onClick={() => {
              onPublish();
            }}
          >
            <IconSend color={themeColor} stroke={themeColor} />
          </EduButton>
        )}
        {showShareButton && showEditButton && (
          <EduButton
            title="Edit Test"
            disabled={editEnable}
            data-cy="edit"
            style={{ width: 42 }}
            size="large"
            onClick={() => setOpenEditPopup(true)}
          >
            <IconPencilEdit color={themeColor} />
          </EduButton>
        )}
        {showShareButton && !isPlaylist && (
          <EduButton data-cy="assign" style={{ width: 120 }} size="large" onClick={onAssign}>
            Assign
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
            {owner && (
              <EduButton size="large" onClick={onShare}>
                <ShareIcon />
              </EduButton>
            )}
            {owner && (
              <EduButton style={{ width: 80 }} disabled={creating} size="large" type="secondary" onClick={onSave}>
                {creating ? "Saving..." : "Save"}
              </EduButton>
            )}
          </FlexContainer>
        </FlexContainer>
        <TestPageNav owner={owner} onChange={onChangeNav} current={current} buttons={navButtons} />
      </FlexContainer>
    </Container>
  );
};

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
  testId: PropTypes.string,
  editEnable: PropTypes.bool,
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
