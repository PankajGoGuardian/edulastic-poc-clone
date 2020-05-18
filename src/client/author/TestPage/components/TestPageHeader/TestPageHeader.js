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
import { get } from "lodash";
import { getUserFeatures, getUserId, getUserRole } from "../../../../student/Login/ducks";
import ConfirmCancelTestEditModal from "../../../src/components/common/ConfirmCancelTestEditModal";
import ConfirmRegradeModal from "../../../src/components/common/ConfirmRegradeModal";
import EditTestModal from "../../../src/components/common/EditTestModal";
import FilterToggleBtn from "../../../src/components/common/FilterToggleBtn";
import { getStatus } from "../../../src/utils/getStatus";
import {
  publishForRegradeAction,
  getTestsCreatingSelector,
  shouldDisableSelector,
  getTestItemsSelector
} from "../../ducks";
import { fetchAssignmentsAction, getAssignmentsSelector, getIsloadingAssignmentSelector } from "../Assign/ducks";
import TestPageNav from "../TestPageNav/TestPageNav";
import {
  AssignButton,
  MobileHeaderFilterIcon,
  RightFlexContainer,
  RightWrapper,
  ShareIcon,
  TestStatus
} from "./styled";
import PrintTestModal from "../../../src/components/common/PrintTestModal";

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
    text: "Manage Content"
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
  match,
  showDuplicateButton,
  handleDuplicateTest,
  showCancelButton,
  features,
  userId,
  onCuratorApproveOrReject,
  userRole,
  creating,
  isLoadingData,
  playlistStatus,
  testItems,
  isTestLoading,
  validateTest,
  setDisableAlert
}) => {
  let navButtons =
    buttons || (isPlaylist ? [...playlistNavButtons] : isDocBased ? [...docBasedButtons] : [...navButtonsTest]);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [showRegradePopup, setShowRegradePopup] = useState(false);
  const [currentAction, setCurrentAction] = useState("");
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showPrintOptionPopup, setShowPrintOptionPopup] = useState(false);

  const isPublishers = !!(features.isCurator || features.isPublisherAuthor);
  const isEdulasticCurator = userRole === roleuser.EDULASTIC_CURATOR;

  useEffect(() => {
    //TODO: As this component used also in playlist page, please call below api conditionally if no purpose of calling assignments list.
    if (!creating && match?.params?.oldId) {
      fetchAssignments({ testId: match?.params?.oldId, regradeAssignments: true });
    } else if (!creating && test?._id) {
      const testId = test.status === "draft" && test.isUsed ? test.previousTestId : test._id;
      fetchAssignments({ testId, regradeAssignments: true });
    }
  }, [test?._id, match?.params?.oldId]);

  const onRegradeConfirm = () => {
    if (validateTest(test)) {
      publishForRegrade(test._id);
    }
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
      onRegradeConfirm();
      return true;
    }
    onPublish();
  };

  const isNotRegradable = () => {
    const isTeacher = userRole === roleuser.TEACHER;
    const isAuthorsTest = test.itemGroups.some(group => group.type === "AUTOSELECT") || test.itemGroups.length > 1;
    return isTeacher && isAuthorsTest;
  };

  const handleRegrade = () => {
    if (isNotRegradable()) {
      //For time being block teacher regrading a authors test is blocked here
      message.warn("Teacher can not regrade author's test");
      return onPublish();
    }
    setDisableAlert(true);
    setCurrentAction("publish");
    onRegradeConfirm();
    return true;
  };

  const handleAssign = () => {
    if (isUsed && (updated || test.status !== statusConstants.PUBLISHED) && testAssignments?.length > 0) {
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
    if (history.location.state?.editTestFlow) {
      return history.push("/author/tests");
    }
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
    setShowPrintOptionPopup(true);
  };

  const handleOnClickPrintConfirm = params => {
    const { type, customValue } = params;
    handleOnClickPrintCancel();
    window.open(`/author/printAssessment/${test?._id}?type=${type}&qs=${customValue}`, "_blank");
  };

  const handleOnClickPrintCancel = () => setShowPrintOptionPopup(false);

  const headingSubContent = (
    <TestStatus
      data-cy="status"
      className={(isPlaylist || editEnable) && !isEdulasticCurator ? "draft" : isPlaylist ? playlistStatus : testStatus}
    >
      {(isPlaylist || editEnable) && !isEdulasticCurator
        ? "DRAFT"
        : getStatus(isPlaylist ? playlistStatus : testStatus)}
    </TestStatus>
  );

  const isRegradeFlow = test.isUsed && !!testAssignments.length && !isEdulasticCurator;
  // if edit assigned there should be assignments to enable the buttons
  const disableButtons =
    isLoadingData || (history.location.state?.editAssigned && !testAssignments.length && !test.isInEditAndRegrade);

  const isTestContainsDraftItem = testItems.some(i => i.status === statusConstants.DRAFT);

  const showPublishForEC =
    test.status === statusConstants.PUBLISHED && isTestContainsDraftItem && isEdulasticCurator && !isPlaylist;
  return (
    <>
      <EditTestModal
        visible={openEditPopup}
        isUsed={isUsed && !!testAssignments.length}
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
      {showPrintOptionPopup && (
        <PrintTestModal onProceed={handleOnClickPrintConfirm} onCancel={handleOnClickPrintCancel} />
      )}
      {windowWidth > parseInt(desktopWidth, 10) ? (
        <MainHeader
          headingText={title || (isPlaylist ? "Untitled Playlist" : "Untitled Test")}
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
            {showShareButton && !isPlaylist && (
              <EduButton
                title="Print"
                isGhost
                IconBtn
                data-cy="printTest"
                disabled={isTestLoading}
                onClick={handlePrintTest}
              >
                <IconPrint />
              </EduButton>
            )}
            {showShareButton && (owner || features.isCurator) && !isEdulasticCurator && (
              <EduButton isGhost IconBtn title="Share" data-cy="share" onClick={onShare} disabled={disableButtons}>
                <IconShare style={{ transform: "rotate(180deg)" }} />
              </EduButton>
            )}
            {showShareButton && owner && showPublishButton && !showPublishForEC && (
              <EduButton
                isGhost
                IconBtn
                title="Save as Draft"
                data-cy="save"
                onClick={onSave}
                disabled={disableButtons}
              >
                <IconDiskette />
              </EduButton>
            )}
            {showShareButton && owner && (showPublishButton && !isEdulasticCurator) && isDirectOwner ? (
              isPlaylist ? (
                <EduButton title="Publish Playlist" data-cy="publish" onClick={handlePublish} disabled={disableButtons}>
                  PUBLISH
                </EduButton>
              ) : (
                !editEnable &&
                !isRegradeFlow && (
                  <EduButton
                    isGhost
                    IconBtn
                    title="Publish Test"
                    data-cy="publish"
                    onClick={handlePublish}
                    disabled={disableButtons}
                  >
                    <IconSend />
                  </EduButton>
                )
              )
            ) : null}
            {features.isCurator && testStatus === "inreview" && (
              <EduButton
                title={isPlaylist ? "Reject Playlist" : "Reject Test"}
                data-cy="publish"
                onClick={onClickCuratorReject}
                disabled={disableButtons}
              >
                REJECT
              </EduButton>
            )}

            {features.isCurator && (testStatus === "inreview" || testStatus === "rejected") && (
              <EduButton
                title={isPlaylist ? "Approve Playlist" : "Approve Playlist"}
                data-cy="approve"
                onClick={onClickCuratorApprove}
                disabled={disableButtons}
              >
                APPROVE
              </EduButton>
            )}
            {showEditButton && (
              <EduButton
                isGhost
                IconBtn
                title="Edit Test"
                disabled={editEnable || disableButtons}
                data-cy="edit"
                onClick={() => (isEdulasticCurator ? onEnableEdit() : setOpenEditPopup(true))}
              >
                <IconPencilEdit />
              </EduButton>
            )}
            {showDuplicateButton && !isEdulasticCurator && (
              <EduButton
                isGhost
                IconBtn
                title="Duplicate Test"
                disabled={editEnable || disableButtons}
                data-cy="duplicate"
                onClick={() => handleDuplicateTest()}
              >
                <IconCopy />
              </EduButton>
            )}
            {showShareButton &&
              (owner || testStatus === "published") &&
              !isPlaylist &&
              !showCancelButton &&
              !isPublishers &&
              !isEdulasticCurator && (
                <EduButton data-cy="assign" disabled={disableButtons} onClick={handleAssign}>
                  ASSIGN
                </EduButton>
              )}
            {showCancelButton && (
              <EduButton data-cy="assign" onClick={() => setCancelState(true)}>
                CANCEL
              </EduButton>
            )}
            {showShareButton &&
              owner &&
              ((showPublishButton && !isEdulasticCurator) || showPublishForEC) &&
              isDirectOwner &&
              !isPlaylist &&
              editEnable &&
              !isRegradeFlow && (
                <EduButton title="Publish Test" data-cy="publish" onClick={handlePublish} disabled={disableButtons}>
                  PUBLISH
                </EduButton>
              )}
            {isRegradeFlow && !showEditButton && !showDuplicateButton && (
              <EduButton title="Regrade Test" data-cy="publish" onClick={handleRegrade} disabled={disableButtons}>
                REGRADE
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
            {(owner || features.isCurator) && !isEdulasticCurator && (
              <EduButton isGhost IconBtn data-cy="share" disabled={disableButtons} onClick={onShare}>
                <ShareIcon />
              </EduButton>
            )}

            {owner && !showPublishForEC && (
              <EduButton
                isGhost
                IconBtn
                title="Save as Draft"
                data-cy="save"
                onClick={onSave}
                disabled={disableButtons}
              >
                <IconDiskette />
              </EduButton>
            )}
            {showShareButton && owner && (showPublishButton && !isEdulasticCurator) && isDirectOwner ? (
              isPlaylist ? (
                <EduButton title="Publish Playlist" data-cy="publish" onClick={handlePublish} disabled={disableButtons}>
                  PUBLISH
                </EduButton>
              ) : (
                !isRegradeFlow && (
                  <EduButton
                    isGhost
                    IconBtn
                    title="Publish Test"
                    data-cy="publish"
                    onClick={handlePublish}
                    disabled={disableButtons}
                  >
                    <IconSend />
                  </EduButton>
                )
              )
            ) : null}
            {features.isCurator && testStatus === "inreview" && (
              <EduButton
                title={isPlaylist ? "Reject Playlist" : "Reject Test"}
                data-cy="publish"
                onClick={onClickCuratorReject}
                disabled={disableButtons}
              >
                REJECT
              </EduButton>
            )}
            {features.isCurator && (testStatus === "inreview" || testStatus === "rejected") && (
              <EduButton
                title={isPlaylist ? "Approve Playlist" : "Approve Playlist"}
                data-cy="approve"
                onClick={onClickCuratorApprove}
                disabled={disableButtons}
              >
                APPROVE
              </EduButton>
            )}
            {showShareButton &&
              (owner || testStatus === "published") &&
              !isPlaylist &&
              !isPublishers &&
              !isEdulasticCurator && (
                <EduButton disabled={disableButtons} data-cy="assign" onClick={handleAssign}>
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
      userRole: getUserRole(state),
      creating: getTestsCreatingSelector(state),
      isLoadingData: shouldDisableSelector(state),
      testItems: getTestItemsSelector(state)
    }),
    {
      publishForRegrade: publishForRegradeAction,
      fetchAssignments: fetchAssignmentsAction
    }
  )
);
export default enhance(TestPageHeader);
