import styled from "styled-components";
import { Pagination } from "antd";
import { StyledTable as Table } from "../../../../admin/Common/StyledComponents";

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
  &:last-child {
    margin-right: 0;
  }
`;
export const StyledPagination = styled(Pagination)`
  margin-top: 15px;
  align-self: flex-end;
`;
