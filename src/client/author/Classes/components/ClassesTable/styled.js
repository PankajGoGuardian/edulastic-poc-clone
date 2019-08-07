import styled from "styled-components";
import { Button, Select, Input, Dropdown, Pagination, Icon } from "antd";
import { StyledTable as Table } from "../../../../admin/Common/StyledComponents";

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
