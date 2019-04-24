import styled from "styled-components";
import { Row, Col } from "antd";
import { fadedBlack } from "@edulastic/colors";
import { StyledTable as Table } from "../../../../common/styled";
import { FilterDropDownWithDropDown } from "../../../../common/components/widgets/filterDropDownWithDropDown";
import { CustomTableTooltip } from "../../../../common/components/customTableTooltip";
import { StyledCard as Card } from "../../../../common/styled";

export const StyledCard = styled(Card)`
  .recharts-default-legend {
    .recharts-legend-item {
      &:nth-child(1) {
        padding-left: 90px;
      }
    }
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
