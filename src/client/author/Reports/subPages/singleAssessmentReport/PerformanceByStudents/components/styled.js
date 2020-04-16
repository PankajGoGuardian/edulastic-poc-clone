import styled from "styled-components";
import { fadedBlack } from "@edulastic/colors";
import { ResponsiveContainer } from "recharts";
import { StyledTable as Table } from "../../../../common/styled";
import { EduButton } from "@edulastic/common";

export const NonSelectableResponsiveContainer = styled(ResponsiveContainer)`
  align-self: center;
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
  padding: ${props => props.padding || "0px"};
  button {
    margin-bottom: 15px;
  }
`;
export const StyledTable = styled(Table)`
  .ant-table-body {
    .ant-checkbox {
      .ant-checkbox-inner {
        border-collapse: collapse;
      }
    }
    table {
      thead {
        tr {
          th {
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
            div {
              display: flex;
              justify-content: flex-end;
              align-items: center;
              height: 100%;
              width: 100%;
            }
          }
        }
      }
      td .assessmentDate {
        white-space: nowrap;
      }
    }
  }
`;

export const StyledChartNavButton = styled(EduButton)`
  position: absolute;
  height: 50px;
  width: 50px;
  border-radius: 25px;
`;
