import { IconHeader, IconLogoCompact } from "@edulastic/icons";
import styled from "styled-components";
import { Select, Button as AntdButton, Input, Dropdown, Pagination } from "antd";
import { StyledTable as AntdTable } from "../../../common/styled";
const { Search } = Input;

export const Logo = styled(IconHeader)`
  width: 119px;
  height: 21px;
`;

export const LogoCompact = styled(IconLogoCompact)`
  width: 22px;
  height: 22px;
  margin: 14px 0 9px 19px;
  fill: #0eb08d;
  &:hover {
    fill: #0eb08d;
  }
`;

export const Button = styled.button`
  ${props =>
    props.noStyle &&
    `
    background:none;
    border:none;
    border:0;
    border-radius:0
  `}
  opacity: ${props => (props.disabled ? "0.2" : "1")};
  cursor: pointer;
`;

export const FlexDiv = styled.div`
  display: flex;
`;

export const FlexColumn = styled(FlexDiv)`
  flex-direction: column;
`;

export const MainDiv = styled.div`
  padding: 15px;
  width: 100%;
`;

export const FirstDiv = styled(FlexDiv)`
  margin: 15px;
`;

export const Table = styled(AntdTable)`
  .ant-table table {
    table-layout: fixed;
    word-break: break-word;
  }
`;

export const H2 = styled.h2`
  background-color: #1ab394;
  border-color: #1ab394;
  color: #fff;
  padding: 15px;
`;

export const OuterDiv = styled.div`
  border: 1px solid #1ab394;
  background: #fff;
  margin-bottom: 20px;
`;

// Manage District common components
export const StyledControlDiv = styled.div`
  display: flex;
  margin: 10px 0px;
  .ant-btn-primary {
    color: white;
  }
`;

export const StyledFilterDiv = styled.div`
  display: flex;
  justify-content: space-between;
  background: whitesmoke;
  padding: 1rem;
  align-items: center;
  /* margin-top: 10px; */
`;

export const RightFilterDiv = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledFilterSelect = styled(Select)`
  width: 300px;
  margin-left: 20px;
  &:first-child {
    margin-left: 0;
  }
`;

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

export const StyledTable = styled(AntdTable)`
  .ant-table-row {
    &: hover {
      a {
        opacity: 100;
      }
    }
  }

  .ant-table-body,
  .ant-table-scroll {
    .ant-table-header {
      table {
        thead {
          tr {
            th {
              word-break: break-all;
            }
          }
        }
      }
    }
    table {
      tbody {
        tr {
          td {
            word-break: break-all;
          }
        }
      }
    }
  }
`;
export const StyledAddFilterButton = styled(AntdButton)`
  margin-left: 20px;
`;

export const StyledTableButton = styled.a`
  margin-right: 20px;
  font-size: 20px;
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
export const StyledPagination = styled(Pagination)`
  margin-top: 15px;
  align-self: flex-end;
`;
