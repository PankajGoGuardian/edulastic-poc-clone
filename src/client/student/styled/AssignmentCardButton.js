import styled from "styled-components";
import { Button } from "antd";

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
  margin: 10px 15px 0 10px;
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
  @media screen and (min-width: 1025px) {
    margin-right: 0px;
  }
  @media screen and (max-width: 768px) {
    max-width: 80%;
    margin: 10px 0 0;
  }
  @media screen and (max-width: 767px) {
    max-width: 100%;
  }
`;

export default StartAssignButton;
