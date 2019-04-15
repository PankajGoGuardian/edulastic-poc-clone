import styled from "styled-components";
import { Button, Table, Select, Input, Modal, Form } from "antd";
const Search = Input.Search;

export const StyledTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  th {
    border: none !important;
  }

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

export const StyledTable = styled(Table)``;

export const StyledButton = styled(Button)`
  background-color: #409aff;
  border: 2px solid #409aff;
  color: #fff;
  &:hover {
    background-color: #fff;
    color: #409aff;
  }
`;

export const StyledAddFilterButton = styled(StyledButton)`
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

export const StyledCreateSchoolButton = styled(StyledButton)``;

export const StyledSchoolSearch = styled(Search)`
  margin-left: 20px;
  width: 465px;
`;

export const StyledSelectStatus = styled(Select)`
  margin-left: auto;
  width: 200px;
`;

export const StyledSelectedSchoolSelect = styled(Select)`
  width: 100%;
`;
