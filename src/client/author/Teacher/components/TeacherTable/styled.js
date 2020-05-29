import styled from "styled-components";
import { StyledTable } from "../../../../common/styled";

export const StyledTeacherTable = styled(StyledTable)`
  .ant-table-tbody > tr > td:last-child a:first-child svg {
    transform: scale(2);
    margin-right: 5px;
  }
`;
