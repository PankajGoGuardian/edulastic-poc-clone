import styled from "styled-components";
import { Row, Col } from "antd";
import { fadedBlack } from "@edulastic/colors";
import {
  StyledFilterDropDownWithDropDown as FilterDropDownWithDropDown,
  StyledTable as Table
} from "../../../../common/styled";
import { CustomTableTooltip } from "../../../../common/components/customTableTooltip";

export const UpperContainer = styled.div`
  .dropdown-container {
    text-align: left;
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
  }
`;

export const TableContainer = styled.div``;

export const StyledFilterDropDownWithDropDown = styled(FilterDropDownWithDropDown)`
  button {
  }
`;

export const StyledTable = styled(Table)`
  .ant-table-body {
    table {
      thead {
        tr {
          th {
            white-space: nowrap;
            color: ${fadedBlack};
          }
          th:nth-last-child(-n + ${props => props.colouredCellsNo + 2}) {
            text-align: right;
          }
        }
      }

      tbody {
        tr {
          td:nth-last-child(-n + ${props => props.colouredCellsNo + 2}) {
            text-align: right;
          }
          td:nth-last-child(-n + ${props => props.colouredCellsNo}) {
            padding: 0px;
            div {
              height: 100%;
              width: 100%;
              padding: 10px;
            }
          }
        }
      }
    }
  }
`;
