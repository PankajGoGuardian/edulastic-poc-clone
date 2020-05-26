import { Table } from "antd";
import styled from "styled-components";

import { extraDesktopWidth, largeDesktopWidth, tabletWidth } from "@edulastic/colors";

const StyledTable = styled(Table)`
  .ant-table table {
    border-collapse: separate;
    border-spacing: 0px 20px;

    @media (max-width: ${largeDesktopWidth}) {
      border-spacing: 0px 10px;
    }

    @media screen and (max-width: ${tabletWidth}) {
      display: block;
      overflow-x: auto;
      margin-top: 10px;
    }
  }

  .ant-table-thead {
    border-spacing: 0;

    > tr {
      background: transparent;

      > th {
        background: ${props => props.theme.skillReport.tableHeaderBgColor};
        font-weight: 700;
        color: ${props => props.theme.skillReport.tableHeaderTextColor};
        text-transform: uppercase;
        border: 0;
        font-size: 10px;
        padding: 0 16px;

        &:not(:first-child) {
          text-align: center;
        }

        &.ant-table-column-has-actions.ant-table-column-has-sorters:hover {
          background: transparent;
        }

        .ant-table-header-column .ant-table-column-sorters::before {
          display: none;
        }

        .ant-table-column-sorter .ant-table-column-sorter-inner-full {
          margin-top: -1px;
          margin-left: 5px;
        }

        .ant-table-column-sorter .ant-table-column-sorter-inner .ant-table-column-sorter-up,
        .ant-table-column-sorter .ant-table-column-sorter-inner .ant-table-column-sorter-down {
          font-size: 8px;
        }

        @media (min-width: ${largeDesktopWidth}) {
          font-size: 11px;
        }
        @media (min-width: ${extraDesktopWidth}) {
          font-size: ${props => props.theme.skillReport.tableHeaderTextSize};
          padding: 0 26px 15px;
        }
        @media screen and (max-width: ${tabletWidth}) {
          word-break: unset;
        }
      }
    }
  }

  .ant-table-tbody > tr > td {
    &:not(:first-child) {
      text-align: center;
    }
  }

  .ant-table-row {
    font-size: ${props => props.theme.skillReport.tableDataFontSize};

    td {
      background: ${props => props.theme.skillReport.tableDataBgColor} !important;
      color: ${props => props.theme.skillReport.tableDataTextColor};
      border: 0;
      padding: 13px 26px;
      font-size: 11px;

      @media (min-width: ${largeDesktopWidth}) {
        font-size: 12px;
      }
      @media (min-width: ${extraDesktopWidth}) {
        font-size: 14px;
      }
      @media screen and (max-width: ${tabletWidth}) {
        word-break: unset;
      }
    }
  }
`;

export default StyledTable;
