import styled from "styled-components";
import { Button, Table, Select, Input, Dropdown, Pagination, Icon } from "antd";

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
        visibility: visible;
      }
    }
  }
`;

export const StyledAddFilterButton = styled(Button)`
  margin-left: 20px;
  visibility: ${props => (props ? "hidden" : "visible")};
`;

export const StyledTableButton = styled.a`
  margin-right: 20px;
  font-size: 20px;
  visibility: hidden;
  &:last-child {
    margin-right: 0;
  }
`;

export const StyledFilterInput = styled(Input.Search)`
  margin-left: 20px;
  width: 300px;
`;

export const StyledSearch = styled(Input.Search)`
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

export const TeacherSpan = styled.span`
  margin-right: 10px;

  &:not(:last-child):after {
    content: ",";
  }
`;

export const StyledPagination = styled(Pagination)`
  margin-top: 15px;
  align-self: flex-end;
`;

export const StyledFilterButton = styled(Button)`
  margin-left: 20px;
`;

export const StyledHeaderColumn = styled.div`
  display: flex;
  align-item: center;
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

export const StyledClassName = styled.p`
  text-align: center;
  color: #1890ff;
  font-weight: bold;
  margin-bottom: 5px;
`;
