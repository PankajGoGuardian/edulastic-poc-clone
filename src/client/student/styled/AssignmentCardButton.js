import styled from "styled-components";
import { Button } from "antd";
import {
  extraDesktopWidth,
  largeDesktopWidth,
  smallDesktopWidth,
  tabletWidth,
  mobileWidthMax
} from "@edulastic/colors";

const StartAssignButton = styled(Button)`
  ${props => (props.theme.zoomLevel == "xs" ? "max-width: 200px; height: 40px;" : "max-width: 300px; height: auto;")}
  width: 150px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  background: ${props => props.theme.assignment.cardDefaultBtnBgColor};
  border: solid 1px ${props => props.theme.assignment.cardDefaultBtnBgHoverColor};
  padding: 5px 20px;
  cursor: pointer;
  height: 40px;
  margin-left: auto;
  &:hover {
    background-color: ${props => props.theme.assignment.cardDefaultBtnBgHoverColor};
    border-color: ${props => props.theme.assignment.cardDefaultBtnBgHoverColor};
    span {
      color: ${props => props.theme.assignment.cardDefaultBtnTextHoverColor};
    }
  }

  &.ant-btn {
    padding: 5px 20px;
  }

  span {
    color: ${props => props.theme.assignment.cardDefaultBtnTextColor};
    font-size: ${props => props.theme.assignment.cardDefaultBtnFontSize};
    font-weight: 600;
    letter-spacing: 0.2px;
  }

  @media (max-width: ${extraDesktopWidth}) {
    width: 150px;
  }
  @media (max-width: ${largeDesktopWidth}) {
    height: 36px;
    span {
      font-size: 9px;
    }
  }
  @media screen and (max-width: ${smallDesktopWidth}) {
    width: 120px;
  }
  @media screen and (max-width: ${tabletWidth}) {
    margin-top: 0px;
  }
  @media screen and (max-width: ${mobileWidthMax}) {
    ${props => props.assessment && "margin-top: 10px;margin-left:0px;"}
  }
`;

export default StartAssignButton;
