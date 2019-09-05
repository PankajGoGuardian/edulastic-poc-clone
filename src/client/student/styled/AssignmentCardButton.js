import styled from "styled-components";
import { Button } from "antd";
import { extraDesktopWidth, largeDesktopWidth, mobileWidthMax } from "@edulastic/colors";

const StartAssignButton = styled(Button)`
  max-width: 200px;
  height: 40px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  background: ${props => props.theme.assignment.cardDefaultBtnBgColor};
  border: solid 1px ${props => props.theme.assignment.cardDefaultBtnBgHoverColor};
  width: 100%;
  padding: 5px 20px;
  cursor: pointer;
  float: right;
  margin: 18px 15px 0 10px;

  span {
    color: ${props => props.theme.assignment.cardDefaultBtnTextColor};
    font-size: ${props => props.theme.assignment.cardDefaultBtnFontSize};
    font-weight: 600;
    letter-spacing: 0.2px;
  }

  &:hover {
    background-color: ${props => props.theme.assignment.cardDefaultBtnBgHoverColor};
    border-color: ${props => props.theme.assignment.cardDefaultBtnBgHoverColor};
    span {
      color: ${props => props.theme.assignment.cardDefaultBtnTextHoverColor};
    }
  }

  @media (max-width: ${extraDesktopWidth}) {
    width: auto;
    margin: 32px 15px 0 10px;
  }

  @media (max-width: ${largeDesktopWidth}) {
    margin: 21px -5px 0 10px;
    height: 36px;

    span {
      font-size: 9px;
    }
  }

  @media screen and (min-width: 1025px) {
    margin-right: 0px;
  }

  @media screen and (max-width: 768px) {
    margin: 20px auto 0px auto
    width: 70%;
    float: none;
  }
`;

export default StartAssignButton;
