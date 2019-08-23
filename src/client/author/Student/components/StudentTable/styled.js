import styled from "styled-components";
import { Pagination } from "antd";
import { StyledTable as Table } from "../../../../admin/Common/StyledComponents";

export const StyledTable = styled(Table)`
  .ant-table {
    &-row:hover {
      a {
        visibility: visible;
      }
    }
    &-tbody,
    &-thead {
      & > tr :nth-last-of-type(-n + 2) {
        text-align: end;
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
