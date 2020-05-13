import { fadedBlack } from "@edulastic/colors";
import { EduButton } from "@edulastic/common";
import { ResponsiveContainer } from "recharts";
import styled from "styled-components";
import { StyledTable as Table } from "../../../../common/styled";

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
            &:nth-child(-n + 4) {
              white-space: nowrap;
            }
          }
        }
      }

      tbody {
        tr {
          td:nth-last-child(-n + ${props => props.colouredCellsNo}) {
            padding: 0px;
            div {
              display: flex;
              justify-content: center;
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
