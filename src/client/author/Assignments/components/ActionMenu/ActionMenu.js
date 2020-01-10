import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { assignmentApi } from "@edulastic/api";

import { IconPrint, IconTrashAlt } from "@edulastic/icons";

import classIcon from "../../assets/manage-class.svg";
import copyItem from "../../assets/copy-item.svg";
import viewIcon from "../../assets/view.svg";
import infomationIcon from "../../assets/information.svg";
import responsiveIcon from "../../assets/responses.svg";

import { Container, StyledMenu, StyledLink, SpaceElement, ActionButtonWrapper, ActionButton } from "./styled";

const { duplicateAssignment } = assignmentApi;

const ActionMenu = (
  onOpenReleaseScoreSettings,
  currentAssignment,
  history,
  showPreviewModal,
  toggleEditPopup,
  toggleDeleteModal,
  row = {}
) => {
  const currentTestId = currentAssignment.testId;
  const currentAssignmentId = currentAssignment._id;
  const createDuplicateAssignment = () => {
    duplicateAssignment({ _id: currentTestId, title: currentAssignment.title }).then(testItem => {
      const duplicateTestId = testItem._id;
      history.push(`/author/tests/${duplicateTestId}`);
    });
  };

  return (
    <Container>
      <StyledMenu>
        <Menu.Item data-cy="assign" key="assign">
          <Link to={`/author/assignments/${currentTestId}`} rel="noopener noreferrer">
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

        <Menu.Item data-cy="preview" key="preview" onClick={() => showPreviewModal(currentTestId)}>
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
        <Menu.Item data-cy="print-assignment" key="print-assignment">
          <Link to={`/author/printAssessment/${currentTestId}`} target="_blank" rel="noopener noreferrer">
            <IconPrint />
            <SpaceElement />
            Print Test
          </Link>
        </Menu.Item>
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
        <Menu.Item
          data-cy="edit-Assignment"
          key="edit-Assignment"
          onClick={() => toggleEditPopup(true, currentAssignment.testId)}
        >
          <StyledLink target="_blank" rel="noopener noreferrer">
            <img alt="icon" src={classIcon} />
            <SpaceElement />
            Edit Test
          </StyledLink>
        </Menu.Item>
        <Menu.Item
          data-cy="delete-Assignment"
          key="delete-Assignment"
          onClick={() => toggleDeleteModal(currentAssignment.testId)}
        >
          <StyledLink target="_blank" rel="noopener noreferrer">
            <IconTrashAlt />
            <SpaceElement />
            Unassign
          </StyledLink>
        </Menu.Item>
      </StyledMenu>
    </Container>
  );
};

export default ActionMenu;
