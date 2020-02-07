import styled from "styled-components";
import { white, greyThemeDark2 } from "@edulastic/colors";
import { Button } from "antd";

export const AddNewChoiceBtn = styled(Button)`
  &.ant-btn {
    background: ${props => (props.ghost ? "transparent" : props.bg || greyThemeDark2)};
    color: ${props => (props.ghost ? greyThemeDark2 : props.color || white)};
    width: ${props => props.width || "220px"};
    height: ${props => props.height || "40px"};
    padding: ${props => props.padding || "0px 30px"};
    margin: ${props => props.margin || "15px 0px 0px"};
    border: ${props => (props.ghost ? `1px solid ${greyThemeDark2}` : "0px")} !important;
    border-radius: ${props => (props.rounded ? "15px" : "4px")};
    display: ${props => props.display || "flex"};
    align-items: center;
    justify-content: center;
    cursor: pointer;
    text-transform: uppercase;
    font-size: ${props => props.theme.common.addNewChoiceButtonFontSize};
    font-weight: ${props => props.theme.common.addNewChoiceButtonFontWeight};
    letter-spacing: 0.2px;

    &:hover,
    &:focus,
    &:active {
      background: ${props => (props.ghost ? "transparent" : props.bg || greyThemeDark2)};
      color: ${props => (props.ghost ? greyThemeDark2 : props.color || white)};
    }
  }
`;
