import styled from "styled-components";
import { StyledTable as Table } from "../../../../admin/Common/StyledComponents";

export const StyledTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;

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
      button#onHoverVisible {
        opacity: 100;
      }
    }
  }
`;
