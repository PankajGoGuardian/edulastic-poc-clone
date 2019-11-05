import styled from "styled-components";
import { themeColor, white } from "@edulastic/colors";

const ButtonComponent = styled.button`
  ${props => {
    let style = {
      width: "234px",
      height: "45px",
      fontWeight: 600,
      fontSize: "11px",
      padding: "15px 50px",
      textTransform: "uppercase",
      borderRadius: "5px",
      cursor: "pointer",
      boxShadow: "0px 2px 4px rgba(201, 208, 219, 0.5)",
      marginBottom: "10px",
      whiteSpace: "nowrap"
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
