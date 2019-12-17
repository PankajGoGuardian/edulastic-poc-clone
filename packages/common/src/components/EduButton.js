import React from "react";
import { Button } from "antd";
import styled from "styled-components";
import { white, themeColorLight, themeColor, mediumDesktopExactWidth } from "@edulastic/colors";

const EduButton = ({ children, ...restProps }) => <StyledButton {...restProps}>{children}</StyledButton>;

export default EduButton;

const StyledButton = styled(Button)`
  ${props => {
    let style = {
      fontWeight: 600,
      fontSize: "11px",
      textTransform: "uppercase",
      color: themeColor,
      marginLeft: "5px"
    };
    if (props.type === "secondary") {
      style = {
        ...style,
        ...{
          background: themeColorLight,
          color: white,
          border: "none",
          ":hover, :focus": {
            background: themeColorLight,
            color: white
          }
        }
      };
    }
    if (props.type === "primary") {
      style = {
        ...style,
        ...{
          background: themeColor,
          color: white,
          border: "none",
          ":hover, :focus": {
            background: themeColor,
            color: white
          }
        }
      };
    }

    return style;
  }};
  &:hover,
  &:focus {
    border-color: ${themeColor};
    outline-color: ${themeColor};
    color: ${({ type }) => (type === "primary" ? white : themeColor)};
  }
`;
