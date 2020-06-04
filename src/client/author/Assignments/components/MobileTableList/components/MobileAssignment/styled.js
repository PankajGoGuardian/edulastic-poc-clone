import styled from "styled-components";

import { Card, EduButton } from "@edulastic/common";
import { themeColor, darkGrey2, authorAssignment } from "@edulastic/colors";

import { BtnAction } from "../../../TableList/styled";

const { assignmentStatusBg } = authorAssignment;

export const AssignmentThumbnail = styled.div`
  width: 100%;
  height: 66px;
  background: ${({ thumbnail }) => `url(${thumbnail})` || themeColor};
  background-size: cover;
  background-position: center left;
  border-radius: 5px;
  margin-bottom: 8px;
  text-align: center;
  display: inline-block;
`;

export const AssignmentBodyWrapper = styled.div`
  background: #f6f6f6;
  border-radius: 2px;
  padding: 20px;
`;

export const AssignmentWrapper = styled(Card)`
  text-align: center;
  box-shadow: none;
  border-radius: 0px;
  margin-bottom: ${({ mb }) => mb || "15px"};
  .ant-card-body {
    padding: 0;
  }
`;

export const TypeWrapper = styled.span`
  width: 20px;
  height: 20px;
`;

export const AssignmentTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${darkGrey2};
  text-align: center;
  margin-bottom: 20px;
`;

export const AssignmentDetailsWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0px;
  }
`;

export const ExpandedRow = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
`;

export const ExpandRowWrapper = styled.div`
  width: 100%;
  pointer-events: ${props => (props.expanded ? "all" : "none")};
  transition: all 200ms ease-out;

  &:not(:last-child) {
    margin-bottom: 6px;
  }
`;

export const ExpandRowTopContent = styled.div`
  display: flex;
  width: 100%;
`;

export const ExpandRowTopContentItem = styled.div`
  width: 50%;
`;

export const ExpandButton = styled(EduButton)`
  &.ant-btn.ant-btn-primary {
    background: transparent;
  }
  height: 36px !important;
  width: 90%;
`;

export const AssignmentStatus = styled.span`
  display: inline-block;
  font-size: 10px;
  text-transform: uppercase;
  text-align: center;
  line-height: 24px;
  width: 80px !important;
  height: 24px;
  border-radius: 4px;
  background: ${({ type }) => {
    if (type === "IN PROGRESS") {
      return assignmentStatusBg.IN_PROGRESS;
    }
    if (type === "IN GRADING") {
      return assignmentStatusBg.IN_GRADING;
    }
    if (type === "DONE") {
      return assignmentStatusBg.DONE;
    }
    if (type === "SUBMITTED") {
      return assignmentStatusBg.SUBMITTED;
    }
    if (type === "NOT STARTED") {
      return assignmentStatusBg.NOT_OPEN;
    }
    return assignmentStatusBg.NOT_OPEN;
  }};

  color: ${({ type }) => {
    if (type === "IN PROGRESS") {
      return "#316086";
    }
    if (type === "SUBMITTED") {
      return "#00624F";
    }
    return "#2E4D6C";
  }};
`;

export const AssignmentNavigation = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 12px;

  a {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25%;

    img {
      height: 21px;
      width: 40px;
    }
  }
`;

export const MobileActionButton = styled(BtnAction)`
  width: 244px;
  max-width: 100%;
  height: 32px;
  font-size: 11px;
  text-transform: uppercase;
  margin-bottom: 34px;
`;
