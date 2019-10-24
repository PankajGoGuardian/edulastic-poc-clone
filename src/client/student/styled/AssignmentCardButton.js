import styled from "styled-components";
import { Button } from "antd";
import { extraDesktopWidth, largeDesktopWidth, smallDesktopWidth, tabletWidth } from "@edulastic/colors";

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
  float: right;
  margin: 20px 0px 0px;

  &:hover {
    background-color: ${props => props.theme.assignment.cardDefaultBtnBgHoverColor};
    border-color: ${props => props.theme.assignment.cardDefaultBtnBgHoverColor};
    span {
      color: ${props => props.theme.assignment.cardDefaultBtnTextHoverColor};
    }
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
    margin-top: 10px;
  }

  ${({ theme }) =>
    theme.respondTo.lg`
      max-width: 400px;
    `}

  ${({ theme }) =>
    theme.respondTo.xl`
      margin: 20px auto 0px auto
      width: 70%;
      float: none;
      max-width: 500px;
    `}
`;

export default StartAssignButton;
