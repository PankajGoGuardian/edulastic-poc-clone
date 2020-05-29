import {
  authorAssignment,
  cardTitleColor,
  desktopWidth,
  extraDesktopWidthMax,
  largeDesktopWidth,
  lightGreySecondary,
  mediumDesktopExactWidth,
  mobileWidth,
  testTypeColor,
  themeColor,
  title,
  white
} from "@edulastic/colors";
import { testActivity } from "@edulastic/constants";
import { IconDownEmptyArrow } from "@edulastic/icons";
import { Button, Table, Tag } from "antd";
import styled from "styled-components";

const { assignmentStatusBg, lightBlue } = authorAssignment;
const {
  authorAssignmentConstants: {
    assignmentStatus: {
      NOT_OPEN,
      IN_PROGRESS,
      IN_GRADING,
      NOT_GRADED,
      GRADES_HELD,
      DONE,
      IN_PROGRESS_PAUSED,
      IN_GRADING_PAUSED,
      NOT_GRADED_PAUSED,
      GRADES_HELD_PAUSED
    }
  }
} = testActivity;

const defineStatusBg = status => {
  switch (status) {
    case NOT_OPEN:
      return assignmentStatusBg.NOT_OPEN;
    case IN_PROGRESS:
      return assignmentStatusBg.IN_PROGRESS;
    case IN_PROGRESS_PAUSED:
      return assignmentStatusBg.IN_PROGRESS;
    case IN_GRADING:
      return assignmentStatusBg.IN_GRADING;
    case IN_GRADING_PAUSED:
      return assignmentStatusBg.IN_GRADING;
    case NOT_GRADED:
      return assignmentStatusBg.NOT_GRADED;
    case NOT_GRADED_PAUSED:
      return assignmentStatusBg.NOT_GRADED;
    case GRADES_HELD:
      return assignmentStatusBg.GRADES_HELD;
    case GRADES_HELD_PAUSED:
      return assignmentStatusBg.GRADES_HELD;
    case DONE:
      return assignmentStatusBg.DONE;
    default:
      return "";
  }
};

export const Container = styled.div`
  padding: 30;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
`;

export const Icon = styled.img`
  width: 15px;
  height: 15px;

  @media (min-width: ${mediumDesktopExactWidth}) {
    width: 18px;
    height: 18px;
  }
`;

export const TableData = styled(Table)`
  text-align: center;
  width: auto;

  .ant-spin-nested-loading,
  .ant-spin-container {
    position: static;
  }

  .ant-table-body {
    tr {
      &:hover {
        cursor: pointer;
      }
    }
    .ant-table-thead > tr {
      & > th {
        background: ${white};
        padding: 5px 0px 15px;
        border-bottom: none;
        font-weight: bold;
        text-transform: uppercase;
        color: ${cardTitleColor};
        white-space: nowrap;
        text-align: center;
        font-size: ${props => props.theme.headerFilterFontSize};

        @media (min-width: ${mediumDesktopExactWidth}) {
          font-size: ${props => props.theme.linkFontSize};
        }
        @media (min-width: ${extraDesktopWidthMax}) {
          font-size: ${props => props.theme.smallFontSize};
        }

        &.assignment-name {
          text-align: left !important;
        }
        &.ant-table-column-has-actions.ant-table-column-has-sorters:hover,
        & .ant-table-header-column .ant-table-column-sorters::before {
          background: ${white};
        }
        &.ant-table-column-has-actions.ant-table-column-has-filters
          &.ant-table-column-has-actions.ant-table-column-has-sorters {
          text-align: center;
        }
        .ant-table-column-sorters {
          display: flex;
          justify-content: center;

          .ant-table-column-sorter-inner {
            &.ant-table-column-sorter-inner-full {
              margin-top: 0em;
            }
            .ant-table-column-sorter {
              &-up,
              &-down {
                font-size: ${props => props.theme.headerFilterFontSize};
              }
            }
          }
        }
      }
    }
  }

  tr.ant-table-expanded-row,
  tr.ant-table-expanded-row:hover {
    background: transparent;
  }

  tr.ant-table-expanded-row td > .ant-table-wrapper {
    margin: 0;
  }

  .ant-table-tbody {
    text-align: center;
    & > tr:hover:not(.ant-table-expanded-row) > td {
      background: #f2f3f2;
    }
    .ant-table-expanded-row > td {
      text-align: center;
      padding: 0px 0px 10px;
    }

    td {
      padding: 5px 0;
      font-weight: 600;
    }
  }

  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f2f3f2;
    font-size: ${props => props.theme.linkFontSize};
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: ${props => props.theme.smallFontSize};
  }

  .ant-table-tbody > tr.ant-table-expanded-row td {
    border-bottom: none;
  }

  .ant-pagination {
    margin-bottom: 0;
    position: absolute;
    right: 15px;
    bottom: 15px;
    top: auto;
  }
  .ant-table-row-expand-icon {
    display: none;
  }

  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    max-width: 50px;
  }
`;

export const TestThumbnail = styled.img`
  border-radius: 4px;
  width: 32px;
  height: 24px;
  margin-right: 5px;

  @media (min-width: ${mediumDesktopExactWidth}) {
    width: 50px;
  }
`;

export const AssignmentTD = styled.div`
  text-align: left;
  padding-left: 0px !important;
  padding-right: 0px !important;
  width: ${({ showFilter }) => (showFilter ? "90px" : "150px")};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${props => props.theme.linkFontSize};

  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: ${props => props.theme.bodyFontSize};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    width: ${({ showFilter }) => (showFilter ? "190px" : "250px")};
    font-size: ${props => props.theme.standardFont};
  }
`;

export const IconArrowDown = styled.img`
  color: ${themeColor};
  margin-right: 5px;
  width: 6px;
`;

export const BtnAction = styled(Button)`
  color: ${themeColor};
  border: none;
  box-shadow: 0px 2px 4px 0 rgba(201, 208, 219, 0.5);
  height: 28px;
  font-size: ${props => props.theme.linkFontSize};
  font-weight: 600;
  width: 100%;
  padding: 0px;
  text-align: center;
  &:hover,
  &:focus {
    background-color: ${themeColor};
    color: ${white};
  }
`;

export const AssignedImg = styled.img`
  color: ${lightBlue};
`;

export const TypeIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  max-width: 18px;
  background: ${props =>
    props.type === "p" ? testTypeColor.practice : props.type === "c" ? testTypeColor.common : testTypeColor.assessment};
  color: ${white};
  border-radius: 50%;
  font-weight: 600;
  font-size: ${props => props.theme.bodyFontSize};
`;

export const TypeWrapper = styled.span`
  width: ${props => props.width || "90px"};
  display: flex;
  float: ${props => props.float || "right"};
  align-items: center;
  justify-content: ${props => props.justify || "flex-start"};

  @media (min-width: ${mediumDesktopExactWidth}) {
    width: ${props => props.width || "110px"};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    width: ${props => props.width || "125px"};
  }
`;

export const TimedTestIndicator = styled.span`
  height: 18px;
  max-width: 65px;
  min-width: 65px;
  text-align: left;
  font-weight: 600;
  margin-left: 8px;
  display: flex;
  align-items: center;
  svg {
    margin-right: 6px;
  }
  @media (min-width: ${mediumDesktopExactWidth}) {
    max-width: 80px;
    min-width: 80px;
  }
`;

export const IndicatorText = styled.div`
  display: inline-block;
`;

export const ExpandDivdier = styled.div`
  color: ${themeColor};
  cursor: pointer;
  font-size: ${props => props.theme.standardFont};
`;

export const TitleCase = styled.div`
  text-transform: Capitalize;
`;

export const ActionDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  flex: 1;
  padding-right: 15px;
`;

export const ActionsWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  padding-right: 15px;
`;

export const GreyFont = styled.div`
  max-width: ${props => (props.showEllipsis ? "100px" : "auto")};
  color: ${title};
  font-size: ${props => props.theme.linkFontSize};
  position: relative;
  left: ${({ left }) => left || 0}px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  &.class-column {
    white-space: initial;
    text-align: right;
    padding-right: 20px;
    word-break: break-word;
    @media (min-width: ${largeDesktopWidth}) {
      padding-right: 50px;
    }
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: ${props => props.theme.bodyFontSize};
  }
`;

export const StatusLabel = styled(Tag)`
  border-width: 1px;
  background-color: ${({ status }) => defineStatusBg(status)};
  border-color: ${({ status }) => defineStatusBg(status)};
  color: ${white};
  font-size: 9px;
  min-width: 90px;
  border-radius: 5px;

  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: 0.7em;
  }
`;

export const ExpandedTable = styled(Table)`
  @media (max-width: ${desktopWidth}) {
    margin-left: 13px;
    width: 97%;
    float: right;
    .ant-table-tbody tr td > div {
      text-align: right;
      width: 90%;
    }
  }

  .ant-table-thead th {
    display: none;
  }

  .ant-table-tbody tr {
    background-color: ${lightGreySecondary};
  }

  @media (max-width: ${mobileWidth}) {
    display: none;
  }
`;

export const IconExpand = styled(IconDownEmptyArrow)`
  cursor: pointer;
`;
