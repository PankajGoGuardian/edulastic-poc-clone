import styled from "styled-components";
import { Table, Button } from "antd";
import { testActivity } from "@edulastic/constants";
import {
  mobileWidth,
  tabletWidth,
  smallDesktopWidth,
  darkGrey,
  lightGreySecondary,
  white,
  authorAssignment,
  themeColor,
  title,
  testTypeColor
} from "@edulastic/colors";

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
  @media (max-width: 1300px) {
    width: 18px;
    height: 18px;
  }
  @media (max-width: 920px) {
    width: 15px;
    height: 15px;
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
    .ant-table-thead > tr {
      & > th {
        background: ${white};
        padding: 10px 15px 20px;
        border-bottom: none;
        font-weight: bold;
        font-size: 12px;
        text-transform: uppercase;
        color: ${darkGrey};
        white-space: nowrap;
        text-align: center;

        @media (max-width: ${smallDesktopWidth}) {
          font-size: 10px;
        }

        &.assignment-name {
          text-align: left !important;
          padding-left: 0;
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
                font-size: 10px;
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
      background: ${themeColor}15;
    }
    .ant-table-expanded-row > td {
      text-align: center;
      padding: 0px 0px 10px;
    }

    td {
      padding: 8px 0;
      font-weight: 600;

      &.ant-table-selection-column {
        padding: 10px 15px;
      }
    }
  }

  .ant-table-tbody > tr > td {
    border-bottom: none;
  }

  .ant-pagination {
    margin-bottom: 0;
    position: absolute;
    right: 15px;
    bottom: 15px;
    top: auto;
  }

  @media (max-width: ${tabletWidth}) {
    display: none;
  }
  .ant-table-row-expand-icon {
    display: none;
  }
  @media (max-width: 1300px) and (min-width: 980px) {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      max-width: 100px;
    }
    .ant-table-thead > tr > th .ant-table-column-sorters {
      padding-left: 0px;
      padding-right: 0px;
    }
  }
  @media (max-width: ${smallDesktopWidth}) {
    .ant-table-thead > tr > th {
      font-size: 10px;
    }
    .ant-table-tbody > tr > td {
      font-size: 11px;
    }
  }
`;

export const TestThumbnail = styled.img`
  border-radius: 4px;
  width: 50px;
  height: 24px;
  @media (max-width: ${smallDesktopWidth}) {
    width: 32px;
  }
`;

export const AssignmentTD = styled.div`
  text-align: left;
  padding-left: 0px !important;
  padding-right: 0px !important;
  width: ${({ showFilter }) => (showFilter ? "94px" : "150px")};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  font-size: 11px;
  font-weight: 600;
  width: 100%;
  padding: 0px 20px;
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
  display: inline-block;
  width: 18px;
  height: 18px;
  max-width: 18px;
  background: ${props =>
    props.type === "p" ? testTypeColor.practice : props.type === "c" ? testTypeColor.common : testTypeColor.assessment};
  text-align: center;
  color: ${white};
  border-radius: 50%;
  font-weight: 600;
  font-size: 13px;
  line-height: 17px;
  padding-left: 1px;
`;

export const ExpandDivdier = styled.div`
  color: ${themeColor};
  cursor: pointer;
  font-size: 14px;
`;

export const BtnStatus = styled(Button)`
  color: ${white};
  border: 0px;
  font-size: 0.7em;
  font-weight: bold;
  min-width: 90px;
  height: 26px;
  text-align: center;
  border-radius: 5px;
  background-color: ${props => defineStatusBg(props.status)};

  @media (max-width: ${smallDesktopWidth}) {
    height: 20px;
    line-height: 20px;
    font-size: 9px;
  }
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
  color: ${title};
  font-size: 13px;
  position: relative;
  left: ${({ left }) => left || 0}px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  &.class-column {
    white-space: initial;
  }

  @media (max-width: ${smallDesktopWidth}) {
    font-size: 11px;
  }
`;

export const ExpandedTable = styled(Table)`
  @media (max-width: 980px) {
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

export const IconExpand = styled.div`
  cursor: pointer;
`;
