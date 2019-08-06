import styled from "styled-components";
import { Pagination } from "antd";
import { StyledTable as Table } from "../../../../admin/Common/StyledComponents";

export const StyledTableButton = styled.a`
  margin-right: 20px;
  font-size: 20px;
  opacity: 0;
`;
export const StyledPagination = styled(Pagination)`
  margin-top: 15px;
  align-self: flex-end;
`;

export const StyledTable = styled(Table)``;
