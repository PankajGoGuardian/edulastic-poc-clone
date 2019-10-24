import { Card, Checkbox, Button, Menu, Col } from "antd";
import styled from "styled-components";
import { FlexContainer } from "@edulastic/common";
import {
  mobileWidth,
  mobileWidthLarge,
  mobileWidthMax,
  mediumDesktopWidth,
  themeColor,
  white,
  tabGrey,
  mainTextColor,
  title,
  green,
  red,
  black,
  cardTitleColor,
  desktopWidth
} from "@edulastic/colors";
import { themes } from "../../../../theme";

const classBoardTheme = themes.default.classboard;

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

export const CardDetailsContainer = styled.div`
  width: 100%;
  padding: 20px 30px;

  @media (max-width: ${mobileWidthMax}) {
    padding: 20px;
  }
`;

export const StyledFlexContainer = styled(FlexContainer)`
  width: 100%;
  margin-bottom: ${({ marginBottom }) => marginBottom || "15px"};
  padding-right: ${({ paddingRight }) => paddingRight || "0px"};
`;

export const GraphContainer = styled(FlexContainer)`
  width: 100%;
  margin-bottom: 15px;
`;

export const StudentGrapContainer = styled(FlexContainer)`
  width: 100%;
  margin-bottom: 15px;
`;

export const StyledCard = styled(Card)`
  width: 100%;
  border-radius: 10px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  .ant-card-body {
    padding: 20px;
  }

  @media (max-width: ${mobileWidth}) {
    .ant-card-body {
      padding: 15px;
    }
  }
`;

export const StudentButtonDiv = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: flex-end;

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
  font-size: 10px;
  font-weight: 600;
  background-color: ${({ active }) => (active ? themeColor : white)};
  color: ${({ active }) => (active ? white : tabGrey)};
  &:hover {
    background-color: ${themeColor};
    color: ${white};
  }

  @media (max-width: ${mediumDesktopWidth}) {
    padding: 6px 30px;
  }
  @media (max-width: ${desktopWidth}) {
    padding: 6px 15px;
  }
  @media (max-width: ${mobileWidthLarge}) {
    width: 100%;
    text-align: center;
    margin: 0 !important;
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
  border-radius: 0;
  display: flex;
  width: 150px;
  color: ${themeColor};
  margin-right: 2px;
  position: relative;
  justify-content: center;
  &:nth-child(1) {
    border-radius: 4px 0 0 4px;
  }
  &:nth-last-child(1) {
    border-radius: 0 4px 4px 0;
    margin-right: 0px;
  }
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

  @media (max-width: ${mediumDesktopWidth}) {
    width: 130px;
  }
  @media (max-width: ${mobileWidthLarge}) {
    width: auto;
    padding: 6px 12px;
    svg {
      display: none;
    }
  }
`;

export const DropMenu = styled(Menu)`
  margin-top: 10px;
  width: 190px;
`;

export const MenuItems = styled(Menu.Item)`
  display: flex;
  align-items: center;
  font-size: 11px;
  color: ${title};
  font-weight: 600;
  &:hover {
    svg {
      fill: ${white};
      path {
        fill: ${white};
        stroke: ${white};
      }
    }
  }
  svg,
  i {
    fill: ${mainTextColor};
    height: 12px;
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
  border-radius: 4px;
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

export const ScoreHeader = styled.div`
  font-size: 11px;
  margin-bottom: 5px;
  color: ${cardTitleColor};
  font-weight: 800;
`;

export const ScoreChangeWrapper = styled.div`
  color: ${props => (props.scoreChange > 0 ? green : props.scoreChange < 0 ? red : cardTitleColor)};
  font-size: 30px;
  font-weight: 800;
`;

export const ScoreWrapper = styled.div`
  font-size: 30px;
  color: ${black};
`;

export const GraphWrapper = styled.div`
  @media (max-width: ${mobileWidthMax}) {
    flex-direction: column;
  }
`;

export const InfoWrapper = styled.div`
  @media (max-width: ${mobileWidthMax}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
  }
`;
