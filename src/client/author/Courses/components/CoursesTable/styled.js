import styled from "styled-components";
import { Button, Table, Select, Input, Dropdown, Checkbox, Pagination, Icon } from "antd";
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

export const StyledTable = styled(Table)`
  .ant-table-row {
    &: hover {
      a {
        opacity: 100;
      }
    }
  }
  .ant-table {
    &-tbody,
    &-thead {
      & > tr :nth-last-of-type(-n + 2) {
        text-align: end;
      }
    }
  }
`;

export const StyledFilterButton = styled(Button)`
  margin-left: 20px;
`;

export const StyledTableButton = styled.a`
  opacity: 0;
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

export const StyledNameSearch = styled(Search)`
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

export const StyledPagination = styled(Pagination)`
  align-self: flex-end;
  margin-top: 15px;
`;

export const StyledHeaderColumn = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const StyledSortIconDiv = styled.div`
  position: relative;
  margin-left: 8px;
  display: inline-block;
  vertical-align: middle;
  text-align: center;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.45);
`;

export const StyledSortIcon = styled(Icon)`
  display: block;
  height: 6px;
  line-height: 0.5em;
  cursor: pointer;
  position: relative;
  font-size: 11px;
  margin-top: 0.125em;
  color: ${props => (props.colorValue ? "#1890ff" : "#bfbfbf")};
`;
