import styled from "styled-components";
import { StyledTable } from "../../../common/styled";

export const StyledContentAuthorTable = styled(StyledTable)`
  .ant-table-tbody > tr > td {
    text-align: start;
  }
  .ant-table-thead > tr > th.ant-table-selection-column {
    text-align: start;
  }
  .ant-table-tbody > tr > td:last-child a:first-child svg {
    transform: scale(2);
    margin-right: 5px;
  }
`;
