import styled from "styled-components";
import { Table, Button } from "antd";
import { testActivity } from "@edulastic/constants";
import {
  mobileWidth,
  tabletWidth,
  red,
  darkGrey,
  lightBlueSecondary,
  lightGreySecondary,
  white,
  authorAssignment,
  greenThird,
  blue
} from "@edulastic/colors";

const { assignmentStatusBg, lightBlue } = authorAssignment;
const {
  authorAssignmentConstants: {
    assignmentStatus: { NOT_OPEN, IN_PROGRESS, IN_GRADING, NOT_GRADED, GRADES_HELD, DONE }
  }
} = testActivity;

const defineStatusBg = status => {
  switch (status) {
    case NOT_OPEN:
      return assignmentStatusBg.NOT_OPEN;
    case IN_PROGRESS:
      return assignmentStatusBg.IN_PROGRESS;
    case IN_GRADING:
      return assignmentStatusBg.IN_GRADING;
    case NOT_GRADED:
      return assignmentStatusBg.NOT_GRADED;
    case GRADES_HELD:
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

  .ant-table-thead > tr {
    th {
      .ant-table-column-sorters {
        display: flex;
        justify-content: center;
      }

      &:first-child {
        text-align: center;
      }

      &:nth-child(2) {
        .ant-table-column-sorters {
          justify-content: flex-start;
        }
      }
    }
  }

  .ant-table-thead > tr > th.ant-table-column-has-actions.ant-table-column-has-sorters {
    padding-right: 0 !important;
  }

  .ant-table-thead th {
    border-bottom: none;

    &:hover {
      background: transparent !important;
    }

    &.assignment-name {
      text-align: left !important;
    }
  }

  tr.ant-table-expanded-row,
  tr.ant-table-expanded-row:hover {
    background: transparent;
  }

  tr.ant-table-expanded-row td > .ant-table-wrapper {
    margin: 0;
  }

  .ant-table-thead > tr > th {
    font-weight: bold;
    font-size: 12px;
    text-transform: uppercase;
    color: ${darkGrey};
    white-space: nowrap;
    padding: 0 !important;
    padding-bottom: 34px !important;
  }

  .ant-table-thead > tr > th > .ant-table-column-has-actions > .ant-table-column-sorters {
    padding: 0;
  }

  .ant-table-tbody {
    .ant-table-expanded-row td {
      padding-left: 0 !important;
      padding-top: 0;
      padding-bottom: 0;
    }

    tr {
    }

    td {
      padding: 8px 0;
      font-weight: 600;

      &:first-child {
        padding-left: 26px;
      }
      &.select-row {
        padding: 0px;
      }
    }
  }

  .ant-table-thead > tr > th.ant-table-column-has-actions.ant-table-column-has-sorters,
  .ant-table-thead > tr > th.ant-table-column-has-actions.ant-table-column-has-filters {
    text-align: center;
  }
  .ant-table-tbody {
    text-align: center;
  }
  .ant-table-tbody > tr > td {
    border-bottom: none;
  }

  .ant-table-thead > tr > th {
    background: transparent;
  }

  .ant-pagination {
    margin-bottom: 0;

    &-item {
      box-shadow: 0px 2px 8px 1px rgba(163, 160, 160, 0.2);
      border: none;
      background: ${white};
      line-height: 35px;

      &-link {
        border: none;
      }

      &-active {
        background: ${lightBlueSecondary};
        box-shadow: none;

        a {
          color: ${white};
        }
      }
    }

    &-prev,
    &-next {
      box-shadow: 0px 2px 8px 1px rgba(163, 160, 160, 0.2);
    }

    &-jump {
      &-next,
      &-prev {
        min-width: 33px;
        height: 33px;
        background: ${white};
        box-shadow: 0px 2px 8px 1px rgba(163, 160, 160, 0.2);
        line-height: 35px;
      }
    }
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
  @media (max-width: 1170px) {
    .ant-table-thead > tr > th {
      font-size: 10px;
    }
    .ant-table-tbody > tr > td {
      font-size: 9px;
    }
  }
  @media (max-width: 1170px) {
    .ant-table-thead > tr > th {
      font-size: 9px;
    }
    .ant-table-tbody > tr > td {
      font-size: 9px;
    }
  }
`;

export const TestThumbnail = styled.img`
  border: 1px solid ${darkGrey};
  border-radius: 5px;
  width: 71px;
  height: 23px;
  margin-right: 9px;
`;

export const AssignmentTD = styled.div`
  text-align: left;
  padding-left: 0px !important;
  padding-right: 0px !important;
  width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const IconArrowDown = styled.img`
  color: ${blue};
  margin-right: 5px;
  width: 6px;
`;

export const BtnAction = styled(Button)`
  color: ${lightBlueSecondary};
  border: none;
  box-shadow: 0px 2px 4px 0 rgba(201, 208, 219, 0.5);
  max-width: 140px;
  height: 28px;
  font-size: 0.7em;
  font-weight: 600;
  width: 100%;
  padding: 0px 20px;
  text-align: center;
  width: 90px;

  :active {
    background-color: ${lightBlueSecondary};
    color: ${white};
  }

  :hover {
    background-color: ${lightBlueSecondary};
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
  background: ${props => (props.type === "practice" ? red : greenThird)};
  text-align: center;
  color: ${white};
  border-radius: 50%;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  padding-left: 1px;
`;

export const ExpandDivdier = styled.div`
  color: ${blue};
  cursor: pointer;
`;

export const BtnStatus = styled(Button)`
  color: ${white};
  border: 0px;
  font-size: 0.7em;
  font-weight: bold;
  width: 90px;
  height: 26px;
  text-align: center;
  border-radius: 8px;
  background-color: ${props => defineStatusBg(props.status)};
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
  padding-right: 7px;
`;

export const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 15px;
  padding: 0;
  width: 80px;
`;

export const GreyFont = styled.div`
  color: grey;
  font-size: 14px;

  position: relative;
  left: ${({ left }) => left || 0}px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  max-width: 150px;

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

  .ant-table-tbody tr td {
    padding: 9px 0px 9px 25px !important;
  }

  @media (max-width: ${mobileWidth}) {
    display: none;
  }
`;

export const IconExpand = styled.div`
  cursor: pointer;
`;
