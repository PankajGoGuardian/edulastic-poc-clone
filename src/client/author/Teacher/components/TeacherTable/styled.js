import styled from "styled-components";
import { Button, Select, Input, Dropdown, Pagination } from "antd";
import { StyledTable as Table } from "../../../../common/styled";

const Search = Input.Search;

export const StyledTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 140px;

  .ant-table-wrapper {
    width: 100%;
  }

  input {
    border: 1px solid #d9d9d9;
  }
`;

export const StyledControlDiv = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

export const StyledFilterSelect = styled(Select)`
  width: 300px;
  margin-left: 20px;
  &:first-child {
    margin-left: 0;
  }
`;
export const StyledFilterDiv = styled.div`
  display: flex;
  background: whitesmoke;
  padding: 1rem;
  align-items: center;
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

export const StyledPagination = styled(Pagination)`
  margin-top: 15px;
  align-self: flex-end;
`;

export const StyledAddFilterButton = styled(Button)`
  margin-left: 20px;
`;

export const StyledTableButton = styled.a`
  margin-right: 20px;
  font-size: 20px;
  opacity: 0;
`;

export const StyledFilterInput = styled(Search)`
  margin-left: 20px;
  width: 300px;
`;

export const StyledSchoolSearch = styled(Search)`
  margin-left: 20px;
  width: 465px;
`;

export const StyledActionDropDown = styled(Dropdown)`
  margin-left: auto;
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StyledClassName = styled.p`
  text-align: center;
  color: #1890ff;
  font-weight: bold;
  margin-bottom: 5px;
`;
