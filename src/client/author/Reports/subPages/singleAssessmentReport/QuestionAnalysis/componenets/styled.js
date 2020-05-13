import styled from "styled-components";
import {} from "@edulastic/colors";
import { StyledTable as Table, StyledCard as Card } from "../../../../common/styled";

export const StyledCard = styled(Card)``;

export const StyledTable = styled(Table)`
  .ant-table-body {
    table {
      thead {
        tr th {
          white-space: nowrap;
        }
      }

      tbody {
        tr {
          td:nth-child(n + ${props => props.colorCellStart}) {
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
export const StyledP = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #7c848e;
  text-align: center;
`;
