import styled from "styled-components";
import { StyledTable } from "../../../common/styled";

export const StyledContentAuthorTable = styled(StyledTable)`
  .ant-table-tbody > tr > td {
    text-align: start;
  }
  .ant-table-thead > tr > th.ant-table-selection-column {
    text-align: start;
  }
`;
