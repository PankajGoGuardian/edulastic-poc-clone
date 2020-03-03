import { desktopWidth, themeColor, white } from "@edulastic/colors";
import { MainHeader, EduButton } from "@edulastic/common";
import { roleuser, test } from "@edulastic/constants";
import {
  IconAddItems,
  IconCopy,
  IconDescription,
  IconDiskette,
  IconPencilEdit,
  IconPrint,
  IconReview,
  IconSend,
  IconSettings,
  IconShare
} from "@edulastic/icons";
import { message } from "antd";
import PropTypes from "prop-types";
import React, { memo, useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { getUserFeatures, getUserId, getUserRole } from "../../../../student/Login/ducks";
import ConfirmCancelTestEditModal from "../../../src/components/common/ConfirmCancelTestEditModal";
import ConfirmRegradeModal from "../../../src/components/common/ConfirmRegradeModal";
import EditTestModal from "../../../src/components/common/EditTestModal";
import FilterToggleBtn from "../../../src/components/common/FilterToggleBtn";
import { getStatus } from "../../../src/utils/getStatus";
import { publishForRegradeAction } from "../../ducks";
import { fetchAssignmentsAction, getAssignmentsSelector } from "../Assign/ducks";
import TestPageNav from "../TestPageNav/TestPageNav";
import {
  AssignButton,
  MobileHeaderFilterIcon,
  RightFlexContainer,
  RightWrapper,
  ShareIcon,
  TestStatus
} from "./styled";

const { statusConstants, testContentVisibility: testContentVisibilityOptions } = test;

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
  onShare,
  isUsed = false,
  onPublish,
  showEditButton = false,
  editEnable = false,
  windowWidth,
  onEnableEdit,
  showPublishButton,
  showShareButton,
  testStatus,
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
  features,
  userId,
  onCuratorApproveOrReject,
  userRole
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
        break;
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

  let isDirectOwner = owner;
  const { authors } = test;
  if (features.isCurator && authors && !authors.find(o => o._id === userId)) {
    isDirectOwner = false;
  }

  const ButtonWithIconStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "40px",
    width: "45px",
    padding: 0
  };

  const onClickCuratorApprove = () => {
    const { collections = [], _id: testId } = test;
    onCuratorApproveOrReject({ testId, status: "published", collections });
  };

  const onClickCuratorReject = () => {
    const { _id: testId } = test;
    onCuratorApproveOrReject({ testId, status: "rejected" });
  };

  const handlePrintTest = () => {
    const isAdmin = userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN;
    if (
      !isAdmin &&
      (test?.testContentVisibility === testContentVisibilityOptions.HIDDEN ||
        test?.testContentVisibility === testContentVisibilityOptions.GRADING)
    ) {
      return message.warn(
        `View of Items is restricted by the admin if content visibility is set to "Always hidden" OR "Hide prior to grading"`
      );
    }
    window.open(`/author/printAssessment/${test?._id}`, "_blank");
  };

  const headingSubContent = (
    <TestStatus data-cy="status" className={isPlaylist || editEnable ? "draft" : testStatus}>
      {isPlaylist || editEnable ? "DRAFT" : getStatus(testStatus)}
    </TestStatus>
  );

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
      {windowWidth > parseInt(desktopWidth, 10) ? (
        <MainHeader
          headingText={title || "Untitled Test"}
          headingSubContent={headingSubContent}
          flexDirection="column"
          alignItems="flex-start"
        >
          <TestPageNav
            onChange={onChangeNav}
            current={current}
            buttons={navButtons}
            owner={owner}
            showPublishButton={!showShareButton || showPublishButton}
          />

          <RightFlexContainer childMarginRight="5" justifyContent="flex-end">
            {showShareButton && (
              <EduButton title="Print" data-cy="printTest" disabled={isTestLoading} onClick={handlePrintTest}>
                <IconPrint />
              </EduButton>
            )}
            {showShareButton && (owner || features.isCurator) && (
              <EduButton title="Share" data-cy="share" onClick={onShare} disabled={isTestLoading}>
                <IconShare style={{ transform: "rotate(180deg)" }} />
              </EduButton>
            )}
            {showShareButton && owner && showPublishButton && (
              <EduButton title="Save as Draft" data-cy="save" onClick={onSave} disabled={isTestLoading}>
                <IconDiskette />
              </EduButton>
            )}
            {showShareButton && owner && showPublishButton && isDirectOwner ? (
              isPlaylist ? (
                <EduButton title="Publish Playlist" data-cy="publish" onClick={handlePublish} disabled={isTestLoading}>
                  PUBLISH
                </EduButton>
              ) : (
                <EduButton title="Publish Test" data-cy="publish" onClick={handlePublish} disabled={isTestLoading}>
                  <IconSend />
                </EduButton>
              )
            ) : null}
            {features.isCurator && testStatus === "inreview" && (
              <EduButton
                title={isPlaylist ? "Reject Playlist" : "Reject Test"}
                data-cy="publish"
                onClick={onClickCuratorReject}
                disabled={isTestLoading}
              >
                REJECT
              </EduButton>
            )}

            {features.isCurator && (testStatus === "inreview" || testStatus === "rejected") && (
              <EduButton
                title={isPlaylist ? "Approve Playlist" : "Approve Playlist"}
                data-cy="approve"
                onClick={onClickCuratorApprove}
                disabled={isTestLoading}
              >
                APPROVE
              </EduButton>
            )}
            {showEditButton && (
              <EduButton
                title="Edit Test"
                disabled={editEnable || isTestLoading}
                data-cy="edit"
                onClick={() => setOpenEditPopup(true)}
              >
                <IconPencilEdit />
              </EduButton>
            )}
            {showDuplicateButton && (
              <EduButton
                title="Duplicate Test"
                disabled={editEnable || isTestLoading}
                data-cy="edit"
                onClick={() => handleDuplicateTest()}
              >
                <IconCopy />
              </EduButton>
            )}
            {showShareButton &&
              (owner || testStatus === "published") &&
              !isPlaylist &&
              !showCancelButton &&
              !isPublishers && (
                <EduButton data-cy="assign" disabled={isTestLoading} onClick={handleAssign}>
                  ASSIGN
                </EduButton>
              )}
            {showCancelButton && (
              <EduButton data-cy="assign" onClick={() => setCancelState(true)}>
                CANCEL
              </EduButton>
            )}
          </RightFlexContainer>
        </MainHeader>
      ) : (
        <MainHeader headingText={title} mobileHeaderHeight={120} justifyContent="flex-start">
          <RightWrapper>
            {current === "addItems" && (
              <MobileHeaderFilterIcon>
                <FilterToggleBtn header="true" isShowFilter={isShowFilter} toggleFilter={toggleFilter} />
              </MobileHeaderFilterIcon>
            )}
            {(owner || features.isCurator) && (
              <EduButton data-cy="share" disabled={isTestLoading} onClick={onShare}>
                <ShareIcon />
              </EduButton>
            )}

            {owner && (
              <EduButton title="Save as Draft" data-cy="save" onClick={onSave} disabled={isTestLoading}>
                <IconDiskette />
              </EduButton>
            )}
            {showShareButton && owner && showPublishButton && isDirectOwner ? (
              isPlaylist ? (
                <EduButton title="Publish Playlist" data-cy="publish" onClick={handlePublish} disabled={isTestLoading}>
                  PUBLISH
                </EduButton>
              ) : (
                <EduButton title="Publish Test" data-cy="publish" onClick={handlePublish} disabled={isTestLoading}>
                  <IconSend />
                </EduButton>
              )
            ) : null}
            {features.isCurator && testStatus === "inreview" && (
              <EduButton
                title={isPlaylist ? "Reject Playlist" : "Reject Test"}
                data-cy="publish"
                onClick={onClickCuratorReject}
                disabled={isTestLoading}
              >
                REJECT
              </EduButton>
            )}
            {features.isCurator && (testStatus === "inreview" || testStatus === "rejected") && (
              <EduButton
                title={isPlaylist ? "Approve Playlist" : "Approve Playlist"}
                data-cy="approve"
                onClick={onClickCuratorApprove}
                disabled={isTestLoading}
              >
                APPROVE
              </EduButton>
            )}
            {showShareButton && (owner || testStatus === "published") && !isPlaylist && !isPublishers && (
              <EduButton disabled={isTestLoading} data-cy="assign" onClick={handleAssign}>
                ASSIGN
              </EduButton>
            )}
          </RightWrapper>
          <TestPageNav owner={owner} onChange={onChangeNav} current={current} buttons={navButtons} />
        </MainHeader>
      )}
    </>
  );
};

TestPageHeader.propTypes = {
  onChangeNav: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  current: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onShare: PropTypes.func.isRequired,
  onEnableEdit: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  editEnable: PropTypes.bool.isRequired,
  onAssign: PropTypes.func.isRequired
};

const enhance = compose(
  memo,
  withRouter,
  connect(
    state => ({
      test: state.tests.entity,
      testAssignments: getAssignmentsSelector(state),
      features: getUserFeatures(state),
      userId: getUserId(state),
      userRole: getUserRole(state)
    }),
    {
      publishForRegrade: publishForRegradeAction,
      fetchAssignments: fetchAssignmentsAction
    }
  )
);
export default enhance(TestPageHeader);
