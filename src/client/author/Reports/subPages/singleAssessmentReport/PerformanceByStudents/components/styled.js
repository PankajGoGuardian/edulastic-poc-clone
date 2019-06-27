import styled from "styled-components";
import { fadedBlack } from "@edulastic/colors";
import { StyledTable as Table } from "../../../../common/styled";
import { ResponsiveContainer } from "recharts";

export const NonSelectableResponsiveContainer = styled(ResponsiveContainer)`
  .recharts-surface {
    user-select: none;
  }
`;

export const UpperContainer = styled.div`
  .dropdown-container {
    text-align: left;
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
  }
`;

export const StyledDropDownContainer = styled.div`
  .control-dropdown {
    margin-bottom: 15px;
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

          th:nth-last-child(-n + ${props => props.rightAligned || 0}) {
            text-align: right;
          }
        }
      }

      tbody {
        tr {
          td:nth-last-child(-n + ${props => props.colouredCellsNo + 2}) {
            text-align: right;
          }
          td:nth-last-child(-n + ${props => props.rightAligned || 0}) {
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
