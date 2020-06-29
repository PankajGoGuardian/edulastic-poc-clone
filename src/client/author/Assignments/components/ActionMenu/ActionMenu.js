import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { assignmentApi } from "@edulastic/api";
import { get } from "lodash";
import { notification } from "@edulastic/common";
import * as Sentry from "@sentry/browser";
import { IconPrint, IconTrashAlt, IconBarChart } from "@edulastic/icons";
import { roleuser, test } from "@edulastic/constants";
import classIcon from "../../assets/manage-class.svg";
import copyItem from "../../assets/copy-item.svg";
import viewIcon from "../../assets/view.svg";
import infomationIcon from "../../assets/information.svg";
import responsiveIcon from "../../assets/responses.svg";
import { Container, StyledMenu, StyledLink, SpaceElement } from "./styled";

const { duplicateAssignment } = assignmentApi;
const { testContentVisibility: testContentVisibilityOptions } = test;

const ActionMenu = ({
  onOpenReleaseScoreSettings = () => {},
  currentAssignment = {},
  history = {},
  showPreviewModal = false,
  toggleEditModal = () => {},
  toggleDeleteModal = () => {},
  togglePrintModal = () => {},
  row = {},
  userId = "",
  userRole = "",
  assignmentTest = {},
  canEdit = true,
  userClassList
}) => {
  const getAssignmentDetails = () => (!Object.keys(currentAssignment).length ? row : currentAssignment);
  const assignmentDetails = getAssignmentDetails();
  const currentTestId = assignmentDetails.testId;
  const currentAssignmentId = assignmentDetails._id;
  const shouldSendAssignmentId =
    assignmentTest?.testType === test.type.COMMON || !assignmentTest?.authors?.find(a => a._id === userId);

  const handleShowPreview = () => {
    if (
      [test.testContentVisibility.GRADING, test.testContentVisibility.HIDDEN].includes(
        assignmentDetails?.testContentVisibility
      )
    ) {
      return notification({ messageKey: "previewOfItemsRestricted" });
    }
    if (shouldSendAssignmentId) {
      showPreviewModal(currentTestId, currentAssignmentId, assignmentDetails?.classId);
    } else {
      showPreviewModal(currentTestId);
    }
  };

  const createDuplicateAssignment = () => {
    duplicateAssignment({ _id: currentTestId, title: assignmentDetails.title })
      .then(testItem => {
        const duplicateTestId = testItem._id;
        history.push(`/author/tests/${duplicateTestId}`);
      })
      .catch(e => {
        notification({ msg: e?.data?.message || "User does not have duplicate permission." });
        Sentry.captureException(e);
      });
  };

  const handlePrintTest = () => {
    const isAdmin = userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN;
    const { assignmentVisibility = [] } = row;
    const { HIDDEN, GRADING } = testContentVisibilityOptions;
    if (!isAdmin && (assignmentVisibility.includes(HIDDEN) || assignmentVisibility.includes(GRADING))) {
      return notification({ type: "warn", messageKey: "viewItemsRestriccedByAdmin" });
    }
    togglePrintModal(currentTestId);
  };

  // owner of the assignment
  const assignmentOwnerId = get(assignmentDetails, "assignedBy._id", "");

  // current user and assignment owner is same: true
  const isAssignmentOwner = (userId && userId === assignmentOwnerId) || false;
  const isCoAuthor = userClassList?.some(c => c?._id === assignmentDetails?.classId) || false;
  const isAdmin = roleuser.DISTRICT_ADMIN === userRole || roleuser.SCHOOL_ADMIN === userRole;

  return (
    <Container>
      <StyledMenu>
        <Menu.Item data-cy="assign" key="assign">
          <Link
            to={{
              pathname: `/author/assignments/${currentTestId}`,
              state: { from: "assignments", fromText: "Assignments", toUrl: "/author/assignments" }
            }}
            rel="noopener noreferrer"
          >
            <img alt="icon" src={responsiveIcon} />
            <SpaceElement />
            Assign
          </Link>
        </Menu.Item>
        {!row.hasAutoSelectGroups && (
          <Menu.Item data-cy="duplicate" key="duplicate" onClick={createDuplicateAssignment}>
            <StyledLink target="_blank" rel="noopener noreferrer">
              <img alt="icon" src={copyItem} />
              <SpaceElement />
              Duplicate
            </StyledLink>
          </Menu.Item>
        )}

        <Menu.Item data-cy="preview" key="preview" onClick={handleShowPreview}>
          <StyledLink target="_blank" rel="noopener noreferrer">
            <img alt="icon" src={viewIcon} />
            <SpaceElement />
            Preview
          </StyledLink>
        </Menu.Item>
        <Menu.Item data-cy="view-details" key="view-details">
          <Link to={`/author/tests/tab/review/id/${currentTestId}`} rel="noopener noreferrer">
            <img alt="icon" src={infomationIcon} />
            <SpaceElement />
            View Test Details
          </Link>
        </Menu.Item>
        {!assignmentTest?.isDocBased && (
          <Menu.Item data-cy="print-assignment" key="print-assignment" onClick={handlePrintTest}>
            <StyledLink target="_blank" rel="noopener noreferrer">
              <IconPrint />
              <SpaceElement />
              Print Test
            </StyledLink>
          </Menu.Item>
        )}
        <Menu.Item
          data-cy="release-grades"
          key="release-grades"
          onClick={() => onOpenReleaseScoreSettings(currentTestId, currentAssignmentId)}
        >
          <StyledLink target="_blank" rel="noopener noreferrer">
            <img alt="icon" src={responsiveIcon} />
            <SpaceElement />
            Release Scores
          </StyledLink>
        </Menu.Item>
        <Menu.Item data-cy="summary-grades" key="summary-report">
          <Link to={`/author/reports/performance-by-students/test/${currentTestId}`}>
            <IconBarChart />
            <SpaceElement />
            View Summary Report
          </Link>
        </Menu.Item>
        {canEdit && (
          <Menu.Item
            data-cy="edit-Assignment"
            key="edit-Assignment"
            onClick={() => toggleEditModal(true, currentTestId)}
          >
            <StyledLink target="_blank" rel="noopener noreferrer">
              <img alt="icon" src={classIcon} />
              <SpaceElement />
              Edit and Regrade
            </StyledLink>
          </Menu.Item>
        )}
        {(isAssignmentOwner || isCoAuthor || isAdmin) && (
          <Menu.Item
            data-cy="delete-Assignment"
            key="delete-Assignment"
            onClick={() => toggleDeleteModal(currentTestId)}
          >
            <StyledLink target="_blank" rel="noopener noreferrer">
              <IconTrashAlt />
              <SpaceElement />
              Unassign
            </StyledLink>
          </Menu.Item>
        )}
      </StyledMenu>
    </Container>
  );
};

export default ActionMenu;
