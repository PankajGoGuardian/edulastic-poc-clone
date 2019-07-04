import { Link } from "react-router-dom";
import { Card, Checkbox, Button, Menu } from "antd";
import styled from "styled-components";
import { FlexContainer } from "@edulastic/common";
import { mobileWidth, themeColor, white, linkColor, tabGrey, mainTextColor } from "@edulastic/colors";
import { themes } from "../../../../student/themes";

const classBoardTheme = themes.default.classboard;
export const Anchor = styled.a`
  color: ${linkColor};
`;
export const AnchorLink = styled(Link)`
  color: ${linkColor};
`;

export const PaginationInfo = styled.span`
  font-weight: 600;
  display: inline-block;
  font-size: 11px;
  word-spacing: 5px;
  color: ${linkColor};
  @media (max-width: ${mobileWidth}) {
    display: none;
  }
`;

export const CheckContainer = styled.span`
  font-weight: bold;
  display: inline-block;
  font-size: 15px;
  > span {
    margin-left: 0;
  }
  .ant-checkbox-wrapper:hover .ant-checkbox-inner,
  .ant-checkbox:hover .ant-checkbox-inner,
  .ant-checkbox-input:focus + .ant-checkbox-inner {
    border-color: ${props => props.theme.checkbox.checkboxCheckedColor};
  }
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${props => props.theme.checkbox.checkboxCheckedColor};
    border-color: ${props => props.theme.checkbox.checkboxCheckedColor};
  }
  .ant-checkbox-indeterminate .ant-checkbox-inner::after {
    background-color: ${props => props.theme.checkbox.checkboxCheckedColor};
  }
`;

export const ButtonGroup = styled.div`
  display: inline-block;
`;

export const StyledFlexContainer = styled(FlexContainer)`
  width: 95%;
  margin: 20px auto;
  margin-bottom: ${({ marginBottom }) => marginBottom || "20px"};
  padding-right: ${({ paddingRight }) => paddingRight || "0px"};
`;

export const GraphContainer = styled(FlexContainer)`
  width: 95%;
  margin: 20px auto;
  padding-right: 20px;
  @media (max-width: ${mobileWidth}) {
    padding-right: 5px;
  }
`;

export const StudentGrapContainer = styled(FlexContainer)`
  width: 95%;
  margin: 20px auto;
`;

export const StyledCard = styled(Card)`
  width: 100%;
  border-radius: 10px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  .ant-card-body {
    padding: 30px 30px 15px 30px;
    padding-top: ${({ paddingTop }) => paddingTop}px;
  }
`;

export const StudentButtonDiv = styled.div`
  margin-right: 20px !important;
  .ant-btn-primary {
    background-color: #0e93dc;
  }
  @media (max-width: ${mobileWidth}) {
    margin: auto;
  }
`;

const StyledTabButton = styled.a`
  height: 28px;
  padding: 6px 35px;
  font-size: 11px;
  font-weight: 600;
  background-color: ${({ active }) => (active ? themeColor : white)};
  color: ${({ active }) => (active ? white : tabGrey)};
  &:hover {
    background-color: ${themeColor};
    color: ${white};
  }
`;
export const BothButton = styled(StyledTabButton)`
  border-radius: 4px 0px 0px 4px;
`;

export const StudentButton = styled(StyledTabButton)`
  border-radius: 0px;
  margin: 0px 2px;
`;

export const QuestionButton = styled(StyledTabButton)`
  border-radius: 0px 4px 4px 0px;
`;

export const RedirectButton = styled(StyledTabButton)`
  border-radius: ${props => (props.first ? "4px 0 0 4px" : props.last ? "0 4px 4px 0" : 0)};
  display: flex;
  width: 150px;
  color: ${themeColor};
  margin-right: ${props => (!props.last ? "3px" : "")};
  position: relative;
  justify-content: center;
  &:hover {
    svg {
      fill: ${white};
      path,
      circle {
        fill: ${white};
      }
    }
  }
  svg {
    fill: ${themeColor};
    path,
    circle {
      fill: ${themeColor};
    }
  }
`;

export const DropMenu = styled(Menu)`
  margin-top: 10px;
`;

export const MenuItems = styled(Menu.Item)`
  display: flex;
  align-items: center;
  &:hover {
    svg {
      fill: ${white};
      path {
        fill: ${white};
      }
    }
  }
  svg {
    fill: ${mainTextColor};
    width: 15px;
    margin-right: 10px;
    path {
      fill: ${mainTextColor};
    }
  }
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

export const ButtonIconWrap = styled.span`
  display: block;
  left: 10px;
  position: absolute;
`;

export const BarDiv = styled.div`
  width: 1px;
  height: 30px;
  background-color: ${classBoardTheme.headerBarbgcolor};
  display: inline-block;
  margin-bottom: -6px;
`;

export const StyledCheckbox = styled(Checkbox)`
  font-size: 0.7em;
  color: ${props => props.theme.checkbox.checkboxLabelColor};
`;

export const SpaceDiv = styled.div`
  display: inline-block;
  width: 20px;
`;

export const ButtonSpace = styled.div`
  display: inline-block;
  width: 13px;
`;

export const ClassBoardFeats = styled.div`
  display: flex;
  box-shadow: 0px 3px 20px 0px rgb(210, 210, 217);
`;

export const StyledButton = styled(Button)`
  font-size: 0.7em;
  background-color: transparent;
  margin: 0px 23px 0px -5px;
  width: 100px;
  height: 25px;
  color: ${classBoardTheme.headerButtonColor};
  border: 1px solid #00b0ff;
  font-weight: bold;
`;

export const StyledAnc = styled(Button)`
  cursor: grab;
  background-color: transparent;
  border: none;
  outline: none;
  :hover {
    background-color: transparent;
    border: none;
    outline: none;
  }
  :active {
    background-color: transparent;
    border: none;
    outline: none;
  }
`;
