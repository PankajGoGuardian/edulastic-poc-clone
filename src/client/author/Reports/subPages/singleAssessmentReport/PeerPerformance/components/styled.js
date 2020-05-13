import styled from "styled-components";
import { fadedBlack } from "@edulastic/colors";
import { StyledTable as Table } from "../../../../common/styled";
import { FilterDropDownWithDropDown } from "../../../../common/components/widgets/filterDropDownWithDropDown";

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
          }
        }
      }

      tbody {
        tr {
          td {
            &:nth-last-child(-n + ${props => props.colouredCellsNo}) {
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
  }
`;
