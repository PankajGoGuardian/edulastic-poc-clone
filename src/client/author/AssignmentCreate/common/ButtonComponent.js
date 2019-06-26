import styled from "styled-components";
import { themeColor, white } from "@edulastic/colors";

const ButtonComponent = styled.button`
  ${props => {
    let style = {
      fontWeight: 600,
      fontSize: "11px",
      padding: "15px 85px",
      textTransform: "uppercase",
      borderRadius: "5px",
      cursor: "pointer",
      boxShadow: "3px 7px 20px 0px rgba(0, 0, 0, 0.1)",
      marginBottom: "10px"
    };
    if (props.type === "secondary") {
      style = {
        ...style,
        ...{
          background: white,
          color: themeColor,
          border: "none",
          ":hover, :focus": {
            background: themeColor,
            "border-color": themeColor,
            "outline-color": themeColor,
            color: white
          }
        }
      };
    }
    if (props.type === "primary") {
      style = {
        ...style,
        ...{
          background: white,
          color: themeColor,
          border: "none",
          ":hover, :focus": {
            background: themeColor,
            "border-color": themeColor,
            "outline-color": themeColor,
            color: white
          }
        }
      };
    }

    return style;
  }};
`;

export default ButtonComponent;
