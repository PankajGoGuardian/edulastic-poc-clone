import { Link } from "react-router-dom";
import { Card, Checkbox, Button } from "antd";
import styled from "styled-components";
import { FlexContainer } from "@edulastic/common";
import { mobileWidth } from "@edulastic/colors";
import { themes } from "../../../../student/themes";

const classBoardTheme = themes.default.classboard;

export const Anchor = styled.a`
  color: #69727e;
`;
export const AnchorLink = styled(Link)`
  color: #69727e;
`;

export const PaginationInfo = styled.span`
  font-weight: 600;
  display: inline-block;
  font-size: 11px;
  word-spacing: 5px;
  color: #69727e;
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
  background-color: ${({ active }) => (active ? "#00AD50" : "#FFFFFF")};
  color: ${({ active }) => (active ? "#FFFFFF" : "#7C848E")};
  &:hover {
    background-color: ${({ active }) => (active ? "#00AD50" : "#42d184")};
    color: #ffffff;
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
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding-left: 15px;
  padding-right: 25px;
  color: #00ad50;
  img {
    margin-right: 10px;
  }
`;

export const PrintButton = styled(StyledTabButton)`
  margin-left: auto;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding-left: 15px;
  padding-right: 25px;
  color: #00ad50;
  img {
    margin-right: 10px;
  }
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
