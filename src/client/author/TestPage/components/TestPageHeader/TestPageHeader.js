import React, { memo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { white, themeColor } from "@edulastic/colors";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { EduButton, MenuIcon } from "@edulastic/common";
import { test } from "@edulastic/constants";
import {
  IconAddItems,
  IconReview,
  IconSettings,
  IconShare,
  IconSource,
  IconDiskette,
  IconDescription,
  IconSend,
  IconPencilEdit,
  IconCopy
} from "@edulastic/icons";
import FilterToggleBtn from "../../../src/components/common/FilterToggleBtn";
import {
  MobileHeader,
  RightWrapper,
  MainContainer,
  ShareIcon,
  Title,
  MenuIconWrapper,
  TestStatus,
  TitleWrapper,
  RightFlexContainer,
  AssignButton,
  MobileHeaderFilterIcon,
  SaveBtn
} from "./styled";

import TestPageNav from "../TestPageNav/TestPageNav";
import HeaderWrapper from "../../../src/mainContent/headerWrapper";

import { toggleSideBarAction } from "../../../src/actions/toggleMenu";
import EditTestModal from "../../../src/components/common/EditTestModal";
import ConfirmRegradeModal from "../../../src/components/common/ConfirmRegradeModal";
import { publishForRegradeAction } from "../../ducks";
import { fetchAssignmentsAction, getAssignmentsSelector } from "../Assign/ducks";
import ConfirmCancelTestEditModal from "../../../src/components/common/ConfirmCancelTestEditModal";
import { getUserFeatures } from "../../../../student/Login/ducks";
const { statusConstants } = test;

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
export const docBasedButtons = [
  {
    icon: <IconDescription color={white} width={16} height={16} />,
    value: "description",
    text: "Description"
  },
  {
    icon: <IconAddItems color={white} width={16} height={16} />,
    value: "worksheet",
    text: "Worksheet"
  },
  {
    icon: <IconReview color={white} width={16} height={16} />,
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
  buttons,
  isDocBased = false,
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
  onAssign,
  history,
  publishForRegrade,
  test,
  updated,
  toggleFilter,
  isShowFilter,
  fetchAssignments,
  testAssignments,
  isTestLoading,
  match,
  showDuplicateButton,
  handleDuplicateTest,
  showCancelButton,
  features
}) => {
  let navButtons =
    buttons || (isPlaylist ? [...playlistNavButtons] : isDocBased ? [...docBasedButtons] : [...navButtonsTest]);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [showRegradePopup, setShowRegradePopup] = useState(false);
  const [currentAction, setCurrentAction] = useState("");
  const [showCancelPopup, setShowCancelPopup] = useState(false);

  const isPublishers = !!(features.isCurator || features.isPublisherAuthor);

  useEffect(() => {
    if (match?.params?.oldId) {
      fetchAssignments(match?.params?.oldId);
    } else if (test?._id) {
      fetchAssignments(test?._id);
    }
  }, [test?._id, match?.params?.oldId]);

  const onRegradeConfirm = () => {
    publishForRegrade(test._id);
  };

  const onCancelRegrade = () => {
    setShowRegradePopup(false);
    switch (currentAction) {
      case "assign":
        onAssign();
        break;
      case "publish":
        onPublish();
      default:
    }
  };

  const handlePublish = () => {
    if (isUsed && (updated || test.status !== statusConstants.PUBLISHED) && testAssignments?.length > 0) {
      setCurrentAction("publish");
      return setShowRegradePopup(true);
    }
    onPublish();
  };

  const handleAssign = () => {
    if (isUsed && (updated || test.status !== statusConstants.PUBLISHED)) {
      setCurrentAction("assign");
      return setShowRegradePopup(true);
    }
    onAssign();
  };

  const setCancelState = val => {
    setShowCancelPopup(val);
  };

  const handleCancelEdit = () => {
    setCancelState(false);
  };

  const confirmCancel = () => {
    history.push("/author/assignments");
  };

  if (!owner) {
    navButtons = navButtons.slice(2);
  }

  const ButtonWithIconStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "40px",
    width: "45px",
    padding: 0
  };

  return (
    <>
      <EditTestModal
        visible={openEditPopup}
        isUsed={isUsed}
        onCancel={() => setOpenEditPopup(false)}
        onOk={() => {
          onEnableEdit();
          setOpenEditPopup(false);
        }}
      />
      <ConfirmRegradeModal
        visible={showRegradePopup}
        onCancel={() => setShowRegradePopup(false)}
        onOk={onRegradeConfirm}
        onCancelRegrade={onCancelRegrade}
      />
      <ConfirmCancelTestEditModal
        showCancelPopup={showCancelPopup}
        onCancel={handleCancelEdit}
        onOk={confirmCancel}
        onClose={() => setCancelState(false)}
      />
      {windowWidth > 992 ? (
        <HeaderWrapper>
          <TitleWrapper>
            <Title data-cy="title" title={title}>
              {title || "Untitled Test"}{" "}
            </Title>
            <TestStatus data-cy="status" className={isPlaylist || editEnable ? "draft" : testStatus}>
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

          <RightFlexContainer childMarginRight="5" justifyContent="flex-end">
            {showShareButton && false && (
              <EduButton
                data-cy="source"
                style={ButtonWithIconStyle}
                size="large"
                onClick={onShowSource}
                disabled={isTestLoading}
              >
                <IconSource color={themeColor} style={{ stroke: themeColor, strokeWidth: 1 }} />
              </EduButton>
            )}
            {showShareButton && (owner || features.isCurator) && (
              <EduButton
                title="Share"
                data-cy="share"
                style={ButtonWithIconStyle}
                size="large"
                onClick={onShare}
                disabled={isTestLoading}
              >
                <IconShare color={themeColor} style={{ transform: "rotate(180deg)" }} />
              </EduButton>
            )}
            {showShareButton && owner && showPublishButton && (
              <EduButton
                title="Save as Draft"
                data-cy="save"
                style={ButtonWithIconStyle}
                size="large"
                onClick={onSave}
                disabled={isTestLoading}
              >
                <IconDiskette color={themeColor} />
              </EduButton>
            )}
            {showShareButton && owner && showPublishButton ? (
              isPlaylist ? (
                <EduButton
                  title="Publish Playlist"
                  data-cy="publish"
                  style={{ width: "120px", padding: "0 11px" }}
                  size="large"
                  onClick={handlePublish}
                  disabled={isTestLoading}
                >
                  Publish
                </EduButton>
              ) : (
                <EduButton
                  title="Publish Test"
                  data-cy="publish"
                  style={ButtonWithIconStyle}
                  size="large"
                  onClick={handlePublish}
                  disabled={isTestLoading}
                >
                  <IconSend color={themeColor} stroke={themeColor} />
                </EduButton>
              )
            ) : null}

            {showEditButton && (
              <EduButton
                title="Edit Test"
                disabled={editEnable || isTestLoading}
                data-cy="edit"
                style={ButtonWithIconStyle}
                size="large"
                onClick={() => setOpenEditPopup(true)}
              >
                <IconPencilEdit color={themeColor} />
              </EduButton>
            )}
            {showDuplicateButton && (
              <EduButton
                title="Duplicate Test"
                disabled={editEnable || isTestLoading}
                data-cy="edit"
                style={{ fontSize: "17px" }}
                size="large"
                onClick={() => handleDuplicateTest()}
              >
                <IconCopy color={themeColor} />
              </EduButton>
            )}
            {showShareButton &&
              (owner || testStatus === "published") &&
              !isPlaylist &&
              !showCancelButton &&
              !isPublishers && (
                <AssignButton data-cy="assign" size="large" disabled={isTestLoading} onClick={handleAssign}>
                  Assign
                </AssignButton>
              )}
            {showCancelButton && (
              <AssignButton data-cy="assign" size="large" onClick={() => setCancelState(true)}>
                Cancel
              </AssignButton>
            )}
          </RightFlexContainer>
        </HeaderWrapper>
      ) : (
        <MobileHeader>
          <MainContainer flexDirection="column">
            <MenuIconWrapper>
              <MenuIcon className="hamburger" onClick={toggleSideBar} />
              <Title>{title}</Title>
            </MenuIconWrapper>
            <RightWrapper>
              {current === "addItems" && (
                <MobileHeaderFilterIcon>
                  <FilterToggleBtn header="true" isShowFilter={isShowFilter} toggleFilter={toggleFilter} />
                </MobileHeaderFilterIcon>
              )}
              {(owner || features.isCurator) && (
                <EduButton
                  data-cy="share"
                  style={ButtonWithIconStyle}
                  disabled={isTestLoading}
                  size="large"
                  onClick={onShare}
                >
                  <ShareIcon color={themeColor} />
                </EduButton>
              )}

              {owner && (
                <EduButton
                  title="Save as Draft"
                  data-cy="save"
                  style={ButtonWithIconStyle}
                  size="large"
                  onClick={onSave}
                  disabled={isTestLoading}
                >
                  <IconDiskette color={themeColor} />
                </EduButton>
              )}
              {showShareButton && owner && showPublishButton ? (
                isPlaylist ? (
                  <EduButton
                    title="Publish Playlist"
                    data-cy="publish"
                    style={{ width: "auto", padding: "0 11px" }}
                    size="large"
                    onClick={handlePublish}
                    disabled={isTestLoading}
                  >
                    Publish
                  </EduButton>
                ) : (
                  <EduButton
                    title="Publish Test"
                    data-cy="publish"
                    style={ButtonWithIconStyle}
                    size="large"
                    onClick={handlePublish}
                    disabled={isTestLoading}
                  >
                    <IconSend color={themeColor} stroke={themeColor} />
                  </EduButton>
                )
              ) : null}

              {showShareButton && (owner || testStatus === "published") && !isPlaylist && !isPublishers && (
                <AssignButton disabled={isTestLoading} data-cy="assign" size="large" onClick={handleAssign}>
                  Assign
                </AssignButton>
              )}
            </RightWrapper>
            <TestPageNav owner={owner} onChange={onChangeNav} current={current} buttons={navButtons} />
          </MainContainer>
        </MobileHeader>
      )}
    </>
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
  withRouter,
  connect(
    state => ({
      test: state.tests.entity,
      testAssignments: getAssignmentsSelector(state),
      features: getUserFeatures(state)
    }),
    {
      toggleSideBar: toggleSideBarAction,
      publishForRegrade: publishForRegradeAction,
      fetchAssignments: fetchAssignmentsAction
    }
  )
);
export default enhance(TestPageHeader);
