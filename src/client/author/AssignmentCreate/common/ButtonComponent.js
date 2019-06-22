import styled from "styled-components";
import { greenDark, green, white, newBlue, darkBlue } from "@edulastic/colors";

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
          color: "#42d184",
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
          background: white,
          color: "#00AD50",
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
`;

export default ButtonComponent;
