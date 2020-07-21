import styled from "styled-components";
import { Button, Checkbox, Pagination, Icon } from "antd";
import { mainTextColor, grey } from "@edulastic/colors";
import { SelectInputStyled } from "@edulastic/common";
import { StyledTable } from "../../../../common/styled";

export const StyledDropdownBtn = styled(Button)`
  &:hover,
  &:focus {
    color: ${mainTextColor};
  }
`;

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

export const StyledFilterSelect = styled(SelectInputStyled)`
  width: 300px;
  margin-left: 20px;
  &:first-child {
    margin-left: 0;
  }
`;

export const StyledCoursesTable = styled(StyledTable)``;

export const StyledFilterButton = styled(Button)`
  margin-left: 20px;
  font-size: 11px;
  text-transform: uppercase;
`;

export const StyledTableButton = styled.a`
  opacity: 0;
  margin-right: 20px;
  font-size: 20px;
  &:last-child {
    margin-right: 0;
  }
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

export const UserNameContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  border-bottom: 1px ${grey} solid;
  padding-bottom: 4px;
`;

export const UserName = styled.div`
  background: ${grey};
  padding: 2px 8px;
  border-radius: 10px;
  margin-right: 2px;
  margin-bottom: 2px;
`;

export const CreateCourseBtn = styled(Button)`
  text-transform: uppercase;
  font-size: 11px;
`;
