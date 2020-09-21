import { extraDesktopWidthMax, lightGrey, mobileWidthMax } from "@edulastic/colors";
import { IconLogoCompact } from "@edulastic/icons";
import { Button as AntdButton, Dropdown, Input, Layout, Pagination, Select, Spin } from "antd";
import styled from "styled-components";
import { StyledTable as AntdTable } from "../../../common/styled";

const { Search } = Input;
const { Content } = Layout;

export const LogoCompact = styled(IconLogoCompact)`
  width: 22px;
  height: 22px;
  margin: ${props => props.margin || "14px 0 9px 19px"};
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
  background: ${props => props.theme.manageDistrict.searchDivBgColor};
  padding: 1.5rem;
  align-items: center;
  margin-bottom: 10px;
  border-radius: ${props => props.theme.manageDistrict.searchDivBorderRadius};
  box-shadow: ${props => props.theme.manageDistrict.searchDivBoxShadow};
  @media (max-width: ${mobileWidthMax}) {
    flex-direction: column;
  }
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
  .ant-select-selection {
    background: ${lightGrey};
    border: 1px solid #e1e1e1;
  }
`;

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
              padding: 10px;
              min-width: 75px;
            }
            @media only screen and (min-width: 1px) and (max-width: 600px) {
              th {
                padding: 10px;
                font-size: 8px;
              }
            }

            @media only screen and (min-width: 601px) and (max-width: 767px) {
              th {
                padding: 10px;
                font-size: 9px;
              }
            }

            @media only screen and (min-width: 768px) and (max-width: 991px) {
              th {
                padding: 10px;
                font-size: 10px;
              }
            }

            @media only screen and (min-width: 992px) and (max-width: 1199px) {
              th {
                padding: 10px;
                font-size: 11px;
              }
            }

            @media only screen and (min-width: 1200px) {
              th {
                padding: 10px;
                font-size: 12px;
              }
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
            min-width: 75px;
          }
        }
      }
    }
  }
`;
export const StyledAddFilterButton = styled(AntdButton)`
  margin-left: 20px;
  font-size: ${props => props.theme.manageDistrict.filterButtonFontSize};
  font-weight: ${props => props.theme.manageDistrict.filterButtonFontWeight};
  background: ${props => props.theme.manageDistrict.filterButtonBgColor};
  color: ${props => props.theme.manageDistrict.filterButtonTextColor};
  text-transform: uppercase;
`;

export const StyledTableButton = styled.a``;

export const StyledFilterInput = styled(Search)`
  margin-left: 20px;
  width: 300px;
`;
export const StyledSchoolSearch = styled(Search)`
  margin-left: 20px;
  width: 350px;
`;
export const StyledActionDropDown = styled(Dropdown)`
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

export const MainWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

export const StyledContent = styled(Content)`
  width: 80%;
  padding-left: 20px;
  padding-right: 20px;
  margin: 80px 20px 20px 20px;
  @media screen and (min-width: ${extraDesktopWidthMax}) {
    margin-top: 100px;
  }
`;

export const StyledLayout = styled(Layout)`
  position: relative;
  display: flex;
  flex-direction: column;
  pointer-events: ${props => (props.loading === "true" ? "none" : "auto")};
  min-height: 400px;
  background: transparent;
`;

export const SpinContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 999;
  background-color: ${props => (props.blur ? "rgb(255, 255, 255, 0.7)" : "transparent")};
`;

export const StyledSpin = styled(Spin)`
  position: absolute;
  left: 50%;
  top: 35%;
  transform: translate(-50%, -50%);
`;
