import styled from "styled-components";
import { mainTextColor } from "@edulastic/colors";

const Subtitle = styled.h3`
  font-weight: 600;
  line-height: 1.38;
  letter-spacing: 0.2px;
  color: ${mainTextColor};
  padding-right: 8px;
  text-transform: uppercase;
  text-align: ${({ direction }) => {
    if (direction === "row" || direction === "row-reverse") {
      return "center";
    }
    return "left";
  }};
`;

export default Subtitle;
