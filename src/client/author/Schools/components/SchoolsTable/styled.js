import styled from "styled-components";
import { Button, Table, Select, Input } from "antd";
const Search = Input.Search;

export const StyledTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

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
        display: inline;
      }
    }
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

export const StyledFilterButton = styled(Button)`
  margin-left: 20px;
`;

export const StyledTableButton = styled.a`
  display: none;
  margin-right: 20px;
  font-size: 20px;
  &:last-child {
    margin-right: 0;
  }
`;

export const StyledFilterInput = styled(Input)`
  margin-left: 20px;
  width: 300px;
`;

export const StyledSchoolSearch = styled(Search)`
  margin-left: 20px;
  width: 465px;
`;

export const StyledSelectStatus = styled(Select)`
  margin-left: auto;
  width: 200px;
`;
