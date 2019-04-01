import styled from "styled-components";
import { Row, Col } from "antd";
import {
  StyledFilterDropDownWithDropDown as FilterDropDownWithDropDown,
  StyledTable as Table
} from "../../../common/styled";
import { CustomTableTooltip } from "../../../common/components/customTableTooltip";

export const UpperContainer = styled.div`
  .dropdown-container {
    text-align: left;
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
  }
`;

export const TableContainer = styled.div`
  .pad-0-2 {
    table {
      tbody {
        tr {
          td:nth-last-child(-n + 2) {
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

  .pad-0-3 {
    table {
      tbody {
        tr {
          td:nth-last-child(-n + 2) {
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

export const StyledFilterDropDownWithDropDown = styled(FilterDropDownWithDropDown)`
  button {
  }
`;

export const StyledTable = styled(Table)`
  .ant-table-body {
    table {
      thead {
        tr {
          th:nth-last-child(-n + 4) {
            text-align: right;
          }
        }
      }

      tbody {
        tr {
          td:nth-last-child(-n + 4) {
            text-align: right;
          }
        }
      }
    }
  }
`;
