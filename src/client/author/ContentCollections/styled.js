import styled from "styled-components";
import { Table, Input, Tabs } from "antd";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  white,
  themeColor,
  darkGrey1,
  placeholderGray,
  backgrounds,
  smallDesktopWidth,
  largeDesktopWidth,
  extraDesktopWidth,
  themeColorLight,
  red
} from "@edulastic/colors";

export const CollectionTableContainer = styled.div`
  width: ${({ isCollectionSelected }) => (isCollectionSelected ? "35%" : "100%")};
  margin-right: ${({ isCollectionSelected }) => (isCollectionSelected ? "10px" : "0px")};
  background-color: ${white};
  border-radius: 8px;
  padding: 20px;
  @media (max-width: ${smallDesktopWidth}) {
    width: 100%;
    margin-right: 0px;
    margin-bottom: 20px;
  }
`;

export const HeadingContainer = styled.div`
  height: 40px;
  margin-bottom: 10px;
  display: flex;
  > div {
    width: 50%;
    display: inline-block;
  }
`;

export const TableHeading = styled.span`
  font-size: ${props => props.theme.headerTitle};
  font-weight: ${props => props.theme.bold};
  height: 40px;
  display: inline-block;
  line-height: 40px;
`;

export const PermissionsButton = styled.span`
  color: ${themeColor};
  border: 1px solid ${themeColor};
  border-radius: 4px;
  display: inline-block;
  width: 120px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  text-transform: uppercase;
  font-size: ${props => props.theme.commentFontSize};
  cursor: pointer;
  transition: all 0.3s ease-in;
  margin-right: 10px;
  &:hover {
    background-color: ${themeColor};
    color: ${white};
    span {
      display: none;
    }
    &:before {
      content: "Add Permissions";
    }
  }

  @media (max-width: ${smallDesktopWidth}) {
    width: 105px;
    margin-right: 5px;
  }
`;

export const StyledTable = styled(Table)`
  .ant-table-content {
    .ant-table-body {
      th,
      td {
        font-weight: ${props => props.theme.semiBold};
      }
      .ant-table-thead {
        > tr {
          > th {
            background: ${white};
            color: ${darkGrey1};
            text-transform: uppercase;
            border-bottom: 2px solid ${white};
            font-size: ${props => props.theme.bodyFontSize};
          }
        }
      }
      .ant-table-tbody {
        > tr {
          > td {
            padding: 8px 16px;
            font-size: ${props => props.theme.standardFont};
            &:last-child {
              padding: 0px;
            }
          }
        }
      }
    }
  }
`;

export const AddCollectionButton = styled.span`
  background: ${themeColor};
  color: ${white};
  border-radius: 4px;
  display: inline-block;
  width: 150px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  text-transform: uppercase;
  font-size: ${props => props.theme.commentFontSize};
  cursor: pointer;
  font-weight: ${props => props.theme.semiBold};
  margin-left: 20px;
`;

export const ImportButton = styled(AddCollectionButton)`
  background: transparent;
  color: ${themeColor};
  border: 1px solid ${themeColor};
  margin-top: 0px;
  margin-left: 0px;
  width: 170px;
  height: 30px;
  line-height: 30px;
  transition: all 0.3s ease-in;
  i {
    font-size: ${props => props.theme.questionTextlargeFontSize};
    margin-right: 10px;
  }
  &:hover {
    color: ${white};
    background: ${themeColor};
  }
`;

export const StyledSearch = styled(Input.Search)`
  height: 40px;
  input {
    padding-left: 15px;
    background: ${backgrounds.primary};
    border-radius: 2px;
    &:placeholder {
      color: ${placeholderGray};
    }
    &:focus,
    &:active,
    &:hover {
      & + span {
        svg {
          fill: ${themeColor};
        }
      }
    }
  }
`;

export const BackArrowButton = styled.span`
  cursor: pointer;
  font-size: ${props => props.theme.questionTexthugeFontSize};
  svg {
    fill: ${themeColor};
  }
`;

export const TablesWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: ${smallDesktopWidth}) {
    flex-wrap: wrap;
  }
`;

export const PermissionTableContainer = styled(CollectionTableContainer)`
  padding-top: 5px;
  width: 65%;
  .heading-container {
    > div:nth-child(odd) {
      width: 25%;
    }
    > div:nth-child(even) {
      width: 50%;
      margin-right: 10px;
    }
  }
  @media (max-width: ${smallDesktopWidth}) {
    width: 100%;
  }
`;

export const AddPermissionButton = styled(ImportButton)`
  height: 40px;
  line-height: 40px;
  float: right;
  margin-left: 0px;
`;

export const StyledTab = styled(Tabs)`
  .ant-tabs-bar {
    border-bottom: 0px;
    .ant-tabs-tab {
      font-size: ${props => props.theme.smallFontSize};
      font-weight: ${props => props.theme.semiBold};
      padding-top: 20px;
      padding-bottom: 20px;
    }
  }
`;

export const CollectionSearchHeader = styled.div`
  display: flex;
  padding: 30px;
  background: white;
  margin-bottom: 20px;
  border-radius: 8px;
`;

export const StatusText = styled.span`
  font-size: ${props => props.theme.tagFontSize};
  text-transform: uppercase;
  color: ${({ color }) => (color === "red" ? red : themeColorLight)};
`;

export const StyledScollBar = styled(PerfectScrollbar)`
  max-height: ${({ table }) => (table === "collectionTable" ? "530px" : "475px")};
  margin-right: -15px;
  padding-right: 15px;
  @media (max-width: ${extraDesktopWidth}) {
    max-height: ${({ table }) => (table === "collectionTable" ? "400px" : "360px")};
  }
  @media (max-width: ${largeDesktopWidth}) {
    max-height: ${({ table }) => (table === "collectionTable" ? "300px" : "260px")};
  }
  @media (max-width: ${smallDesktopWidth}) {
    max-height: ${({ table }) => (table === "collectionTable" ? "270px" : "250px")};
  }
`;
