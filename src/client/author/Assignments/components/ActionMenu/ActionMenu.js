import React from "react";
import { Menu } from "antd";
import { test } from "@edulastic/constants";
import { Link } from "react-router-dom";
import { assignmentApi } from "@edulastic/api";

import simpleIcon from "../../assets/icon.svg";
import classIcon from "../../assets/manage-class.svg";
import copyItem from "../../assets/copy-item.svg";
import viewIcon from "../../assets/view.svg";
import infomationIcon from "../../assets/information.svg";
import responsiveIcon from "../../assets/responses.svg";
import toolsIcon from "../../assets/printing-tool.svg";
import devIcon from "../../assets/dev.svg";
import googleIcon from "../../assets/Google Classroom.svg";

import { Container, StyledMenu, StyledLink, SpaceElement, ActionButtonWrapper, ActionButton } from "./styled";

const { duplicateAssignment } = assignmentApi;

const ActionMenu = (onOpenReleaseScoreSettings, currentAssignment, history, showPreviewModal) => {
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
        <Menu.Item key="edit-Assignment">
          <Link style={{ marginTop: 2 }} to={`/author/tests/${currentAssignment.testId}/editAssigned`}>
            <img alt="icon" src={classIcon} />
            <SpaceElement />
            Edit Assessment
          </Link>
        </Menu.Item>
        <Menu.Item key="duplicate" onClick={createDuplicateAssignment}>
          <StyledLink target="_blank" rel="noopener noreferrer">
            <img alt="icon" src={copyItem} />
            <SpaceElement />
            Duplicate
          </StyledLink>
        </Menu.Item>
        <Menu.Item key="preview" onClick={() => showPreviewModal(currentTestId)}>
          <StyledLink target="_blank" rel="noopener noreferrer">
            <img alt="icon" src={viewIcon} />
            <SpaceElement />
            Preview
          </StyledLink>
        </Menu.Item>
        <Menu.Item key="view-details">
          <Link to={`/author/tests/${currentTestId}#review`} rel="noopener noreferrer">
            <img alt="icon" src={infomationIcon} />
            <SpaceElement />
            View Details
          </Link>
        </Menu.Item>
        <Menu.Item key="release-grades" onClick={() => onOpenReleaseScoreSettings(currentTestId, currentAssignmentId)}>
          <StyledLink target="_blank" rel="noopener noreferrer">
            <img alt="icon" src={responsiveIcon} />
            <SpaceElement />
            Release Grades
          </StyledLink>
        </Menu.Item>

        <Menu.Item key="assign">
          <Link to={`/author/assignments/${currentTestId}`} rel="noopener noreferrer">
            <img alt="icon" src={responsiveIcon} />
            <SpaceElement />
            Assign
          </Link>
        </Menu.Item>
      </StyledMenu>
    </Container>
  );
};

export default ActionMenu;
