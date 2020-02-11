import { white, greyThemeDark2 } from "@edulastic/colors";
import styled from "styled-components";
import { CustomStyleBtn } from "../../../styled/ButtonStyles";

export const ModeButton = styled(CustomStyleBtn)`
  &.ant-btn {
    width: auto;
    height: 30px;
    padding: 0px 10px;
    margin: 0px 10px 0px 0px;
    color: ${props => (props.active ? white : greyThemeDark2)};
    background: ${props => (props.active ? greyThemeDark2 : white)};
    border: 1px solid ${greyThemeDark2} !important;
  }
`;
