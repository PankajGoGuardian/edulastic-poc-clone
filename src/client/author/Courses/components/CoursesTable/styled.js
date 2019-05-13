import styled from "styled-components";
import { Button, Table, Select, Input, Dropdown, Checkbox } from "antd";
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

export const StyledControlDiv = styled.div`
  display: flex;
  margin-bottom: 20px;
  align-items: center;
`;

export const StyledFilterSelect = styled(Select)`
  width: 300px;
  margin-left: 20px;
  &:first-child {
    margin-left: 0;
  }
`;

export const StyledTable = styled(Table)``;

export const StyledFilterButton = styled(Button)`
  margin-left: 20px;
`;

export const StyledTableButton = styled.a`
  margin-right: 20px;
  font-size: 20px;
`;

export const StyledFilterInput = styled(Input)`
  margin-left: 20px;
  width: 300px;
`;

export const StyledNameSearch = styled(Input)`
  margin-left: 20px;
  width: 465px;
`;

export const StyledActionDropDown = styled(Dropdown)`
  margin-left: 20px;
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StyledActiveCheckbox = styled(Checkbox)`
  margin-left: auto;
`;
