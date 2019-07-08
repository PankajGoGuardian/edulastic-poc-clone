/* eslint-disable no-unused-expressions */
/* eslint-disable no-lone-blocks */
/* eslint-disable jsx-a11y/alt-text */
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

const { releaseGradeLabels } = test;
const { duplicateAssignment } = assignmentApi;

const ActionMenu = (onOpenReleaseScoreSettings, currentAssignment, history, showPreviewModal) => {
  const showRleaseGrade =
    currentAssignment.releaseScore === releaseGradeLabels.DONT_RELEASE || !currentAssignment.releaseScore;
  const currentTestId = currentAssignment.testId;
  const currentAssignmentId = currentAssignment._id;
  const MenuItems = [];
  const createDuplicateAssignment = () => {
    duplicateAssignment({ _id: currentTestId, title: currentAssignment.title }).then(testItem => {
      const duplicateTestId = testItem._id;
      history.push(`/author/tests/${duplicateTestId}`);
    });
  };

  MenuItems.push(
    <Menu.Item key="edit-Assignment">
      <Link style={{ marginTop: 2 }} to={`/author/tests/${currentAssignment.testId}/editAssigned`}>
        <img alt="icon" src={classIcon} />
        <SpaceElement />
        Edit Assessment
      </Link>
    </Menu.Item>
  );
  MenuItems.push(
    <Menu.Item key="duplicate" onClick={createDuplicateAssignment}>
      <StyledLink target="_blank" rel="noopener noreferrer">
        <img alt="icon" src={copyItem} />
        <SpaceElement />
        Duplicate
      </StyledLink>
    </Menu.Item>
  );
  MenuItems.push(
    <Menu.Item key="preview" onClick={() => showPreviewModal(currentTestId)}>
      <StyledLink target="_blank" rel="noopener noreferrer">
        <img alt="icon" src={viewIcon} />
        <SpaceElement />
        Preview
      </StyledLink>
    </Menu.Item>
  );
  MenuItems.push(
    <Menu.Item key="view-details">
      <Link to={`/author/tests/${currentTestId}#review`} rel="noopener noreferrer">
        <img alt="icon" src={infomationIcon} />
        <SpaceElement />
        View Details
      </Link>
    </Menu.Item>
  );
  {
    showRleaseGrade &&
      MenuItems.push(
        <Menu.Item key="release-grades" onClick={() => onOpenReleaseScoreSettings(currentTestId, currentAssignmentId)}>
          <StyledLink target="_blank" rel="noopener noreferrer">
            <img alt="icon" src={responsiveIcon} />
            <SpaceElement />
            Release Grades
          </StyledLink>
        </Menu.Item>
      );
  }
  return (
    <Container>
      <StyledMenu>{MenuItems}</StyledMenu>
    </Container>
  );
};

export default ActionMenu;
