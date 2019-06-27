import styled from "styled-components";
import { Table, Button } from "antd";
import { testActivity } from "@edulastic/constants";
import { red, white, darkGrey, greenThird, secondaryTextColor, authorAssignment, tabletWidth } from "@edulastic/colors";

const { assignmentStatusBg } = authorAssignment;
const {
  authorAssignmentConstants: {
    assignmentStatus: { NOT_OPEN, IN_PROGRESS, IN_GRADING, NOT_GRADED, GRADES_HELD, DONE, SUBMITTED, NOT_STARTED }
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
    case SUBMITTED:
      return assignmentStatusBg.SUBMITTED;
    case NOT_STARTED:
      return assignmentStatusBg.NOT_STARTED;
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
  color: ${secondaryTextColor};
  width: auto;
  .ant-table-thead {
    > tr > th {
      font-weight: bold;
      font-size: 12px;
      text-transform: uppercase;
      color: ${darkGrey};
      white-space: nowrap;
      padding: 0px 16px 24px;
      background: transparent;
      border-bottom: none;
      text-align: center;

      &:first-child {
        text-align: left;
      }

      .ant-table-column-sorter {
        vertical-align: baseline;
      }
    }
  }

  .ant-table-tbody {
    > tr > td {
      padding: 8px 16px;
      font-weight: 600;
      border-bottom: none;
      text-align: center;

      &:first-child {
        text-align: left;
      }
    }
  }

  @media (max-width: ${tabletWidth}) {
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
  text-transform: uppercase;
`;

export const BtnStatus = styled(Button)`
  color: ${white};
  border: 0px;
  font-size: 0.7em;
  font-weight: bold;
  width: 140px;
  height: 26px;
  text-align: center;
  border-radius: 4px;
  background-color: ${props => defineStatusBg(props.status)};
`;

export const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  width: 80px;
`;

export const GreyFont = styled.span`
  color: grey;
  font-size: 14px;
`;
