import styled from "styled-components";
import { StyledTable as Table } from "../../../../common/styled";
import { Col } from "antd";
import { themeColor, themeColorLight } from "@edulastic/colors";

export const UpperContainer = styled.div`
  .dropdown-container {
    text-align: left;
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
  }
`;

export const TableContainer = styled.div`
  .control-dropdown-row {
    display: flex;
    justify-content: flex-end;
  }
`;

export const StyledTable = styled(Table)`
  .ant-table-body {
    table {
      thead {
        tr {
          th {
            text-align: left;
          }
          th:nth-child(2) {
            text-align: center;
          }
        }
      }

      tbody {
        tr {
          td:nth-child(1) {
            text-align: left;
          }

          td:nth-child(2) {
            text-align: center;
          }

          td:nth-child(n + 3) {
            padding: 0;
            div {
              height: 100%;
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 10px;
            }
          }
        }
      }
    }
  }
`;

export const StyledDropDownContainer = styled(Col)`
  .ant-btn.ant-dropdown-trigger {
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
    text-overflow: ellipsis;
    width: 100%;
    margin-bottom: 25px;
  }
`;

export const OnClick = styled.span`
  cursor: pointer;
  font-weight: 400;
  &:hover {
    font-weight: 700;
  }
`;
