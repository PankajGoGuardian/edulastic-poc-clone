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
      color: lightBlueSecondary
    };
    if (props.type === "secondary") {
      style = {
        ...style,
        ...{
          background: green,
          color: white,
          border: "none",
          ":hover, :focus": {
            background: greenDark,
            color: white
          }
        }
      };
    }
    if (props.type === "primary") {
      style = {
        ...style,
        ...{
          background: newBlue,
          color: white,
          border: "none",
          ":hover, :focus": {
            background: darkBlue,
            color: white
          }
        }
      };
    }

    return style;
  }};
`;
