import styled from "styled-components";
import { mediumDesktopExactWidth } from "@edulastic/colors";

export const Label = styled.label`
  font-size: ${props => props.theme.smallFontSize};
  font-weight: ${props => props.theme.widgetOptions.labelFontWeight};
  font-style: ${props => props.theme.widgetOptions.labelFontStyle};
  font-stretch: ${props => props.theme.widgetOptions.labelFontStretch};
  line-height: 1.38;
  letter-spacing: -0.4px;
  text-align: left;
  color: ${props => props.theme.widgetOptions.labelColor};
  display: ${props => (props.display ? props.display : "block")};
  text-transform: uppercase;
  margin-top: ${props => props.mt || "0px"};
  margin-right: ${props => props.mr || "0px"};
  margin-bottom: ${({ marginBottom }) => marginBottom || "6px"};
  margin-left: ${props => props.ml || "0px"};
  padding-top: ${props => (props.top ? `${props.top}px` : 0)};
  padding-bottom: ${props => (props.bottom ? `${props.bottom}px` : 0)};
  padding-left: ${props => (props.left ? `${props.left}px` : 0)};
  padding-right: ${props => (props.right ? `${props.right}px` : 0)};

  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: ${props => props.theme.widgetOptions.labelFontSize};
  }
`;
