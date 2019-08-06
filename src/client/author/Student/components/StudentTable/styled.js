import styled from "styled-components";
import { Table, Pagination } from "antd";

export const StyledTable = styled(Table)`
  .ant-table-row {
    &: hover {
      a {
        visibility: visible;
      }
    }
  }
`;

export const StyledTableButton = styled.a`
  visibility: hidden;
  margin-right: 20px;
  font-size: 20px;
`;
export const StyledPagination = styled(Pagination)`
  margin-top: 15px;
  align-self: flex-end;
`;
