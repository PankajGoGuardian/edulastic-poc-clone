import React from "react";
import { Button } from "antd";
import styled from "styled-components";
import { green, white, greenDark, lightBlueSecondary, newBlue, darkBlue } from "@edulastic/colors";

const EduButton = ({ children, ...restProps }) => <StyledButton {...restProps}>{children}</StyledButton>;

export default EduButton;

const StyledButton = styled(Button)`
  ${props => {
    let style = {
      fontWeight: 600,
      fontSize: "11px",
      textTransform: "uppercase",
      color: "#00AD50"
    };
    if (props.type === "secondary") {
      style = {
        ...style,
        ...{
          background: "#42d184",
          color: white,
          border: "none",
          ":hover, :focus": {
            background: "#42d184",
            color: white
          }
        }
      };
    }
    if (props.type === "primary") {
      style = {
        ...style,
        ...{
          background: "#00AD50",
          color: white,
          border: "none",
          ":hover, :focus": {
            background: "#00AD50",
            color: white
          }
        }
      };
    }

    return style;
  }};
  &:hover,
  &:focus {
    border-color: #00ad50;
    outline-color: #00ad50;
    color: ${({ type }) => (type === "primary" ? white : "#00ad50")};
  }
`;
