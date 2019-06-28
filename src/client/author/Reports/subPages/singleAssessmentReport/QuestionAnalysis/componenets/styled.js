import styled from "styled-components";
import { Row, Col } from "antd";
import {} from "@edulastic/colors";
import { StyledTable as Table } from "../../../../common/styled";
import { StyledCard as Card } from "../../../../common/styled";

export const StyledCard = styled(Card)``;

export const StyledTable = styled(Table)`
  .ant-table-body {
    table {
      thead {
        tr {
          th:nth-child(n + 3) {
            text-align: right;
          }
        }
      }

      tbody {
        tr {
          td:nth-child(n + 3) {
            text-align: right;
            padding: 10px;
          }
          td:nth-child(n + 6) {
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

export const UpperContainer = styled.div``;

export const TableContainer = styled.div`
  .parent-row {
    flex-direction: column;
    .top-row-container {
      .top-row {
        min-height: 50px;
      }
    }
    .bottom-table-container {
      width: 100%;
    }
  }
`;
