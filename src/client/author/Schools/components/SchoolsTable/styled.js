import styled from "styled-components";
import { Button, Select, Input, Icon, Pagination, Dropdown } from "antd";
import { StyledTable as Table } from "../../../../common/styled";
const Search = Input.Search;

export const StyledTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 20px;

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
  .ant-table {
    table-layout: fixed;
    &-tbody,
    &-thead {
      & > tr :nth-last-of-type(-n + 4) {
        text-align: end;
      }
    }

    .ant-table-thead,
    .ant-table-tbody {
      tr {
      }
    }
  }
`;

export const StyledFilterDiv = styled.div`
  display: flex;
  background: whitesmoke;
  padding: 1rem;
  align-items: center;
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
  opacity: 0;
  margin-right: 20px;
  font-size: 20px;
  &:last-child {
    margin-right: 0;
  }
`;

export const StyledFilterInput = styled(Input.Search)`
  margin-left: 20px;
  width: 300px;
`;

export const StyledSchoolSearch = styled(Search)`
  margin-left: 20px;
  width: 465px;
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

export const StyledPagination = styled(Pagination)`
  align-self: flex-end;
  margin-top: 15px;
`;

export const StyledActionDropDown = styled(Dropdown)`
  margin-left: auto;
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
