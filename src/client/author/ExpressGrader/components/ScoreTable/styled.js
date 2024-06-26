import styled from "styled-components";
import { Card, Table, Tag } from "antd";
import { secondaryTextColor, smallDesktopWidth, greenDark, lightGreen, green, title, white } from "@edulastic/colors";

export const StyledCard = styled(Card)`
  margin-bottom: ${({ marginBottom }) => marginBottom || "20px"};
  width: 100%;
  height: auto;
  border-radius: 0px;
  .ant-card-body {
    padding: 0px;
  }
`;

export const TableTitle = styled.div`
  color: ${title};
  font-size: 18px;
  line-height: 30px;
  font-weight: bold;
  @media (max-width: ${smallDesktopWidth}) {
    font-size: 14px;
  }
`;

export const TableData = styled(Table)`
  .ant-table td {
    white-space: nowrap;
  }
  .ant-table-thead > tr:first-child > th:not(:first-child) {
    background-color: #5eb500;
    & .anticon {
      color: #fff;
    }

    & td {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    background: ${white};
    padding: 3px 0px;
    border-bottom: 0px;
    min-width: 105px;
  }
  .ant-table-tbody > tr > td {
    height: 40px;
    background-color: ${white};
  }
  .ant-table-tbody > tr > td > div {
    min-height: 35px;
    padding-top: 7px;
    padding-bottom: 7px;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .ant-table-tbody > tr {
    &:last-child {
      border-bottom: 0px;
    }
  }

  .ant-table-body{
    &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  &:hover {
    cursor: pointer;
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    &::-webkit-scrollbar-thumb {
      background: #888;
    }
  }
  }

  .ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td,
  .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td,
  .ant-table-thead > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td,
  .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
    background: #f2f3f2;
  }

  th.sub-thead-th {
    background-color: ${white} !important;
    text-align: center;
  }
  .ant-table-thead > tr > th.student-names {
    text-align: left;
  }
  .ant-table-thead > tr > th.score-title {
    text-align: left;
  }
  .ant-table-tbody > tr > td.score-title > div {
    font-size: 14px;
  }
  .ant-table-thead > tr > th {
    &:first-child {
      min-width: 200px;
    }
    text-align: center;
    &.main-heading {
      text-align: left;
    }
    .ant-table-column-sorter {
      .ant-table-column-sorter-inner {
        .ant-table-column-sorter-up,
        .ant-table-column-sorter-down {
          font-size: 10px;
        }
      }
    }
  }
`;

export const StyledDivFF = styled.div`
  color: ${greenDark};
  width: 72%;
  padding: 3px 0px;
  text-align: center;
  font-size: 0.9em;
  font-weight: 800;
  margin: auto;
`;

export const StyledDivColor = styled.span`
  color: ${secondaryTextColor};
  width: 72%;
  padding: 3px 0px;
  text-align: center;
  font-size: 0.9em;
  font-weight: 800;
  margin: auto;
`;

export const StyledDivMid = styled.div`
  min-width: 35px;
  font-size: 16px;
  color: #fff;
  font-weight: 600;
  text-align: center;
  img {
    margin-left: 18px;
  }
  &.name-col {
    max-width: 200px;
    font-size: 14px;
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: left;
    padding-left: 0px;
  }
`;

export const StyledDivPartOne = styled.div`
  width: 49.9%;
  display: inline-block;
  font-weight: bold;
  border-right: 0.1em solid ${lightGreen};
`;

export const StyledDivPartTwo = styled.div`
  width: 49.9%;
  display: inline-block;
  color: ${greenDark};
  padding: 3px 0px;
  text-align: right;
  font-size: 1em;
  font-weight: 800;
  margin: auto;
`;

export const StyledTitle = styled.div`
  text-align: center;
  font-size: 0.9em;
  font-weight: bold;
  background-color: #f6f9fd;
  color: ${greenDark};
  font-variant: tabular-nums;
  line-height: 1.5;
`;

export const StyledTag = styled(Tag)`
  background: ${green}33;
  margin: 1px 0;
  border: 0;
`;

export const StyledText = styled.span`
  font-family: Open Sans;
  font-weight: 600;
  font-size: 14px;
  color: ${props => props.color};
`;

const TitleText = styled.div`
  color: #aaafb5;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
`;

export const StudentsTitle = styled(TitleText)``;
export const ScoreTitle = styled(TitleText)``;
