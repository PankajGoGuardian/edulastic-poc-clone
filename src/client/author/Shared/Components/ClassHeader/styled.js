import { Popconfirm, Switch, Button, Menu } from "antd";
import styled, { css } from "styled-components";
import {
  white,
  mobileWidth,
  mediumDesktopWidth,
  extraDesktopWidth,
  themeColor,
  fadedBlue,
  tabletWidth,
  largeDesktopWidth,
  smallDesktopWidth,
  mobileWidthMax
} from "@edulastic/colors";
import { Link } from "react-router-dom";
import { themes } from "../../../../student/themes";
import { StyledTable as Table } from "../../../Reports/common/styled";

const classBoardTheme = themes.default.classboard;

export const RightSideButtonWrapper = styled.div`
  height: 45px;
  display: flex;
  margin-left: auto;

  @media (max-width: ${mediumDesktopWidth}) {
    height: 36px;
  }
  @media (max-width: ${mobileWidthMax}) {
    order: 2;
  }
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.theme.header.headerBgColor};
  height: 96px;
  z-index: 1;
  padding: 0px 30px;
  &:hover {
    background-color: darken(${props => props.theme.header.headerBgColor}, 10%);
  }

  @media (max-width: ${mediumDesktopWidth}) {
    height: 60px;
  }
  @media (max-width: ${mobileWidthMax}) {
    height: auto;
    padding: 10px 20px 15px;
    flex-wrap: wrap;
    border-radius: 0px;
  }
`;

export const StyledTitle = styled.h1`
  color: ${white};
  font-size: 22px;
  font-weight: bold;
  margin: 20px 0;
  padding: 0;

  @media (max-width: ${mediumDesktopWidth}) {
    font-size: 18px;
    margin: 0px;
  }
  @media (max-width: ${tabletWidth}) {
    display: flex;
    align-items: center;
  }
  @media (max-width: ${mobileWidthMax}) {
    margin: 5px 0;
    order: 1;
  }
`;

export const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  text-transform: uppercase;

  @media (max-width: ${mobileWidthMax}) {
    flex-basis: 100%;
  }
`;

export const StyledParaFirst = styled.p`
  max-width: 130px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  @media (max-width: ${mediumDesktopWidth}) {
    font-size: 18px;
    max-width: 160px;
  }
`;

export const LinkLabel = styled.div`
  padding: 0px 18px;
  color: ${props => (props.color ? props.color : white)};
  font-size: 10px;

  @media (max-width: ${smallDesktopWidth}) {
    padding: 0px 10px;
  }
`;

export const StyledParaSecond = styled.p`
  font-size: 13px;
  font-weight: 600;
  div {
    white-space: nowrap;
  }
  @media (max-width: ${mediumDesktopWidth}) {
    font-size: 10px;
    white-space: nowrap;
    div {
      display: inline-block;
      margin-left: 3px;
    }
  }
`;

export const StyledParaThird = styled.p`
  font-size: 0.83em;
  display: inline-block;
  color: white;
  margin-right: 30px;
  color: ${white};
  font-weight: bold;
`;

export const StyledPopconfirm = styled(Popconfirm)``;

export const StyledSwitch = styled(Switch)`
  background-color: ${classBoardTheme.SwitchColor};
`;

export const StyledDiv = styled.div`
  @media (max-width: ${mobileWidth}) {
    position: absolute;
    right: 5px;
    top: 5px;
  }
`;

export const StyledTabContainer = styled.div`
  width: 100%;

  @media (max-width: ${mobileWidthMax}) {
    margin-top: 15px;
    order: 3;
  }
`;

export const StyledTabs = styled.div`
  min-width: 750px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${mediumDesktopWidth}) {
    min-width: 480px;
  }
  @media (max-width: ${largeDesktopWidth}) {
    min-width: 300px;
  }
`;

export const StyledAnchor = styled.div`
  display: flex;
  font-size: 11px;
  font-weight: 600;
  align-items: center;
  justify-content: center;
  color: ${white};
  width: auto;
  padding: 0px 18px;
  text-align: center;
  height: 45px;
  margin: 0 5px;
  border-radius: 4px;
  background-color: ${props => (props.isActive ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.15)")};
  -webkit-transition: background-color 0.3s;
  transition: background-color 0.3s;
  &:hover {
    color: ${props => (props.isActive ? white : fadedBlue)};
    background-color: ${props => (props.isActive ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.15)")};
  }
  a {
    color: ${props => (props.isActive ? white : fadedBlue)};
  }

  @media (max-width: ${extraDesktopWidth}) {
    font-size: 10px;
  }
  @media (max-width: ${mediumDesktopWidth}) {
    padding: 0px;
    margin: 0px 2px;
    height: 36px;
    svg {
      display: none;
    }
  }
  @media (max-width: ${mobileWidthMax}) {
    flex-basis: 100%;
  }
`;

export const Img = styled.img`
  width: 27px;
  height: 27px;
`;

export const StyledButton = styled.button`
  width: 31px;
  height: 45px;
  background: transparent;
  color: ${white};
  font-size: 12px;
  border: 0px;
  :hover {
    svg {
      fill: ${fadedBlue};
    }
  }
  :focus {
    outline: none;
  }
`;

export const MenuWrapper = styled.div`
  top: 46px;
  position: absolute;
  min-width: 90px;
  right: 10px;
`;

export const StyledTable = styled(Table)`
  .ant-table-body {
    overflow: auto;
    table {
      thead {
        tr {
          th {
            text-align: center;
            font-weight: 900;
          }
        }
      }

      tbody {
        tr {
          td {
            text-align: center;
            font-weight: 900;
          }
        }
      }
    }
  }
  .ant-pagination {
    display: none;
  }
`;

export const PresentModeSwitch = styled(Switch)`
  border-radius: 4px;
  min-width: 100px;
  height: 26px;
  line-height: 24px;
  &:after {
    border-radius: 4px;
    width: 14px;
    height: 22px;
  }
  &:not(.ant-switch-disabled):active::before,
  &:not(.ant-switch-disabled):active::after {
    width: 14px;
  }
  .ant-switch-inner {
    margin-left: 20px;
    margin-right: 6px;
    font-size: 14px;
  }
  &.ant-switch-checked {
    background: ${themeColor};
    .ant-switch-inner {
      margin-right: 20px;
      margin-left: 6px;
    }
  }
`;

const commonButtonsCSS = css`
  color: ${themeColor};
  height: 100%;
  cursor: pointer;
  &:hover,
  &:focus {
    color: ${themeColor};
  }
`;
export const HeaderMenuIcon = styled(Button)`
  ${commonButtonsCSS}
  width: 45px;
`;

export const OpenCloseWrapper = styled.div`
  white-space: nowrap;
`;

export const OpenCloseButton = styled(Button)`
  ${commonButtonsCSS}
  margin-right: 5px;
  padding: 10px 30px;
  font-size: 12px;
  @media (max-width: ${mediumDesktopWidth}) {
    padding: 10px 15px;
    font-size: 10px;
    margin-right: 2px;
  }
`;

export const MenuItems = styled(Menu.Item)`
  font-size: 12px;
  &:not(.ant-dropdown-menu-item-disabled):hover {
    color: ${white};
    background-color: ${themeColor};
  }
`;

export const CaretUp = styled.i`
  position: absolute;
  top: -20px;
  color: ${white};
  right: 12px;
  font-size: 30px;
`;

export const DropMenu = styled(Menu)`
  margin-top: 10px;
  min-width: 175px;
`;

export const StudentStatusDetails = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 30px;
  p {
    background: #f2f2f2;
    padding: 12px 18px;
    border-radius: 5px;
    font-size: 12px;
    color: #8f8f8f;
    text-transform: uppercase;
  }
`;
