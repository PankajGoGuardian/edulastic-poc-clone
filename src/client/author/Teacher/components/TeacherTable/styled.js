import styled from "styled-components";
import { Table, Pagination } from "antd";

export const StyledTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 130px;

  .ant-table-wrapper {
    width: 100%;
  }

  input {
    border: 1px solid #d9d9d9;
  }
`;
export const StyledTable = styled(Table)`
  .ant-table-row {
    &: hover {
      a {
        opacity: 100;
      }
    }
  }
`;
export const StyledTableButton = styled.a`
  margin-right: 20px;
  font-size: 20px;
  opacity: 0;
`;
export const StyledPagination = styled(Pagination)`
  margin-top: 15px;
  align-self: flex-end;
`;
